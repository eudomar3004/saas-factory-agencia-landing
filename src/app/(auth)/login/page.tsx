import Link from 'next/link'
import { LoginForm } from '@/features/auth/components'

export default function LoginPage() {
  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Admin</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Inicia sesion para continuar</p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-[var(--muted)] mt-4">
        No tienes cuenta?{' '}
        <Link href="/signup" className="text-violet-400 hover:text-violet-300 transition-colors">
          Crear cuenta
        </Link>
      </p>
    </>
  )
}
