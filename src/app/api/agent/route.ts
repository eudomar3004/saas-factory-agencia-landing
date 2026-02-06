import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .single()

  if (!agent) {
    return NextResponse.json({ error: 'No active agent found' }, { status: 404 })
  }

  return NextResponse.json(agent)
}

export async function PUT(req: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id, name, description, system_prompt, model_id, temperature, max_tokens, classification_topics } = body

  if (!id) {
    return NextResponse.json({ error: 'Agent ID required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('agents')
    .update({
      name,
      description,
      system_prompt,
      model_id,
      temperature,
      max_tokens,
      classification_topics,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
