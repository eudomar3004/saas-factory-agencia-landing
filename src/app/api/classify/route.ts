import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SESSION_GAP_MS = 4 * 60 * 60 * 1000

interface ClassificationResult {
  topics: string[]
  intent: 'learning' | 'troubleshooting' | 'exploration' | 'onboarding' | 'feedback'
  quality: 'high' | 'medium' | 'low' | 'spam'
  summary: string
  flags: {
    frustration_detected: boolean
    escalation_needed: boolean
    bug_reported: boolean
    resolved: boolean
  }
}

export async function POST() {
  const supabase = await createClient()

  // Verificar auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Obtener agente activo con topics
  const { data: agent } = await supabase
    .from('agents')
    .select('id, classification_topics')
    .eq('is_active', true)
    .single()

  if (!agent?.classification_topics) {
    return NextResponse.json({ error: 'No active agent with classification topics' }, { status: 404 })
  }

  // Obtener conversaciones del agente
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, visitor_id')
    .eq('agent_id', agent.id)

  if (!conversations || conversations.length === 0) {
    return NextResponse.json({ created: 0, classified: 0 })
  }

  let sessionsCreated = 0
  let sessionsClassified = 0

  for (const conversation of conversations) {
    const { data: messages } = await supabase
      .from('messages')
      .select('role, content, created_at')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })

    if (!messages || messages.length === 0) continue

    // Segmentar en sesiones por gap de 4 horas
    const messageSessions: Array<typeof messages> = []
    let currentSession: typeof messages = []

    messages.forEach((msg, index) => {
      if (index === 0) {
        currentSession.push(msg)
        return
      }
      const prevTime = new Date(messages[index - 1].created_at).getTime()
      const currTime = new Date(msg.created_at).getTime()

      if (currTime - prevTime > SESSION_GAP_MS) {
        messageSessions.push(currentSession)
        currentSession = [msg]
      } else {
        currentSession.push(msg)
      }
    })
    if (currentSession.length > 0) messageSessions.push(currentSession)

    for (const sessionMsgs of messageSessions) {
      const firstMsg = sessionMsgs[0]
      const lastMsg = sessionMsgs[sessionMsgs.length - 1]
      const userMsgs = sessionMsgs.filter(m => m.role === 'user')
      const assistantMsgs = sessionMsgs.filter(m => m.role === 'assistant')

      // Verificar si ya existe
      const { data: existing } = await supabase
        .from('conversation_sessions')
        .select('id, classification')
        .eq('conversation_id', conversation.id)
        .eq('first_message_at', firstMsg.created_at)
        .single()

      if (existing?.classification) continue // Ya clasificada

      const transcript = sessionMsgs
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n\n')

      let sessionId = existing?.id

      if (!sessionId) {
        const { data: newSession } = await supabase
          .from('conversation_sessions')
          .insert({
            agent_id: agent.id,
            conversation_id: conversation.id,
            first_message_at: firstMsg.created_at,
            last_message_at: lastMsg.created_at,
            message_count: sessionMsgs.length,
            user_message_count: userMsgs.length,
            assistant_message_count: assistantMsgs.length,
            transcript,
          })
          .select('id')
          .single()

        if (!newSession) continue
        sessionId = newSession.id
        sessionsCreated++
      }

      // Clasificar con LLM
      const classification = await classifySession(
        transcript,
        agent.classification_topics as string[]
      )

      if (classification) {
        await supabase
          .from('conversation_sessions')
          .update({
            classification,
            classified_at: new Date().toISOString(),
            classified_by_model: 'google/gemini-3-flash-preview',
            // Actualizar transcript y conteos si la sesion ya existia
            transcript,
            message_count: sessionMsgs.length,
            user_message_count: userMsgs.length,
            assistant_message_count: assistantMsgs.length,
            last_message_at: lastMsg.created_at,
          })
          .eq('id', sessionId)

        sessionsClassified++
      }
    }
  }

  return NextResponse.json({ created: sessionsCreated, classified: sessionsClassified })
}

async function classifySession(
  transcript: string,
  topics: string[]
): Promise<ClassificationResult | null> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return null

    const prompt = `Analiza esta conversacion y clasificala.

TRANSCRIPT:
${transcript}

TOPICS DISPONIBLES: ${topics.join(', ')}

Responde SOLO con JSON valido (sin markdown, sin backticks):
{
  "topics": ["topic1", "topic2"],
  "intent": "learning|troubleshooting|exploration|onboarding|feedback",
  "quality": "high|medium|low|spam",
  "summary": "breve resumen en espanol",
  "flags": {
    "frustration_detected": boolean,
    "escalation_needed": boolean,
    "bug_reported": boolean,
    "resolved": boolean
  }
}`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    })

    if (!response.ok) return null

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return null

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    return JSON.parse(jsonMatch[0])
  } catch {
    return null
  }
}
