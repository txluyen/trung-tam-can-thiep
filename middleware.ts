import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  if (!user && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    if (path === '/' || path === '/login') {
      const { data } = await supabase
        .from('user_roles').select('role').eq('user_id', user.id).single()
      const role = data?.role
      if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      if (role === 'teacher') return NextResponse.redirect(new URL('/teacher/schedule', request.url))
      if (role === 'parent') return NextResponse.redirect(new URL('/parent/dashboard', request.url))
    }

    if (path.startsWith('/admin')) {
      const { data } = await supabase
        .from('user_roles').select('role').eq('user_id', user.id).single()
      if (data?.role !== 'admin') return NextResponse.redirect(new URL('/login', request.url))
    }
    if (path.startsWith('/teacher')) {
      const { data } = await supabase
        .from('user_roles').select('role').eq('user_id', user.id).single()
      if (data?.role !== 'teacher') return NextResponse.redirect(new URL('/login', request.url))
    }
    if (path.startsWith('/parent')) {
      const { data } = await supabase
        .from('user_roles').select('role').eq('user_id', user.id).single()
      if (data?.role !== 'parent') return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|icons).*)'],
}
