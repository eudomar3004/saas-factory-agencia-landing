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
  { icon: Code2, title: 'Sistemas a Medida', desc: 'ERPs, CRMs y plataformas internas.' },
  { icon: Brain, title: 'Agentes & IA', desc: 'Chatbots, agentes y workflows 24/7.' },
  { icon: BarChart3, title: 'Apps & Dashboards', desc: 'Portales SaaS con datos en tiempo real.' },
  { icon: Zap, title: 'Consultoria Tecnica', desc: 'Diagnostico y roadmap de digitalizacion.' },
]

const DIFFERENTIATORS = [
  { icon: Clock, title: 'Semanas, No Meses', desc: 'Prototipo en dias. Entrega en semanas.' },
  { icon: Sparkles, title: 'IA Nativa', desc: 'IA integrada en el ADN de cada sistema.' },
  { icon: Users, title: 'Iterativo Contigo', desc: 'Tu feedback en cada ciclo de desarrollo.' },
]

const PROJECTS = [
  {
    name: 'SaaS Factory',
    url: 'https://www.saasfactory.so',
    desc: 'Comunidad para arquitectos de software. 263+ miembros en produccion.',
    tags: ['Plataforma', 'Comunidad'],
  },
  {
    name: 'Arbrain.ai',
    url: 'https://www.arbrain.ai',
    desc: 'Plataforma IA para negocios. Agente que analiza estrategias y metricas.',
    tags: ['IA Conversacional', 'SaaS'],
  },
]

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <main className="h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background ambient - animated */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px] animate-breathe" />
        <div className="absolute bottom-[20%] right-[25%] w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[100px] animate-breathe" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/4 rounded-full blur-[80px] animate-breathe" style={{ animationDelay: '4s' }} />
      </div>

      {/* ═══════════════════════════════════ */}
      {/* MOBILE: stacked scrollable layout  */}
      {/* ═══════════════════════════════════ */}
      <div className="relative z-10 lg:hidden flex flex-col h-screen h-[100dvh]">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-3 py-2 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Image src="/logo.png" alt="SaaS Factory" width={22} height={22} className="rounded-md" />
            <span className="text-[11px] font-semibold text-white">SaaS Factory</span>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400">
            <WhatsAppIcon className="w-2.5 h-2.5" />
            WhatsApp
          </a>
        </div>

        {/* Mobile chat - fullscreen */}
        <div className={`flex-1 min-h-0 px-3 pb-2 ${mounted ? 'animate-fadeInScale delay-200' : 'opacity-0'}`}>
          <div className="relative h-full">
            <div className="absolute -inset-2 bg-violet-600/10 rounded-2xl blur-xl" />
            <div className="relative glass-panel-strong rounded-2xl overflow-hidden h-full">
              <ChatWidget />
            </div>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* DESKTOP: Full viewport static split - NO header   */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="relative z-10 hidden lg:flex h-screen py-5 xl:py-6 px-8 xl:px-12 2xl:px-16 gap-8 xl:gap-10 max-w-[1440px] mx-auto" data-desktop>

        {/* ─── LEFT COLUMN: top-aligned, chat fills rest ─── */}
        <div className="w-[38%] xl:w-[36%] flex flex-col items-center flex-shrink-0">

          {/* Brand - centered */}
          <div className={`flex items-center gap-2.5 mb-2.5 ${mounted ? 'animate-slideInLeft' : 'opacity-0'}`}>
            <div className="relative">
              <Image src="/logo.png" alt="SaaS Factory" width={32} height={32} className="rounded-xl relative z-10" />
              <div className="absolute inset-0 rounded-xl animate-goldPulse" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">SaaS Factory</span>
          </div>

          {/* Hero copy - centered */}
          <div className={`text-center mb-2.5 ${mounted ? 'animate-slideInLeft delay-150' : 'opacity-0'}`}>
            <h1 className="text-xl xl:text-2xl 2xl:text-[1.7rem] font-bold text-white mb-1 leading-[1.15] tracking-tight">
              Tu Software{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-violet-400 bg-clip-text text-transparent shimmer-text">
                a Medida
              </span>
            </h1>
            <p className="text-white/55 text-[11px] xl:text-xs leading-relaxed max-w-sm mx-auto">
              De <span className="text-amber-400 font-medium">meses</span> a{' '}
              <span className="text-emerald-400 font-medium">semanas</span>.{' '}
              ERPs, CRMs, automatizaciones y agentes IA.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {['ERPs & CRMs', 'Agentes IA', 'Automatizacion', 'Dashboards'].map((tag, i) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 text-[10px] rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300/80 ${
                    mounted ? `animate-cardReveal delay-${(i + 2) * 100}` : 'opacity-0'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* WhatsApp pill - centered above chat */}
          <div className={`mb-2.5 ${mounted ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[11px] text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300"
            >
              <WhatsAppIcon className="w-3 h-3" />
              {WHATSAPP_NUMBER}
            </a>
          </div>

          {/* Chat widget - fills ALL remaining vertical space */}
          <div className={`w-full flex-1 min-h-0 ${mounted ? 'animate-fadeInScale delay-300' : 'opacity-0'}`}>
            <div className="relative h-full max-w-[460px] mx-auto">
              <div className="absolute -inset-3 bg-violet-600/15 rounded-3xl blur-2xl animate-pulseGlow" />
              <div className="relative glass-panel-strong rounded-2xl overflow-hidden h-full">
                <ChatWidget />
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: All content, justify-between to match left edges ─── */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-3 xl:space-y-3.5">

            {/* Headline */}
            <div className={mounted ? 'animate-slideInRight' : 'opacity-0'}>
              <h2 className="text-xl xl:text-2xl 2xl:text-[1.7rem] font-bold text-white mb-1 leading-tight tracking-tight">
                Software que{' '}
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">opera</span>,{' '}
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent shimmer-text">automatiza</span>
                {' '}y escala
              </h2>
              <p className="text-[var(--muted)] text-[11px] xl:text-xs leading-relaxed max-w-lg">
                Sistemas a la medida de tu operacion. Sin plantillas genericas. Construido exactamente para lo que tu negocio necesita.
              </p>
            </div>

            {/* Services 2x2 grid */}
            <div className={mounted ? 'animate-slideInRight delay-100' : 'opacity-0'}>
              <p className="text-[10px] uppercase tracking-widest text-violet-400/80 mb-1.5 font-medium">Lo que construimos</p>
              <div className="grid grid-cols-2 gap-1.5 xl:gap-2">
                {SERVICES.map((s, i) => (
                  <div
                    key={s.title}
                    className={`glass-panel rounded-xl p-2.5 xl:p-3 hover:border-violet-500/40 hover:bg-violet-500/[0.03] transition-all duration-300 group cursor-default ${
                      mounted ? `animate-cardReveal delay-${(i + 2) * 100}` : 'opacity-0'
                    }`}
                  >
                    <s.icon className="w-4 h-4 text-violet-400 mb-1 group-hover:text-violet-300 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] transition-all duration-300" />
                    <h4 className="text-[11px] xl:text-xs font-semibold text-white mb-0.5">{s.title}</h4>
                    <p className="text-[10px] xl:text-[11px] text-[var(--muted)] leading-snug">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Differentiators */}
            <div className={mounted ? 'animate-slideInRight delay-300' : 'opacity-0'}>
              <p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-1.5 font-medium">Nuestro diferenciador</p>
              <div className="space-y-1.5">
                {DIFFERENTIATORS.map((d, i) => (
                  <div
                    key={d.title}
                    className={`flex items-center gap-2.5 p-2 xl:p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-amber-500/25 hover:bg-amber-500/[0.02] transition-all duration-300 ${
                      mounted ? `animate-cardReveal delay-${(i + 5) * 100}` : 'opacity-0'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <d.icon className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-[11px] xl:text-xs font-semibold text-white">{d.title}</h4>
                      <p className="text-[10px] xl:text-[11px] text-[var(--muted)] leading-snug">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects side-by-side */}
            <div className={mounted ? 'animate-slideInRight delay-500' : 'opacity-0'}>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400/70 mb-1.5 font-medium">Proyectos en produccion</p>
              <div className="grid grid-cols-2 gap-1.5 xl:gap-2">
                {PROJECTS.map((p, i) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`glass-panel rounded-xl p-2.5 xl:p-3 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all duration-300 group ${
                      mounted ? `animate-cardReveal delay-${(i + 8) * 100}` : 'opacity-0'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-[11px] xl:text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">{p.name}</h4>
                      <ArrowUpRight className="w-3 h-3 text-[var(--muted)] group-hover:text-emerald-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>
                    <p className="text-[10px] xl:text-[11px] text-[var(--muted)] leading-snug mb-1.5">{p.desc}</p>
                    <div className="flex gap-1 flex-wrap">
                      {p.tags.map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400/70 border border-emerald-500/15">{t}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* CTA - inline */}
            <div className={`glass-panel rounded-xl p-3 xl:p-3.5 border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-emerald-500/[0.02] to-transparent ${
              mounted ? 'animate-cardReveal delay-900' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs xl:text-sm font-bold text-white mb-0.5">Diagnostico gratuito</h3>
                  <p className="text-[10px] xl:text-[11px] text-[var(--muted)] leading-snug">
                    Sin compromiso. En 15 minutos te damos un plan de accion concreto.
                  </p>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[11px] xl:text-xs font-medium hover:bg-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.4)] transition-all duration-300 whitespace-nowrap flex-shrink-0"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  {WHATSAPP_NUMBER}
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

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
