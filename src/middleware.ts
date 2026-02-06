/**
 * Next.js Middleware for Route Protection
 *
 * Implements route protection for authenticated areas and tenant isolation.
 * Protects dashboard and tenant-specific routes.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/custom-session'

/**
 * Middleware function for route protection
 */
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Handle basePath - remove it from pathname for matching
  const basePath = '/auraforce'
  const pathWithoutBase = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || '/'
    : pathname

  // Public routes that don't require authentication (without basePath prefix)
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/verify',
    '/forgot-password',
    '/market',
    '/clear-test',
    '/test-*',
    '/auth*',
    '/simple*',
    '/_next',
    '/favicon.ico',
  ]

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route =>
    pathWithoutBase === route || pathWithoutBase.startsWith(route)
  )

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes require authentication - use custom session
  const session = await getSession()

  if (!session?.user?.id) {
    // User is not authenticated, redirect to login
    // Use relative path - Next.js will handle basePath automatically
    // Pass the original pathname as redirect (without basePath prefix)
    req.nextUrl.pathname = basePath + '/login'
    req.nextUrl.searchParams.set('redirect', pathWithoutBase)
    return NextResponse.redirect(req.nextUrl)
  }

  // Tenant-specific routes handling
  // If accessing a tenant-specific route (like /tenant/[tenantId])
  if (pathWithoutBase.startsWith('/tenant/')) {
    const segments = pathWithoutBase.split('/')

    // Find the tenantId in the path
    const tenantId = segments.length >= 3 ? segments[2] : null

    if (tenantId) {
      // Verify user belongs to this tenant
      const prisma = (await import('@/lib/prisma')).prisma
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { tenantId: true },
      })

      if (!user || user.tenantId !== tenantId) {
        // User doesn't belong to this tenant
        req.nextUrl.pathname = basePath
        return NextResponse.redirect(req.nextUrl)
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
