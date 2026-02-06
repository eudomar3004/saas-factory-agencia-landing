'use client'

import { useEffect, useState } from 'react'
import { Save, Plus, X, Check } from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  system_prompt: string
  model_id: string
  temperature: number
  max_tokens: number
  classification_topics: string[]
  is_active: boolean
}

const AVAILABLE_MODELS = [
  { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash' },
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
  { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
]

export default function SettingsPage() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newTopic, setNewTopic] = useState('')

  useEffect(() => {
    fetch('/api/agent')
      .then(res => res.ok ? res.json() : null)
      .then(setAgent)
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!agent) return
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/agent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (e) {
      console.error('Save failed:', e)
    } finally {
      setSaving(false)
    }
  }

  function addTopic() {
    if (!agent || !newTopic.trim()) return
    setAgent({ ...agent, classification_topics: [...agent.classification_topics, newTopic.trim()] })
    setNewTopic('')
  }

  function removeTopic(index: number) {
    if (!agent) return
    setAgent({ ...agent, classification_topics: agent.classification_topics.filter((_, i) => i !== index) })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!agent) return <p className="text-[var(--muted)]">Error al cargar configuracion</p>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Configuracion del agente {agent.name}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 transition-all"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Guardando...' : saved ? 'Guardado!' : 'Guardar'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Info basica */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Informacion Basica</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1.5">Nombre del Agente</label>
              <input
                type="text"
                value={agent.name}
                onChange={e => setAgent({ ...agent, name: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1.5">Descripcion</label>
              <input
                type="text"
                value={agent.description || ''}
                onChange={e => setAgent({ ...agent, description: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-1">System Prompt</h3>
          <p className="text-xs text-[var(--muted)] mb-4">Define la personalidad y comportamiento del agente</p>
          <textarea
            value={agent.system_prompt}
            onChange={e => setAgent({ ...agent, system_prompt: e.target.value })}
            rows={10}
            className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors resize-none font-mono"
          />
        </div>

        {/* Modelo */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Configuracion del Modelo</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1.5">Modelo</label>
              <select
                value={agent.model_id}
                onChange={e => setAgent({ ...agent, model_id: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
              >
                {AVAILABLE_MODELS.map(m => (
                  <option key={m.id} value={m.id} className="bg-neutral-900">{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[var(--muted)] mb-1.5">
                Temperature: <span className="text-white">{agent.temperature}</span>
              </label>
              <input
                type="range"
                min="0" max="1" step="0.1"
                value={agent.temperature}
                onChange={e => setAgent({ ...agent, temperature: parseFloat(e.target.value) })}
                className="w-full accent-violet-500"
              />
              <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
                <span>Preciso</span><span>Creativo</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[var(--muted)] mb-1.5">
                Max Tokens: <span className="text-white">{agent.max_tokens}</span>
              </label>
              <input
                type="range"
                min="100" max="4000" step="100"
                value={agent.max_tokens}
                onChange={e => setAgent({ ...agent, max_tokens: parseInt(e.target.value) })}
                className="w-full accent-violet-500"
              />
              <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
                <span>100</span><span>4000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Classification Topics */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Topics de Clasificacion</h3>
          <p className="text-xs text-[var(--muted)] mb-4">Define los temas para clasificar conversaciones automaticamente</p>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTopic()}
              placeholder="Nuevo topic..."
              className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <button onClick={addTopic} className="p-2 rounded-lg glass-panel hover:border-violet-500/30 transition-colors">
              <Plus className="w-4 h-4 text-violet-400" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {agent.classification_topics.map((topic, i) => (
              <div key={`${topic}-${i}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                <span className="text-xs text-violet-300">{topic}</span>
                <button onClick={() => removeTopic(i)} className="text-violet-400/50 hover:text-violet-300">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
