import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Placeholder auth check — Story 1.3 will implement client auth
  // For now, allow all requests through
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
