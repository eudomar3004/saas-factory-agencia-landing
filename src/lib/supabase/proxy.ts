import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Rutas protegidas: solo /admin requiere auth
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // Rutas de auth (publicas)
  const authRoutes = ['/login', '/signup', '/forgot-password', '/update-password', '/check-email']
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Si intenta acceder a /admin sin auth, redirigir a login
  if (!user && isAdminRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si esta autenticado y esta en ruta de auth, redirigir a admin
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}
