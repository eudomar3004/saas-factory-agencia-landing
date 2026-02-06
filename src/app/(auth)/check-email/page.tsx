import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-white mb-3">Revisa tu email</h1>
      <p className="text-[var(--muted)] text-sm mb-6">
        Te enviamos un link de confirmacion. Revisa tu bandeja de entrada para completar tu registro.
      </p>
      <Link
        href="/login"
        className="text-violet-400 hover:text-violet-300 transition-colors text-sm"
      >
        Volver al login
      </Link>
    </div>
  )
}
