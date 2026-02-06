import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // Verificar auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Obtener agente activo
  const { data: agent } = await supabase
    .from('agents')
    .select('id')
    .eq('is_active', true)
    .single()

  if (!agent) {
    return NextResponse.json({ error: 'No active agent found' }, { status: 404 })
  }

  // Obtener todas las sesiones
  const { data: sessions } = await supabase
    .from('conversation_sessions')
    .select('*')
    .eq('agent_id', agent.id)

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({
      overview: { totalSessions: 0, totalMessages: 0, classifiedCount: 0, unclassifiedCount: 0, resolutionRate: 0 },
      alerts: { frustrationCount: 0, escalationCount: 0, bugCount: 0 },
      qualityDistribution: { high: 0, medium: 0, low: 0, spam: 0 },
      topTopics: [],
      painPoints: [],
      gapScores: [],
      interventionQueue: [],
    })
  }

  const classifiedSessions = sessions.filter(s => s.classification)
  const classifiedCount = classifiedSessions.length

  // Overview
  const totalSessions = sessions.length
  const totalMessages = sessions.reduce((sum, s) => sum + s.message_count, 0)
  const resolvedCount = classifiedSessions.filter(s => s.classification?.flags?.resolved).length
  const resolutionRate = classifiedCount > 0 ? Math.round((resolvedCount / classifiedCount) * 100) : 0

  // Alerts
  const frustrationCount = classifiedSessions.filter(s => s.classification?.flags?.frustration_detected).length
  const escalationCount = classifiedSessions.filter(s => s.classification?.flags?.escalation_needed).length
  const bugCount = classifiedSessions.filter(s => s.classification?.flags?.bug_reported).length

  // Quality distribution
  const qualityDistribution = {
    high: classifiedSessions.filter(s => s.classification?.quality === 'high').length,
    medium: classifiedSessions.filter(s => s.classification?.quality === 'medium').length,
    low: classifiedSessions.filter(s => s.classification?.quality === 'low').length,
    spam: classifiedSessions.filter(s => s.classification?.quality === 'spam').length,
  }

  // Top Topics
  const topicCounts: Record<string, number> = {}
  classifiedSessions.forEach(session => {
    const topics = (session.classification?.topics || []) as string[]
    topics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1
    })
  })

  const topTopics = Object.entries(topicCounts)
    .map(([topic, count]) => ({
      topic,
      count,
      percentage: Math.round((count / classifiedCount) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  // Pain Points
  const topicStats: Record<string, {
    sessionCount: number
    totalMessages: number
    frustrationCount: number
    unresolvedCount: number
    avgMessages: number
  }> = {}

  classifiedSessions.forEach(session => {
    const topics = (session.classification?.topics || []) as string[]
    topics.forEach(topic => {
      if (!topicStats[topic]) {
        topicStats[topic] = { sessionCount: 0, totalMessages: 0, frustrationCount: 0, unresolvedCount: 0, avgMessages: 0 }
      }
      topicStats[topic].sessionCount++
      topicStats[topic].totalMessages += session.message_count
      if (session.classification?.flags?.frustration_detected) topicStats[topic].frustrationCount++
      if (!session.classification?.flags?.resolved) topicStats[topic].unresolvedCount++
    })
  })

  const painPoints = Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      sessionCount: stats.sessionCount,
      frustrationRate: Math.round((stats.frustrationCount / stats.sessionCount) * 100),
      unresolvedRate: Math.round((stats.unresolvedCount / stats.sessionCount) * 100),
      avgMessagesPerSession: Math.round(stats.totalMessages / stats.sessionCount),
    }))
    .sort((a, b) => b.sessionCount - a.sessionCount)

  // Gap Scores
  const gapScores = painPoints.map(pp => {
    const resRate = 100 - pp.unresolvedRate || 1
    const score = Math.round((pp.sessionCount * pp.frustrationRate) / resRate)
    let recommendation: 'urgent' | 'recommended' | 'monitor' | 'ok' = 'ok'
    if (score >= 50) recommendation = 'urgent'
    else if (score >= 20) recommendation = 'recommended'
    else if (score >= 10) recommendation = 'monitor'

    return { topic: pp.topic, score, recommendation }
  }).sort((a, b) => b.score - a.score)

  // Intervention Queue
  const interventionQueue = classifiedSessions
    .filter(s =>
      s.classification?.flags?.escalation_needed ||
      s.classification?.flags?.frustration_detected ||
      s.classification?.flags?.bug_reported
    )
    .map(s => {
      let severity: 'critical' | 'high' | 'medium' = 'medium'
      if (s.classification?.flags?.escalation_needed && s.classification?.flags?.frustration_detected) severity = 'critical'
      else if (s.classification?.flags?.escalation_needed || s.classification?.flags?.bug_reported) severity = 'high'

      return {
        id: s.id,
        summary: s.classification?.summary || 'Sin resumen',
        severity,
        flags: {
          frustration: !!s.classification?.flags?.frustration_detected,
          escalation: !!s.classification?.flags?.escalation_needed,
          bug: !!s.classification?.flags?.bug_reported,
        },
        messageCount: s.message_count,
        hoursAgo: Math.round((Date.now() - new Date(s.first_message_at).getTime()) / (1000 * 60 * 60)),
      }
    })
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2 }
      return order[a.severity] - order[b.severity]
    })

  return NextResponse.json({
    overview: { totalSessions, totalMessages, classifiedCount, unclassifiedCount: totalSessions - classifiedCount, resolutionRate },
    alerts: { frustrationCount, escalationCount, bugCount },
    qualityDistribution,
    topTopics,
    painPoints,
    gapScores,
    interventionQueue,
  })
}
