'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  ArrowUpRight,
  Zap, Code2, BarChart3, Brain,
  Clock, Sparkles, Users,
} from 'lucide-react'
import { ChatWidget } from '@/features/chat/components/ChatWidget'

const WHATSAPP_NUMBER = '+52 443 321 5051'
const WHATSAPP_URL = `https://wa.me/524433215051?text=${encodeURIComponent('Hola, estoy interesado en construir software para mi negocio')}`

const SERVICES = [
  { icon: Code2, title: 'Sistemas a Medida', desc: 'ERPs, CRMs y plataformas internas hechas para tu operacion.' },
  { icon: Brain, title: 'Agentes & Automatizacion IA', desc: 'Chatbots, agentes inteligentes y workflows que trabajan 24/7.' },
  { icon: BarChart3, title: 'Apps Web & Dashboards', desc: 'Portales, dashboards y plataformas SaaS con datos en tiempo real.' },
  { icon: Zap, title: 'Consultoria Tecnica', desc: 'Diagnostico de tu operacion y roadmap de digitalizacion.' },
]

const DIFFERENTIATORS = [
  { icon: Clock, title: 'Semanas, No Meses', desc: 'Prototipo funcional en dias. Entrega completa en semanas, no en trimestres.' },
  { icon: Sparkles, title: 'IA Nativa', desc: 'La inteligencia artificial no es un add-on. Es parte del ADN de cada sistema.' },
  { icon: Users, title: 'Iterativo Contigo', desc: 'Cada ciclo incorpora tu feedback. Construimos juntos, no en un silo.' },
]

const PROJECTS = [
  {
    name: 'ARBrain.ai',
    url: 'https://www.arbrain.ai',
    desc: 'Plataforma de IA para negocios. Agente conversacional que analiza estrategias, metricas y crecimiento empresarial.',
    tags: ['IA Conversacional', 'Analisis', 'SaaS'],
  },
  {
    name: 'SaaS Factory',
    url: 'https://www.saasfactory.so',
    desc: 'Infraestructura y comunidad para arquitectos de software. 263+ miembros construyendo apps en produccion.',
    tags: ['Plataforma', 'Comunidad', 'Next.js + Supabase'],
  },
]

export default function Home() {
  const [chatActive, setChatActive] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <main className="h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/4 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className={`flex items-center gap-3 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="relative">
            <Image src="/logo.png" alt="SaaS Factory" width={36} height={36} className="rounded-lg" />
            <div className="absolute inset-0 rounded-lg animate-goldPulse opacity-60" />
          </div>
          <span className="text-white font-semibold tracking-tight">SaaS Factory</span>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 ${mounted ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{WHATSAPP_NUMBER}</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center h-[calc(100vh-72px)] px-4 sm:px-6 gap-8 lg:gap-10 max-w-7xl mx-auto overflow-hidden">

        {/* LEFT: Chat side */}
        <div
          className={`transition-all duration-700 ease-out ${
            chatActive ? 'lg:w-[45%]' : 'lg:w-full lg:max-w-lg'
          } w-full max-w-lg lg:max-w-none flex flex-col items-center order-2 lg:order-1 max-h-full overflow-hidden`}
        >
          {/* Pre-chat hero */}
          {!chatActive && (
            <div className={`text-center mb-6 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <div className="relative inline-block mb-4">
                <Image src="/logo.png" alt="SaaS Factory" width={64} height={64} className="rounded-2xl relative z-10" />
                <div className="absolute inset-0 rounded-2xl animate-goldPulse" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight leading-tight">
                Tu Software{' '}
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
                  a Medida
                </span>
              </h1>
              <p className="text-white/60 text-sm sm:text-base max-w-sm mx-auto mb-4 leading-relaxed">
                De <span className="text-amber-400 font-medium">meses</span> a{' '}
                <span className="text-emerald-400 font-medium">semanas</span>.{' '}
                ERPs, CRMs, automatizaciones y agentes IA para tu negocio.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['ERPs & CRMs', 'Agentes IA', 'Automatizacion', 'Dashboards'].map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chat container */}
          <div
            className={`relative w-full max-w-lg ${mounted ? 'animate-fadeInScale delay-300' : 'opacity-0'}`}
            onClick={() => !chatActive && setChatActive(true)}
          >
            <div className="absolute -inset-4 bg-violet-600/15 rounded-3xl blur-2xl animate-pulseGlow" />
            <div className="relative glass-panel-strong rounded-2xl overflow-hidden max-h-[min(500px,60vh)]">
              <ChatWidget />
            </div>
          </div>

          {/* Below-chat WhatsApp link */}
          <div className={`mt-3 text-center ${mounted ? 'animate-fadeInUp delay-500' : 'opacity-0'}`}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-emerald-400 transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              {chatActive ? 'Prefiero WhatsApp' : 'O escribenos por WhatsApp'}
              <span className="text-white/30">|</span>
              <span className="text-white/50">{WHATSAPP_NUMBER}</span>
            </a>
          </div>
        </div>

        {/* RIGHT: Content sections */}
        <div
          className={`transition-all duration-700 ease-out ${
            chatActive
              ? 'lg:w-[55%] lg:opacity-100 lg:translate-x-0'
              : 'lg:w-0 lg:opacity-0 lg:translate-x-10 lg:overflow-hidden'
          } hidden lg:block order-1 lg:order-2 h-full`}
        >
          <div className="h-full overflow-y-auto scrollbar-hide pr-2">
            <div className="space-y-8 py-2 pb-8">

              {/* Summary */}
              <div className={chatActive ? 'animate-fadeInUp' : 'opacity-0'}>
                <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2 leading-tight">
                  Software que{' '}
                  <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                    opera
                  </span>
                  ,{' '}
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                    automatiza
                  </span>
                  {' '}y escala
                </h2>
                <p className="text-[var(--muted)] text-sm leading-relaxed">
                  Diseñamos sistemas a la medida de tu operacion. Sin plantillas genericas.
                  Construido exactamente para lo que tu negocio necesita, listo en semanas.
                </p>
              </div>

              {/* Services */}
              <div className={chatActive ? 'animate-fadeInUp delay-100' : 'opacity-0'}>
                <p className="text-xs uppercase tracking-widest text-violet-400/80 mb-3 font-medium">
                  Lo que construimos
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {SERVICES.map(s => (
                    <div
                      key={s.title}
                      className="glass-panel rounded-xl p-3.5 hover:border-violet-500/40 transition-all group cursor-default"
                    >
                      <s.icon className="w-5 h-5 text-violet-400 mb-2 group-hover:text-violet-300 transition-colors" />
                      <h4 className="text-xs font-semibold text-white mb-1">{s.title}</h4>
                      <p className="text-[11px] text-[var(--muted)] leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differentiators */}
              <div className={chatActive ? 'animate-fadeInUp delay-200' : 'opacity-0'}>
                <p className="text-xs uppercase tracking-widest text-amber-400/70 mb-3 font-medium">
                  Nuestro diferenciador
                </p>
                <div className="space-y-2.5">
                  {DIFFERENTIATORS.map(d => (
                    <div
                      key={d.title}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-amber-500/20 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <d.icon className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{d.title}</h4>
                        <p className="text-xs text-[var(--muted)] leading-relaxed">{d.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className={chatActive ? 'animate-fadeInUp delay-300' : 'opacity-0'}>
                <p className="text-xs uppercase tracking-widest text-emerald-400/70 mb-3 font-medium">
                  Proyectos en produccion
                </p>
                <div className="space-y-2.5">
                  {PROJECTS.map(p => (
                    <a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block glass-panel rounded-xl p-4 hover:border-emerald-500/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {p.name}
                        </h4>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-xs text-[var(--muted)] leading-relaxed mb-2">{p.desc}</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {p.tags.map(t => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400/70 border border-emerald-500/15"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className={chatActive ? 'animate-fadeInUp delay-400' : 'opacity-0'}>
                <div className="glass-panel rounded-xl p-5 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <h3 className="text-base font-bold text-white mb-1.5">Diagnostico gratuito</h3>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
                    Sin compromiso. En 15 minutos evaluamos tu proyecto y te damos un plan de accion concreto.
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Escribenos al {WHATSAPP_NUMBER}
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 z-10 text-center">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/20 hover:text-emerald-400/80 transition-colors"
        >
          {WHATSAPP_NUMBER} · Software personalizado para tu negocio
        </a>
      </footer>
    </main>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
