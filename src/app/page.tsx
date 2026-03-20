'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  ArrowUpRight,
  Zap, Code2, BarChart3, Brain,
  Clock, Sparkles, Users, Calendar,
} from 'lucide-react'
import { ChatWidget } from '@/features/chat/components/ChatWidget'
import { CalendlyModal } from '@/features/calendly/components/CalendlyModal'

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
    name: 'Carlitos Liquor Store',
    url: 'https://carlitosliquorstore.com',
    desc: 'Plataforma de e-commerce personalizada con gestión de inventario y automatización de pedidos para licorería líder.',
    tags: ['E-commerce', 'Automatización'],
  },
]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [calendlyOpen, setCalendlyOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <main className="h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background ambient - animated */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-[#FFC400]/6 rounded-full blur-[120px] animate-breathe" />
        <div className="absolute bottom-[20%] right-[25%] w-[400px] h-[400px] bg-[#E6B000]/5 rounded-full blur-[100px] animate-breathe" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/4 rounded-full blur-[80px] animate-breathe" style={{ animationDelay: '4s' }} />
      </div>

      {/* ═══════════════════════════════════ */}
      {/* MOBILE: stacked scrollable layout  */}
      {/* ═══════════════════════════════════ */}
      <div className="relative z-10 lg:hidden flex flex-col min-h-[100dvh] overflow-y-auto">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-3 py-2 flex-shrink-0 sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <Image src="/logo-icon.png" alt="ailoom" width={22} height={22} className="rounded-full object-contain transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,196,0,0.6)]" unoptimized />
            <span className="text-[11px] font-semibold text-white">ailoom</span>
          </div>
          <button onClick={() => setCalendlyOpen(true)} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[#FFC400]/30 bg-[#FFC400]/10 text-[10px] text-[#FFC400]">
            <Calendar className="w-2.5 h-2.5" />
            Agendar
          </button>
        </div>

        {/* Mobile chat - max height so keyboard + send button always visible */}
        <div className={`px-3 pb-3 ${mounted ? 'animate-fadeInScale delay-200' : 'opacity-0'}`}>
          <div className="relative h-[65dvh] min-h-[380px]">
            <div className="absolute -inset-2 bg-[#FFC400]/10 rounded-2xl blur-xl" />
            <div className="relative glass-panel-strong rounded-2xl overflow-hidden h-full">
              <ChatWidget />
            </div>
          </div>
        </div>

        {/* Mobile: key landing content below chat */}
        <div className={`px-3 pb-8 space-y-3 ${mounted ? 'animate-fadeInUp delay-300' : 'opacity-0'}`}>
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-[#FFC400]/80 font-medium">Lo que construimos</p>
            <div className="grid grid-cols-2 gap-1.5">
              {SERVICES.map((s) => (
                <div key={s.title} className="glass-panel rounded-xl p-2.5 group">
                  <s.icon className="w-3.5 h-3.5 text-[#FFC400] mb-1" />
                  <h4 className="text-[10px] font-semibold text-white mb-0.5">{s.title}</h4>
                  <p className="text-[9px] text-[var(--muted)] leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-3 border-[#FFC400]/20 bg-gradient-to-r from-[#FFC400]/5 to-transparent">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-white mb-0.5">Auditoría de IA Gratuita</h3>
                <p className="text-[10px] text-[var(--muted)]">30 min con el fundador. Plan concreto para tu negocio.</p>
              </div>
              <button
                onClick={() => setCalendlyOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFC400] text-black text-[10px] font-medium whitespace-nowrap flex-shrink-0"
              >
                <Calendar className="w-3 h-3" />
                Agendar
              </button>
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
              <Image src="/logo-icon.png" alt="ailoom" width={32} height={32} className="rounded-full object-contain relative z-10 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,196,0,0.6)]" unoptimized />
              <div className="absolute inset-0 rounded-xl animate-goldPulse" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">ailoom</span>
          </div>

          {/* Hero copy - centered */}
          <div className={`text-center mb-2.5 ${mounted ? 'animate-slideInLeft delay-150' : 'opacity-0'}`}>
            <h1 className="text-xl xl:text-2xl 2xl:text-[1.7rem] font-bold text-white mb-1 leading-[1.15] tracking-tight">
              Tu Software{' '}
              <span className="bg-gradient-to-r from-[#FFC400] via-[#FFE066] to-[#FFC400] bg-clip-text text-transparent shimmer-text">
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
                  className={`px-2 py-0.5 text-[10px] rounded-full border border-[#FFC400]/20 bg-[#FFC400]/5 text-[#FFC400]/80 ${
                    mounted ? `animate-cardReveal delay-${(i + 2) * 100}` : 'opacity-0'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Calendly pill - centered above chat */}
          <div className={`mb-2.5 ${mounted ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
            <button
              onClick={() => setCalendlyOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#FFC400]/30 bg-[#FFC400]/10 text-[11px] text-[#FFC400] hover:bg-[#FFC400]/20 hover:border-[#FFC400]/50 transition-all duration-300"
            >
              <Calendar className="w-3 h-3" />
              Agendar Auditoría de IA Gratuita
            </button>
          </div>

          {/* Chat widget - fills ALL remaining vertical space */}
          <div className={`w-full flex-1 min-h-0 ${mounted ? 'animate-fadeInScale delay-300' : 'opacity-0'}`}>
            <div className="relative h-full max-w-[460px] mx-auto">
              <div className="absolute -inset-3 bg-[#FFC400]/12 rounded-3xl blur-2xl animate-pulseGlow" />
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
                <span className="bg-gradient-to-r from-[#FFC400] to-[#FFD040] bg-clip-text text-transparent">opera</span>,{' '}
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent shimmer-text">automatiza</span>
                {' '}y escala
              </h2>
              <p className="text-[var(--muted)] text-[11px] xl:text-xs leading-relaxed max-w-lg">
                Sistemas a la medida de tu operacion. Sin plantillas genericas. Construido exactamente para lo que tu negocio necesita.
              </p>
            </div>

            {/* Services 2x2 grid */}
            <div className={mounted ? 'animate-slideInRight delay-100' : 'opacity-0'}>
              <p className="text-[10px] uppercase tracking-widest text-[#FFC400]/80 mb-1.5 font-medium">Lo que construimos</p>
              <div className="grid grid-cols-2 gap-1.5 xl:gap-2">
                {SERVICES.map((s, i) => (
                  <div
                    key={s.title}
                    className={`glass-panel rounded-xl p-2.5 xl:p-3 hover:border-[#FFC400]/40 hover:bg-[#FFC400]/[0.03] transition-all duration-300 group cursor-default ${
                      mounted ? `animate-cardReveal delay-${(i + 2) * 100}` : 'opacity-0'
                    }`}
                  >
                    <s.icon className="w-4 h-4 text-[#FFC400] mb-1 group-hover:text-[#FFD040] group-hover:drop-shadow-[0_0_8px_rgba(255,196,0,0.5)] transition-all duration-300" />
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
              <div className="grid grid-cols-1 gap-1.5 xl:gap-2">
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
            <div className={`glass-panel rounded-xl p-3 xl:p-3.5 border-[#FFC400]/20 bg-gradient-to-r from-[#FFC400]/5 via-[#FFC400]/[0.02] to-transparent ${
              mounted ? 'animate-cardReveal delay-900' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs xl:text-sm font-bold text-white mb-0.5">Auditoría de IA Gratuita</h3>
                  <p className="text-[10px] xl:text-[11px] text-[var(--muted)] leading-snug">
                    30 min con el fundador de ailoom. Plan de acción concreto para tu negocio.
                  </p>
                </div>
                <button
                  onClick={() => setCalendlyOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFC400] text-black text-[11px] xl:text-xs font-medium hover:bg-[#FFD040] hover:shadow-[0_0_24px_rgba(255,196,0,0.4)] transition-all duration-300 whitespace-nowrap flex-shrink-0"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Agendar Auditoría
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </main>
  )
}
