'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { useChat } from '@ai-sdk/react'
import { Bot, Send, MessageSquare } from 'lucide-react'

const QUICK_PROMPTS = [
  'Necesito un sistema a medida',
  'Quiero automatizar con IA',
  'Cuanto tarda un proyecto?',
  'Que proyectos han hecho?',
]

function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  const stored = localStorage.getItem('visitor_id')
  if (stored) return stored
  const id = `visitor_${Date.now()}_${Math.random().toString(36).slice(2)}`
  localStorage.setItem('visitor_id', id)
  return id
}

export function ChatWidget() {
  const visitorIdRef = useRef<string>('')
  const { messages, status, error, sendMessage } = useChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    visitorIdRef.current = getVisitorId()
  }, [])

  const isLoading = status === 'submitted' || status === 'streaming'
  const hasMessages = messages.length > 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    sendMessage({ text }, { body: { visitorId: visitorIdRef.current } })
  }

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return
    sendMessage({ text: prompt }, { body: { visitorId: visitorIdRef.current } })
  }

  const getMessageText = (message: typeof messages[0]): string => {
    if (!message.parts) return ''
    return message.parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map(part => part.text)
      .join('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--surface)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Levy</h3>
          <p className="text-xs text-[var(--muted)]">Consultor IA - Disponible</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {!hasMessages && (
          <div className="flex justify-start animate-fadeInUp">
            <div className="flex gap-2 max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="glass-assistant-message rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-white/90">
                  Hola! Soy Levy, consultor de software en SaaS Factory. Cuentame sobre tu negocio y te digo como podemos ayudarte.
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} streaming-fade`}
          >
            {m.role === 'assistant' ? (
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="glass-assistant-message rounded-2xl rounded-tl-sm px-4 py-3">
                  <p className="text-sm text-white/90 whitespace-pre-wrap">
                    {getMessageText(m)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="glass-user-message rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
                <p className="text-sm whitespace-pre-wrap">{getMessageText(m)}</p>
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start streaming-fade">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="glass-assistant-message rounded-2xl rounded-tl-sm px-3 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
            Error: {error.message}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {!hasMessages && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 animate-fadeInUp delay-300">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickPrompt(prompt)}
              className="px-3 py-1.5 text-xs rounded-full border border-[var(--glass-border)] bg-[var(--surface)] text-[var(--muted)] hover:text-white hover:border-[var(--primary)] transition-all duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border)]">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-40 hover:from-violet-500 hover:to-purple-500 transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
