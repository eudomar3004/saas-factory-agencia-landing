import { openrouter, MODELS } from '@/lib/ai/openrouter'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { createClient } from '@/lib/supabase/server'

const FALLBACK_SYSTEM_PROMPT = `Eres Levy, el asistente de ventas de una agencia de desarrollo de software personalizado.

Tu objetivo principal es entender las necesidades del visitante y direccionarlo a WhatsApp para una consulta gratuita.

Lo que ofreces:
- Software a medida (ERPs, CRMs, dashboards, aplicaciones web)
- Automatizacion con IA (agentes conversacionales, procesamiento de documentos, workflows)
- Plataformas SaaS y aplicaciones escalables
- Modernizacion de sistemas legacy
- Integraciones y APIs

Reglas:
- Responde SIEMPRE en espanol
- Se conciso y directo (maximo 2-3 oraciones por respuesta)
- Muestra interes genuino en el problema del visitante
- Despues de 2-3 intercambios, sugiere continuar la conversacion por WhatsApp para un diagnostico gratuito
- Nunca des precios especificos, di que depende del alcance y que en WhatsApp pueden platicarlo mejor
- Usa un tono profesional pero cercano, como un consultor amigable
- Si preguntan algo tecnico, responde brevemente y redirige a WhatsApp para profundizar`

const SESSION_GAP_MS = 4 * 60 * 60 * 1000 // 4 horas

interface AgentConfig {
  id: string
  system_prompt: string
  model_id: string
  temperature: number
  max_tokens: number
}

async function getAgent(supabase: Awaited<ReturnType<typeof createClient>>): Promise<AgentConfig> {
  const { data } = await supabase
    .from('agents')
    .select('id, system_prompt, model_id, temperature, max_tokens')
    .eq('is_active', true)
    .single()

  if (data) return data as AgentConfig

  return {
    id: '00000000-0000-0000-0000-000000000000',
    system_prompt: FALLBACK_SYSTEM_PROMPT,
    model_id: MODELS.fast,
    temperature: 0.7,
    max_tokens: 500,
  }
}

async function getOrCreateConversation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  agentId: string,
  visitorId: string
): Promise<string> {
  // Buscar conversacion reciente de este visitor
  const { data: existing } = await supabase
    .from('conversations')
    .select('id, updated_at')
    .eq('visitor_id', visitorId)
    .eq('agent_id', agentId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) {
    const lastActivity = new Date(existing.updated_at).getTime()
    const now = Date.now()
    if (now - lastActivity < SESSION_GAP_MS) {
      return existing.id
    }
  }

  // Crear nueva conversacion
  const { data, error } = await supabase
    .from('conversations')
    .insert({ agent_id: agentId, visitor_id: visitorId })
    .select('id')
    .single()

  if (error || !data) {
    throw new Error('Failed to create conversation')
  }

  return data.id
}

export async function POST(req: Request) {
  const startTime = Date.now()
  const { messages, visitorId }: { messages: UIMessage[]; visitorId?: string } = await req.json()

  const supabase = await createClient()
  const agent = await getAgent(supabase)

  // Persistir si hay visitorId (fire-and-forget pattern)
  let conversationId: string | null = null
  if (visitorId) {
    try {
      conversationId = await getOrCreateConversation(supabase, agent.id, visitorId)

      // Guardar ultimo mensaje del usuario (fire-and-forget)
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
      if (lastUserMsg) {
        const textContent = lastUserMsg.parts
          ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map(p => p.text)
          .join('') || ''

        if (textContent) {
          supabase.from('messages').insert({
            conversation_id: conversationId,
            role: 'user',
            content: textContent,
          }).then(() => {
            // Actualizar updated_at de la conversacion
            supabase.from('conversations')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', conversationId!)
              .then(() => {})
          })
        }
      }
    } catch (e) {
      // No bloquear el chat si falla la persistencia
      console.error('Persistence error:', e)
    }
  }

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: openrouter(agent.model_id || MODELS.fast),
    system: agent.system_prompt,
    messages: modelMessages,
    temperature: agent.temperature,
    maxOutputTokens: agent.max_tokens,
    onFinish: async ({ text, usage }) => {
      // Guardar respuesta del assistant (fire-and-forget)
      if (conversationId && text) {
        const processingTime = Date.now() - startTime
        supabase.from('messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: text,
          tokens_used: usage?.totalTokens ?? null,
          model_used: agent.model_id,
          processing_time_ms: processingTime,
        }).then(() => {
          supabase.from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId!)
            .then(() => {})
        })
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
