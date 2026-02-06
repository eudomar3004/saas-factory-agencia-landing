import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'SaaS Factory - Software a Medida para tu Negocio',
  description: 'De meses a semanas. Construimos ERPs, CRMs, agentes IA, automatizaciones y aplicaciones web a la medida de tu operacion. Diagnostico gratuito.',
  keywords: ['software a medida', 'ERP', 'CRM', 'agentes IA', 'automatizacion', 'desarrollo web', 'SaaS'],
  authors: [{ name: 'SaaS Factory' }],
  openGraph: {
    title: 'SaaS Factory - Tu Software a Medida',
    description: 'ERPs, CRMs, agentes IA y automatizaciones. Construido en semanas, no en meses. Diagnostico gratuito.',
    type: 'website',
    locale: 'es_MX',
    siteName: 'SaaS Factory',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Factory - Tu Software a Medida',
    description: 'ERPs, CRMs, agentes IA y automatizaciones. Construido en semanas, no en meses.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
