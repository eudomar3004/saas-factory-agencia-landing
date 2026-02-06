'use client'

import { useEffect, useState } from 'react'
import { BarChart3, MessageSquare, Users, TrendingUp, AlertTriangle, Zap } from 'lucide-react'

interface Analytics {
  overview: {
    totalSessions: number
    totalMessages: number
    classifiedCount: number
    unclassifiedCount: number
    resolutionRate: number
  }
  alerts: {
    frustrationCount: number
    escalationCount: number
    bugCount: number
  }
  qualityDistribution: { high: number; medium: number; low: number; spam: number }
  topTopics: Array<{ topic: string; count: number; percentage: number }>
  interventionQueue: Array<{
    id: string
    summary: string
    severity: 'critical' | 'high' | 'medium'
    flags: { frustration: boolean; escalation: boolean; bug: boolean }
    messageCount: number
    hoursAgo: number
  }>
}

export default function AdminPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [classifying, setClassifying] = useState(false)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try {
      const res = await fetch('/api/analytics')
      if (res.ok) setData(await res.json())
    } catch (e) {
      console.error('Failed to fetch analytics:', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleClassify() {
    setClassifying(true)
    try {
      const res = await fetch('/api/classify', { method: 'POST' })
      if (res.ok) {
        const result = await res.json()
        alert(`Sesiones creadas: ${result.created}, Clasificadas: ${result.classified}`)
        await fetchData()
      }
    } catch (e) {
      console.error('Classification failed:', e)
    } finally {
      setClassifying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return <p className="text-[var(--muted)]">Error al cargar datos</p>

  const hasAlerts = data.alerts.frustrationCount > 0 || data.alerts.escalationCount > 0 || data.alerts.bugCount > 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Vista general del agente</p>
        </div>
        <button
          onClick={handleClassify}
          disabled={classifying}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 transition-all"
        >
          <Zap className="w-4 h-4" />
          {classifying ? 'Clasificando...' : 'Clasificar Conversaciones'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={MessageSquare} label="Sesiones" value={data.overview.totalSessions} color="violet" />
        <StatCard icon={Users} label="Mensajes" value={data.overview.totalMessages} color="blue" />
        <StatCard icon={TrendingUp} label="Resolucion" value={`${data.overview.resolutionRate}%`} color="emerald" />
        <StatCard icon={BarChart3} label="Sin clasificar" value={data.overview.unclassifiedCount} color="amber" />
      </div>

      {/* Alerts */}
      {hasAlerts && (
        <div className="mb-8 glass-panel rounded-xl p-5 border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-white">Alertas Activas</h3>
          </div>
          <div className="space-y-1 text-sm">
            {data.alerts.escalationCount > 0 && (
              <p className="text-red-400">{data.alerts.escalationCount} requieren escalacion</p>
            )}
            {data.alerts.frustrationCount > 0 && (
              <p className="text-orange-400">{data.alerts.frustrationCount} usuarios frustrados</p>
            )}
            {data.alerts.bugCount > 0 && (
              <p className="text-yellow-400">{data.alerts.bugCount} bugs reportados</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Top Topics</h3>
          {data.topTopics.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No hay datos todavia. Usa el chat y luego clasifica.</p>
          ) : (
            <div className="space-y-3">
              {data.topTopics.map(topic => (
                <div key={topic.topic}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80">{topic.topic}</span>
                    <span className="text-[var(--muted)]">{topic.percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quality Distribution */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Calidad de Conversaciones</h3>
          {data.overview.classifiedCount === 0 ? (
            <p className="text-sm text-[var(--muted)]">Clasifica conversaciones para ver la distribucion.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <QualityBadge label="Alta" count={data.qualityDistribution.high} total={data.overview.classifiedCount} color="emerald" />
              <QualityBadge label="Media" count={data.qualityDistribution.medium} total={data.overview.classifiedCount} color="yellow" />
              <QualityBadge label="Baja" count={data.qualityDistribution.low} total={data.overview.classifiedCount} color="orange" />
              <QualityBadge label="Spam" count={data.qualityDistribution.spam} total={data.overview.classifiedCount} color="red" />
            </div>
          )}
        </div>
      </div>

      {/* Intervention Queue */}
      {data.interventionQueue.length > 0 && (
        <div className="mt-6 glass-panel rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Cola de Intervencion</h3>
          <div className="space-y-3">
            {data.interventionQueue.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <SeverityDot severity={item.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{item.summary}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-[var(--muted)]">{item.messageCount} msgs</span>
                    <span className="text-xs text-[var(--muted)]">hace {item.hoursAgo}h</span>
                    {item.flags.frustration && <span className="text-xs text-orange-400">Frustracion</span>}
                    {item.flags.escalation && <span className="text-xs text-red-400">Escalacion</span>}
                    {item.flags.bug && <span className="text-xs text-yellow-400">Bug</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string | number; color: string
}) {
  const colors: Record<string, string> = {
    violet: 'from-violet-500/10 to-purple-500/10 text-violet-400',
    blue: 'from-blue-500/10 to-cyan-500/10 text-blue-400',
    emerald: 'from-emerald-500/10 to-green-500/10 text-emerald-400',
    amber: 'from-amber-500/10 to-yellow-500/10 text-amber-400',
  }
  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs text-[var(--muted)]">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function QualityBadge({ label, count, total, color }: {
  label: string; count: number; total: number; color: string
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500', yellow: 'bg-yellow-500', orange: 'bg-orange-500', red: 'bg-red-500',
  }
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
      <div className={`w-3 h-3 rounded-full ${colors[color]}`} />
      <div>
        <p className="text-xs text-white/80">{label}</p>
        <p className="text-sm font-semibold text-white">{count} <span className="text-[var(--muted)] font-normal">({pct}%)</span></p>
      </div>
    </div>
  )
}

function SeverityDot({ severity }: { severity: 'critical' | 'high' | 'medium' }) {
  const colors = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500' }
  return <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors[severity]}`} />
}
