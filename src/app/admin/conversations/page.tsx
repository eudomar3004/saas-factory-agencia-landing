'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, X } from 'lucide-react'

interface Classification {
  topics?: string[]
  intent?: string
  quality?: string
  summary?: string
  flags?: {
    frustration_detected?: boolean
    escalation_needed?: boolean
    bug_reported?: boolean
    resolved?: boolean
  }
}

interface Session {
  id: string
  conversation_id: string
  first_message_at: string
  last_message_at: string
  message_count: number
  user_message_count: number
  assistant_message_count: number
  transcript: string | null
  classification: Classification | null
  classified_at: string | null
}

export default function ConversationsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Session | null>(null)

  useEffect(() => { fetchSessions() }, [page])

  async function fetchSessions() {
    setLoading(true)
    try {
      const res = await fetch(`/api/conversations?page=${page}&limit=20`)
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions)
        setTotal(data.pagination.total)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (e) {
      console.error('Failed to fetch:', e)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleString('es-MX', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Conversaciones</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{total} sesiones totales</p>
      </div>

      <div className="flex gap-6">
        {/* Lista */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="w-12 h-12 text-[var(--muted)] mx-auto mb-3" />
              <p className="text-[var(--muted)]">No hay conversaciones todavia</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => setSelected(session)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.id === session.id
                      ? 'glass-panel border-violet-500/30'
                      : 'glass-panel hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <StatusDot classification={session.classification} />
                      <span className="text-xs text-white/80">{session.message_count} mensajes</span>
                    </div>
                    <span className="text-xs text-[var(--muted)]">{formatDate(session.first_message_at)}</span>
                  </div>
                  {session.classification?.summary ? (
                    <p className="text-sm text-white/60 line-clamp-2 mt-1">{session.classification.summary}</p>
                  ) : (
                    <p className="text-sm text-[var(--muted)] italic mt-1">Sin clasificar</p>
                  )}
                  {session.classification?.topics && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {session.classification.topics.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg glass-panel text-white disabled:opacity-30"
              >
                Anterior
              </button>
              <span className="text-xs text-[var(--muted)]">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg glass-panel text-white disabled:opacity-30"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="w-[440px] hidden lg:block flex-shrink-0">
          {selected ? (
            <div className="glass-panel rounded-xl h-[calc(100vh-200px)] flex flex-col sticky top-8">
              {/* Header */}
              <div className="p-4 border-b border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Detalle de Sesion</h3>
                  <button onClick={() => setSelected(null)} className="text-[var(--muted)] hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {selected.classification && (
                  <div className="space-y-2">
                    <div className="flex gap-1.5 flex-wrap">
                      <QualityTag quality={selected.classification.quality} />
                      {selected.classification.intent && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[var(--muted)] border border-white/10">
                          {selected.classification.intent}
                        </span>
                      )}
                      {selected.classification.flags?.resolved && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Resuelto</span>
                      )}
                      {selected.classification.flags?.frustration_detected && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">Frustracion</span>
                      )}
                      {selected.classification.flags?.escalation_needed && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Escalacion</span>
                      )}
                    </div>
                    <p className="text-xs text-white/60">{selected.classification.summary}</p>
                  </div>
                )}
              </div>

              {/* Transcript */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-2">Transcript</p>
                {selected.transcript ? (
                  selected.transcript.split('\n\n').map((block, i) => {
                    const isUser = block.startsWith('USER:')
                    const content = block.replace(/^(USER|ASSISTANT):/, '').trim()
                    return (
                      <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${
                          isUser
                            ? 'bg-violet-500/20 text-white/90 rounded-tr-sm'
                            : 'bg-white/5 text-white/70 rounded-tl-sm'
                        }`}>
                          {content}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-[var(--muted)]">No hay transcript</p>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-xl h-[calc(100vh-200px)] flex items-center justify-center sticky top-8">
              <p className="text-sm text-[var(--muted)]">Selecciona una conversacion</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusDot({ classification }: { classification: Classification | null }) {
  if (!classification) return <div className="w-2 h-2 rounded-full bg-white/20 mt-0.5" />
  if (classification.flags?.resolved) return <div className="w-2 h-2 rounded-full bg-emerald-400 mt-0.5" />
  if (classification.flags?.frustration_detected) return <div className="w-2 h-2 rounded-full bg-orange-400 mt-0.5" />
  return <div className="w-2 h-2 rounded-full bg-white/40 mt-0.5" />
}

function QualityTag({ quality }: { quality?: string }) {
  const config: Record<string, string> = {
    high: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    spam: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  if (!quality) return null
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${config[quality] || config.medium}`}>
      {quality}
    </span>
  )
}
