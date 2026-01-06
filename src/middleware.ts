/**
 * Next.js Middleware for Route Protection
 *
 * Implements route protection for authenticated areas and tenant isolation.
 * Protects dashboard and tenant-specific routes.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'

/**
 * Middleware function for route protection
 */
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/verify',
    '/forgot-password',
    '/api/auth/signup',
    '/api/auth/verify-email',
    '/api/auth/resend-verification',
    '/api/auth/signin',
    '/_next',
    '/favicon.ico',
  ]

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route)
  )

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes require authentication
  const session = await getSession()

  if (!session) {
    // User is not authenticated, redirect to login
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Tenant-specific routes handling
  // If accessing a tenant-specific route (like /tenant/[tenantId])
  if (pathname.startsWith('/tenant/')) {
    const segments = pathname.split('/')

    if (segments.length >= 3) {
      const tenantId = segments[2]

      // Verify user belongs to this tenant
      const prisma = (await import('@/lib/prisma')).prisma
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { tenantId: true },
      })

      if (!user || user.tenantId !== tenantId) {
        // User doesn't belong to this tenant
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  }

  // User is authenticated, allow access
  return NextResponse.next()
}

/**
 * Middleware configuration
 *
 * Matcher patterns determine which routes this middleware runs on:
 * - '/:path*' - Run on all routes except ignored ones
 *
 * Excluded routes (middleware doesn't run):
 * - '/api/auth/*' - Authentication API endpoints are handled in config
 * - '/_next/*' - Next.js internal routes
 * - Static files are automatically excluded
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}
