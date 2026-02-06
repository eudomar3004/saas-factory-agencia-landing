'use client'

import { useEffect, useState } from 'react'

interface Analytics {
  overview: {
    totalSessions: number
    totalMessages: number
    classifiedCount: number
    unclassifiedCount: number
    resolutionRate: number
  }
  qualityDistribution: { high: number; medium: number; low: number; spam: number }
  topTopics: Array<{ topic: string; count: number; percentage: number }>
  painPoints: Array<{
    topic: string
    sessionCount: number
    frustrationRate: number
    unresolvedRate: number
    avgMessagesPerSession: number
  }>
  gapScores: Array<{
    topic: string
    score: number
    recommendation: 'urgent' | 'recommended' | 'monitor' | 'ok'
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.ok ? res.json() : null)
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return <p className="text-[var(--muted)]">Error al cargar analiticas</p>

  const totalQuality = data.qualityDistribution.high + data.qualityDistribution.medium + data.qualityDistribution.low + data.qualityDistribution.spam

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics Detalladas</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Metricas profundas del comportamiento del agente</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <MiniStat label="Sesiones" value={data.overview.totalSessions} />
        <MiniStat label="Mensajes" value={data.overview.totalMessages} />
        <MiniStat label="Clasificados" value={data.overview.classifiedCount} />
        <MiniStat label="Resolucion" value={`${data.overview.resolutionRate}%`} color={data.overview.resolutionRate >= 70 ? 'emerald' : 'yellow'} />
        <MiniStat label="Pendientes" value={data.overview.unclassifiedCount} color={data.overview.unclassifiedCount > 0 ? 'yellow' : 'emerald'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quality */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Distribucion de Calidad</h3>
          {totalQuality === 0 ? (
            <p className="text-sm text-[var(--muted)]">No hay datos</p>
          ) : (
            <div className="space-y-3">
              <QualityBar label="Alta" count={data.qualityDistribution.high} total={totalQuality} color="bg-emerald-500" />
              <QualityBar label="Media" count={data.qualityDistribution.medium} total={totalQuality} color="bg-yellow-500" />
              <QualityBar label="Baja" count={data.qualityDistribution.low} total={totalQuality} color="bg-orange-500" />
              <QualityBar label="Spam" count={data.qualityDistribution.spam} total={totalQuality} color="bg-red-500" />
            </div>
          )}
        </div>

        {/* Topics */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Distribucion de Topics</h3>
          {data.topTopics.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No hay datos</p>
          ) : (
            <div className="space-y-3">
              {data.topTopics.map((topic, i) => (
                <div key={topic.topic}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80">{topic.topic}</span>
                    <span className="text-[var(--muted)]">{topic.count} ({topic.percentage}%)</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${topic.percentage}%`,
                        backgroundColor: `hsl(${260 - i * 25}, 70%, 55%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pain Points Table */}
      <div className="glass-panel rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-white mb-4">Pain Points por Topic</h3>
        {data.painPoints.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No hay datos</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[var(--muted)] text-xs uppercase tracking-wide border-b border-white/10">
                  <th className="pb-3 pr-4">Topic</th>
                  <th className="pb-3 pr-4">Sesiones</th>
                  <th className="pb-3 pr-4">Frustracion</th>
                  <th className="pb-3 pr-4">Sin Resolver</th>
                  <th className="pb-3">Msgs/Sesion</th>
                </tr>
              </thead>
              <tbody>
                {data.painPoints.map(pp => (
                  <tr key={pp.topic} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-sm text-white/80">{pp.topic}</td>
                    <td className="py-3 pr-4 text-sm text-[var(--muted)]">{pp.sessionCount}</td>
                    <td className="py-3 pr-4 text-sm">
                      <span className={pp.frustrationRate >= 50 ? 'text-red-400' : pp.frustrationRate >= 25 ? 'text-orange-400' : 'text-emerald-400'}>
                        {pp.frustrationRate}%
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-sm">
                      <span className={pp.unresolvedRate >= 50 ? 'text-red-400' : pp.unresolvedRate >= 25 ? 'text-yellow-400' : 'text-emerald-400'}>
                        {pp.unresolvedRate}%
                      </span>
                    </td>
                    <td className="py-3 text-sm text-[var(--muted)]">{pp.avgMessagesPerSession}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gap Scores */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Content Gaps</h3>
        <p className="text-xs text-[var(--muted)] mb-4">Priorizacion de contenido basada en frustracion y resolucion</p>
        {data.gapScores.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No hay datos</p>
        ) : (
          <div className="space-y-3">
            {data.gapScores.map(gap => (
              <div key={gap.topic} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <RecommendationBadge rec={gap.recommendation} />
                  <span className="text-sm text-white">{gap.topic}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--muted)]">Gap Score</p>
                  <p className="text-lg font-bold text-white">{gap.score}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 p-3 rounded-lg bg-white/5 text-xs text-[var(--muted)]">
          Gap Score = (sesiones x frustracion) / resolucion. Un score alto indica que el topic necesita mejor contenido.
        </div>
      </div>
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  const textColor = color === 'emerald' ? 'text-emerald-400' : color === 'yellow' ? 'text-yellow-400' : 'text-white'
  return (
    <div className="glass-panel rounded-xl p-4">
      <p className="text-xs text-[var(--muted)] uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-bold mt-1 ${textColor}`}>{value}</p>
    </div>
  )
}

function QualityBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/80">{label}</span>
        <span className="text-[var(--muted)]">{count} ({pct}%)</span>
      </div>
      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function RecommendationBadge({ rec }: { rec: 'urgent' | 'recommended' | 'monitor' | 'ok' }) {
  const config = {
    urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
    recommended: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    monitor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    ok: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }
  const labels = { urgent: 'URGENTE', recommended: 'RECOMENDADO', monitor: 'MONITOREAR', ok: 'OK' }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${config[rec]}`}>
      {labels[rec]}
    </span>
  )
}
