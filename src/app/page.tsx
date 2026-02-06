'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Bot, MessageSquare, ArrowRight } from 'lucide-react'
import { ChatWidget } from '@/features/chat/components/ChatWidget'

const WHATSAPP_URL = '#' // TODO: Reemplazar con URL de WhatsApp real

export default function Home() {
  const [chatActive, setChatActive] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/4 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className={`flex items-center gap-3 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="relative">
            <Image
              src="/logo.png"
              alt="SaaS Factory"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="absolute inset-0 rounded-lg animate-goldPulse opacity-60" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            SaaS Factory
          </span>
        </div>

        <a
          href={WHATSAPP_URL}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface)]/80 text-sm text-[var(--muted)] hover:text-white hover:border-[var(--primary)] transition-all duration-300 ${mounted ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center h-[calc(100vh-80px)] px-4 sm:px-6 gap-8 lg:gap-12 max-w-7xl mx-auto overflow-hidden">

        {/* LEFT side - Chat Widget (slides here when active) */}
        <div
          className={`transition-all duration-700 ease-out ${
            chatActive
              ? 'lg:w-1/2'
              : 'lg:w-full lg:max-w-lg'
          } w-full max-w-lg lg:max-w-none flex flex-col items-center order-2 lg:order-1 max-h-full overflow-hidden`}
        >
          {/* Pre-chat hero (visible when no conversation) */}
          {!chatActive && (
            <div className={`text-center mb-8 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              {/* Logo with gold glow */}
              <div className="relative inline-block mb-6">
                <Image
                  src="/logo.png"
                  alt="SaaS Factory"
                  width={80}
                  height={80}
                  className="rounded-2xl relative z-10"
                />
                <div className="absolute inset-0 rounded-2xl animate-goldPulse" />
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
                SaaS Factory
              </h1>
              <p className="text-[var(--muted)] text-sm mb-1">Fabrica de Software</p>
              <p className="text-white/70 text-base max-w-md mx-auto">
                De <span className="text-amber-400 font-medium">meses</span> a <span className="text-emerald-400 font-medium">semanas</span>.
                Software que opera, automatiza y escala tu negocio.
              </p>
            </div>
          )}

          {/* Chat container with purple glow */}
          <div
            className={`relative w-full max-w-lg ${mounted ? 'animate-fadeInScale delay-300' : 'opacity-0'}`}
            onClick={() => !chatActive && setChatActive(true)}
          >
            {/* Purple glow behind chat */}
            <div className="absolute -inset-4 bg-violet-600/15 rounded-3xl blur-2xl animate-pulseGlow" />

            {/* Chat panel */}
            <div className="relative glass-panel-strong rounded-2xl overflow-hidden max-h-[min(500px,60vh)]">
              <ChatWidget />
            </div>
          </div>

          {/* CTA below chat */}
          {chatActive && (
            <div className="mt-4 text-center animate-fadeInUp">
              <a
                href={WHATSAPP_URL}
                className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Prefiero hablar por WhatsApp
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* RIGHT side - Info (appears when chat is active on desktop) */}
        <div
          className={`transition-all duration-700 ease-out ${
            chatActive
              ? 'lg:w-1/2 lg:opacity-100 lg:translate-x-0'
              : 'lg:w-0 lg:opacity-0 lg:translate-x-10 lg:overflow-hidden'
          } hidden lg:flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2`}
        >
          <div className={`max-w-lg ${chatActive ? 'animate-fadeInUp' : ''}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Software que{' '}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                opera
              </span>
              {' '}tu negocio
            </h2>
            <p className="text-[var(--muted)] text-base sm:text-lg mb-6 leading-relaxed">
              De meses a semanas. ERPs, CRMs, dashboards, aplicaciones web y automatizacion con IA.
              Construido a la medida de tu operacion.
            </p>

            <div className="space-y-3 mb-8">
              {[
                'Diagnostico gratuito de tu operacion',
                'Prototipo funcional en dias',
                'Entrega iterativa con tu feedback',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP_URL}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-500 hover:to-purple-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
            >
              Agendar diagnostico
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer subtle - absolutely positioned */}
      <footer className="absolute bottom-2 left-0 right-0 z-10 text-center text-xs text-[var(--muted)]/40">
        Software personalizado para tu negocio
      </footer>
    </main>
  )
}
