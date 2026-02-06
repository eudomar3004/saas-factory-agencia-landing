import { UpdatePasswordForm } from '@/features/auth/components'

export default function UpdatePasswordPage() {
  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Nuevo password</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Ingresa tu nuevo password</p>
      </div>

      <UpdatePasswordForm />
    </>
  )
}
