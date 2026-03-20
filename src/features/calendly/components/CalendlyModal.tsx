'use client'

import { useEffect, useState } from 'react'
import { PopupModal } from 'react-calendly'

const CALENDLY_URL = 'https://calendly.com/eudomartoribio/30min'

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setRootElement(document.body)
  }, [])

  if (!rootElement) return null

  return (
    <PopupModal
      url={CALENDLY_URL}
      onModalClose={onClose}
      open={isOpen}
      rootElement={rootElement}
      pageSettings={{
        backgroundColor: '000000',
        textColor: 'ffffff',
        primaryColor: 'FFC400',
      }}
    />
  )
}
