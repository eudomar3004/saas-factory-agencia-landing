import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Verificar auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Paginacion
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  // Obtener sesiones con clasificacion
  const { data: sessions, count } = await supabase
    .from('conversation_sessions')
    .select(`
      id,
      conversation_id,
      first_message_at,
      last_message_at,
      message_count,
      user_message_count,
      assistant_message_count,
      transcript,
      classification,
      classified_at
    `, { count: 'exact' })
    .order('first_message_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return NextResponse.json({
    sessions: sessions || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}
