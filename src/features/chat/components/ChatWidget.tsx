'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { useChat } from '@ai-sdk/react'
import { Send } from 'lucide-react'
import Image from 'next/image'

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
      <div className="flex items-center gap-2.5 p-3 border-b border-[var(--border)]">
        <div className="relative flex-shrink-0">
          <Image src="/levy-avatar.webp" alt="Levy" width={36} height={36} className="rounded-full" />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[var(--surface)]" />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-white">Levy</h3>
          <p className="text-[10px] text-[var(--muted)]">Consultor IA - Disponible</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-hide">
        {!hasMessages && (
          <div className="flex justify-start animate-fadeInUp">
            <div className="flex gap-2 max-w-[85%]">
              <Image src="/levy-avatar.webp" alt="Levy" width={28} height={28} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1" />
              <div className="glass-assistant-message rounded-2xl rounded-tl-sm px-3 py-2.5">
                <p className="text-xs text-white/90">
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
                <Image src="/levy-avatar.webp" alt="Levy" width={28} height={28} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1" />
                <div className="glass-assistant-message rounded-2xl rounded-tl-sm px-3 py-2.5">
                  <p className="text-xs text-white/90 whitespace-pre-wrap">
                    {getMessageText(m)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="glass-user-message rounded-2xl rounded-tr-sm px-3 py-2.5 max-w-[85%]">
                <p className="text-xs whitespace-pre-wrap">{getMessageText(m)}</p>
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start streaming-fade">
            <div className="flex gap-2">
              <Image src="/levy-avatar.webp" alt="Levy" width={28} height={28} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1" />
              <div className="glass-assistant-message rounded-2xl rounded-tl-sm px-3 py-2.5">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Prompts - inside scroll area */}
        {!hasMessages && (
          <div className="flex flex-wrap gap-1.5 animate-fadeInUp delay-300">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-2.5 py-1 text-[10px] rounded-full border border-[var(--glass-border)] bg-[var(--surface)] text-[var(--muted)] hover:text-white hover:border-[var(--primary)] transition-all duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-[10px]">
            Error: {error.message}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-2.5 border-t border-[var(--border)]">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-40 hover:from-violet-500 hover:to-purple-500 transition-all duration-200"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  )
}
