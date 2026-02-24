import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@foxeo/supabase'
import { checkConsentVersion } from './middleware-consent'
import { detectLocale, setLocaleCookie } from './middleware-locale'

export const PUBLIC_PATHS = ['/login', '/signup', '/auth/callback']
export const CONSENT_EXCLUDED_PATHS = ['/consent-update', '/legal', '/api', '/suspended', '/graduation']
export const ONBOARDING_EXCLUDED_PATHS = ['/onboarding', '/login', '/signup', '/auth/callback', '/consent-update', '/legal', '/api', '/suspended', '/graduation']
export const GRADUATION_EXCLUDED_PATHS = ['/graduation', '/login', '/signup', '/auth/callback', '/consent-update', '/legal', '/api', '/suspended', '/onboarding']

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

export function isOnboardingExcluded(pathname: string): boolean {
  return ONBOARDING_EXCLUDED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

export function isGraduationExcluded(pathname: string): boolean {
  return GRADUATION_EXCLUDED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

export async function middleware(request: NextRequest) {
  // Skip static assets and webhook routes
  if (isStaticOrApi(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // 1. Detect and set locale (before auth check)
  const locale = detectLocale(request)

  const { user, response, supabase } = await createMiddlewareSupabaseClient(request)

  // Set locale cookie on response
  setLocaleCookie(response, locale)

  const isPublic = isPublicPath(request.nextUrl.pathname)

  // Unauthenticated user trying to access protected route → redirect to login
  if (!user && !isPublic) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    setLocaleCookie(redirectResponse, locale)
    return redirectResponse
  }

  // Authenticated user on login/signup → redirect to dashboard
  if (user && isPublic) {
    const redirectResponse = NextResponse.redirect(new URL('/', request.url))
    setLocaleCookie(redirectResponse, locale)
    return redirectResponse
  }

  // Check CGU consent version and client status for authenticated users (exclude specific paths)
  if (user && !isConsentExcluded(request.nextUrl.pathname)) {
    // Get client info from clients table (include onboarding + graduation fields)
    const { data: client } = await supabase
      .from('clients')
      .select('id, status, first_login_at, onboarding_completed, graduated_at, graduation_screen_shown')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (client?.id) {
      // Check if client is suspended
      if (client.status === 'suspended' && request.nextUrl.pathname !== '/suspended') {
        const suspendedUrl = new URL('/suspended', request.url)
        const suspendedResponse = NextResponse.redirect(suspendedUrl)
        setLocaleCookie(suspendedResponse, locale)
        return suspendedResponse
      }

      // Check consent version
      const consentRedirect = await checkConsentVersion(request, client.id)
      if (consentRedirect) {
        return consentRedirect
      }

      // Onboarding detection — only for non-onboarding paths
      if (!isOnboardingExcluded(request.nextUrl.pathname)) {
        // First login detection: first_login_at IS NULL
        if (!client.first_login_at) {
          // Record first login timestamp
          await supabase
            .from('clients')
            .update({ first_login_at: new Date().toISOString() })
            .eq('auth_user_id', user.id)

          console.log('[ONBOARDING:FIRST_LOGIN] Client:', user.id)

          // Redirect to welcome screen
          const welcomeUrl = request.nextUrl.clone()
          welcomeUrl.pathname = '/onboarding/welcome'
          const welcomeResponse = NextResponse.redirect(welcomeUrl)
          setLocaleCookie(welcomeResponse, locale)
          return welcomeResponse
        }

        // Onboarding not completed → redirect to welcome
        if (!client.onboarding_completed) {
          const welcomeUrl = request.nextUrl.clone()
          welcomeUrl.pathname = '/onboarding/welcome'
          const welcomeResponse = NextResponse.redirect(welcomeUrl)
          setLocaleCookie(welcomeResponse, locale)
          return welcomeResponse
        }
      }

      // Graduation detection — only for non-graduation paths
      if (!isGraduationExcluded(request.nextUrl.pathname)) {
        if (client.graduated_at && !client.graduation_screen_shown) {
          console.log('[GRADUATION:CELEBRATE] Client graduated:', user.id)

          const celebrateUrl = request.nextUrl.clone()
          celebrateUrl.pathname = '/graduation/celebrate'
          const celebrateResponse = NextResponse.redirect(celebrateUrl)
          setLocaleCookie(celebrateResponse, locale)
          return celebrateResponse
        }
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
