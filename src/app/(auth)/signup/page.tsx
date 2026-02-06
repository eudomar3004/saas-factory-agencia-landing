import Link from 'next/link'
import { SignupForm } from '@/features/auth/components'

export default function SignupPage() {
  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Registrate para acceder al admin</p>
      </div>

      <SignupForm />

      <p className="text-center text-sm text-[var(--muted)] mt-4">
        Ya tienes cuenta?{' '}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
          Iniciar sesion
        </Link>
      </p>
    </>
  )
}
