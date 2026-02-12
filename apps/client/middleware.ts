import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@foxeo/supabase'
import { checkConsentVersion } from './middleware-consent'

export const PUBLIC_PATHS = ['/login', '/signup', '/auth/callback']
export const CONSENT_EXCLUDED_PATHS = ['/consent-update', '/legal', '/api']

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

export function isConsentExcluded(pathname: string): boolean {
  return CONSENT_EXCLUDED_PATHS.some(
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

  const { user, response } = await createMiddlewareSupabaseClient(request)

  const isPublic = isPublicPath(request.nextUrl.pathname)

  // Unauthenticated user trying to access protected route → redirect to login
  if (!user && !isPublic) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Authenticated user on login/signup → redirect to dashboard
  if (user && isPublic) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Check CGU consent version for authenticated users (exclude specific paths)
  if (user && !isConsentExcluded(request.nextUrl.pathname)) {
    // Get client_id from clients table
    const { supabase } = await createMiddlewareSupabaseClient(request)
    const { data: client } = (await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()) as { data: { id: string } | null }

    if (client?.id) {
      const consentRedirect = await checkConsentVersion(request, client.id)
      if (consentRedirect) {
        return consentRedirect
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
