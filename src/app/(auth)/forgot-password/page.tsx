import Link from 'next/link'
import { ForgotPasswordForm } from '@/features/auth/components'

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Recuperar password</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Ingresa tu email para recibir un link de recuperacion</p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-sm text-[var(--muted)] mt-4">
        <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
          Volver al login
        </Link>
      </p>
    </>
  )
}
