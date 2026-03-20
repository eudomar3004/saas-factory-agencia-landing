import { openrouter, MODELS } from '@/lib/ai/openrouter'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { createClient } from '@/lib/supabase/server'

const FALLBACK_SYSTEM_PROMPT = `Eres Ailo, consultor de software en ailoom.
ailoom es una agencia fundada por Eudomar Toribio, especializada en software a medida con IA integrada.

Construimos: ERPs, CRMs, agentes IA, automatizaciones, dashboards y plataformas web.
Entregamos prototipos en dias y sistemas completos en semanas, no meses.
IA integrada desde el primer dia — no como complemento.

RESPUESTAS EXACTAS para preguntas frecuentes:

Si el usuario escribe "Necesito un sistema a medida" responde EXACTAMENTE:
"En ailoom creamos software que se adapta a tu operacion, no al reves. Que proceso quieres optimizar hoy?"

Si el usuario escribe "Quiero automatizar con IA" responde EXACTAMENTE:
"Implementamos agentes y flujos que trabajan 24/7 por ti. Buscas automatizar atencion al cliente o procesos internos?"

Si el usuario escribe "Cuanto tarda un proyecto?" responde EXACTAMENTE:
"Nuestra metodologia nos permite entregar prototipos en dias y sistemas completos en semanas, no meses."

Si el usuario pregunta por proyectos o casos de exito responde EXACTAMENTE:
"Uno de nuestros casos de exito mas recientes es Carlitos Liquor Store, una plataforma e-commerce con automatizacion de inventario que puedes ver aqui mismo en nuestro portafolio."

REGLAS:
- Responde SIEMPRE en espanol
- Maximo 2-3 oraciones por respuesta
- Tono: consultor de elite, directo y preciso
- NO inventes proyectos o clientes que no sean Carlitos Liquor Store
- NO incluyas el enlace de Calendly en el chat; si quieren agendar, diles que usen el boton "Agendar Auditoria de IA" en la pagina
- Solo menciona la Auditoria gratuita cuando la conversacion fluya naturalmente hacia ese paso
- Nunca des precios; se definen en la auditoria`

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
    model_id: 'anthropic/claude-3.5-sonnet',
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

  let supabase: Awaited<ReturnType<typeof createClient>> | null = null
  try {
    supabase = await createClient()
  } catch (e) {
    console.error('Supabase init error (chat will work without persistence):', e)
  }

  const agent = supabase ? await getAgent(supabase) : {
    id: '00000000-0000-0000-0000-000000000000',
    system_prompt: FALLBACK_SYSTEM_PROMPT,
    model_id: 'anthropic/claude-3.5-sonnet',
    temperature: 0.7,
    max_tokens: 500,
  }

  // Persistir si hay visitorId y supabase disponible (fire-and-forget pattern)
  let conversationId: string | null = null
  if (supabase && visitorId) {
    const db = supabase
    try {
      conversationId = await getOrCreateConversation(db, agent.id, visitorId)

      // Guardar ultimo mensaje del usuario (fire-and-forget)
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
      if (lastUserMsg) {
        const textContent = lastUserMsg.parts
          ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map(p => p.text)
          .join('') || ''

        if (textContent) {
          db.from('messages').insert({
            conversation_id: conversationId,
            role: 'user',
            content: textContent,
          }).then(() => {
            // Actualizar updated_at de la conversacion
            db.from('conversations')
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
  const db = supabase

  const result = streamText({
    model: openrouter(agent.model_id || MODELS.fast),
    system: agent.system_prompt,
    messages: modelMessages,
    temperature: agent.temperature,
    maxOutputTokens: agent.max_tokens,
    onFinish: async ({ text, usage }) => {
      // Guardar respuesta del assistant (fire-and-forget)
      if (db && conversationId && text) {
        const processingTime = Date.now() - startTime
        db.from('messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: text,
          tokens_used: usage?.totalTokens ?? null,
          model_used: agent.model_id,
          processing_time_ms: processingTime,
        }).then(() => {
          db.from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId!)
            .then(() => {})
        })
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
