import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@foxeo/supabase'

export const PUBLIC_PATHS = ['/login', '/setup-mfa', '/auth/callback']

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

export function isStaticOrApi(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/webhooks') ||
    pathname === '/favicon.ico'
  )
}

export async function middleware(request: NextRequest) {
  // Skip static assets and webhook routes
  if (isStaticOrApi(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const { supabase, user, response } = await createMiddlewareSupabaseClient(request)

  const isPublic = isPublicPath(request.nextUrl.pathname)

  // 1. Unauthenticated user on protected route → login
  if (!user && !isPublic) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Authenticated user on public auth page → redirect to dashboard if already aal2
  if (user && isPublic) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal?.currentLevel === 'aal2') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Not AAL2 yet — let them proceed to MFA verification/setup pages
    return response
  }

  // 3. Authenticated user on protected route → verify operator + AAL2
  // TODO: Optimize — consider caching operator role in JWT custom claims
  // to avoid a DB query on every protected route navigation.
  if (user && !isPublic) {
    // Verify operator exists via SECURITY DEFINER function (bypasses RLS)
    // Direct table query would fail if auth_user_id not yet linked
    const { data: operator } = (await supabase.rpc('fn_get_operator_by_email' as never, {
      p_email: user.email ?? '',
    } as never)) as unknown as {
      data: { id: string; name: string; role: string; twoFactorEnabled: boolean; authUserId: string | null } | null
    }

    if (!operator) {
      // Not an operator — sign out and redirect
      await supabase.auth.signOut()
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(redirectUrl)
    }

    // Check AAL (Authentication Assurance Level)
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

    if (aal?.currentLevel !== 'aal2') {
      // 2FA not yet setup → redirect to setup
      if (!operator.twoFactorEnabled) {
        return NextResponse.redirect(new URL('/setup-mfa', request.url))
      }
      // 2FA setup but not verified this session → redirect to verify
      return NextResponse.redirect(new URL('/login/verify-mfa', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
