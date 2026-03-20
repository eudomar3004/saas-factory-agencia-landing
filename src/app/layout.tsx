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
  title: 'ailoom - Software a Medida para tu Negocio',
  description: 'De meses a semanas. Construimos ERPs, CRMs, agentes IA, automatizaciones y aplicaciones web a la medida de tu operacion. Diagnostico gratuito.',
  keywords: ['software a medida', 'ERP', 'CRM', 'agentes IA', 'automatizacion', 'desarrollo web', 'SaaS'],
  authors: [{ name: 'ailoom' }],
  openGraph: {
    title: 'ailoom - Tu Software a Medida',
    description: 'ERPs, CRMs, agentes IA y automatizaciones. Construido en semanas, no en meses. Diagnostico gratuito.',
    type: 'website',
    locale: 'es_MX',
    siteName: 'ailoom',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ailoom - Tu Software a Medida',
    description: 'ERPs, CRMs, agentes IA y automatizaciones. Construido en semanas, no en meses.',
  },
  icons: {
    icon: '/logo-icon.png',
    shortcut: '/logo-icon.png',
    apple: '/logo-icon.png',
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
