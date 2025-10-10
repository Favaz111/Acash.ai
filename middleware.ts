/**
 * Next.js Middleware
 * Handles i18n, authentication, rate limiting, and route protection
 */

import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './i18n';

const defaultLocale = 'ar' as const;

// ==========================================
// CONFIGURATION
// ==========================================

const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/tools',
  '/tools/debt', // Free debt calculator
  '/assessment/quick', // Free quick assessment
];

const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/tools/debt-management', // Premium
  '/tools/budget', // Premium
  '/tools/investment', // Premium
];

const PREMIUM_ROUTES = [
  '/tools/debt-management',
  '/tools/budget',
  '/tools/investment',
  '/tools/retirement',
  '/tools/emergency-fund',
];

// ==========================================
// RATE LIMITING
// ==========================================

// Simple in-memory rate limiting (for development)
// In production, use Vercel KV or Redis
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false; // Rate limit exceeded
  }

  userLimit.count++;
  return true;
}

// Clean up old entries every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimit.entries()) {
      if (now > data.resetTime) {
        rateLimit.delete(ip);
      }
    }
  }, 300000);
}

// ==========================================
// I18N MIDDLEWARE
// ==========================================

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: 'always',
});

// ==========================================
// MIDDLEWARE FUNCTION
// ==========================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for API routes, static files, and manifest
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_vercel/') ||
    pathname === '/manifest.json' ||
    pathname === '/manifest.webmanifest' ||
    /\.(ico|png|jpg|jpeg|svg|gif|webp)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ==========================================
  // LOCALE ENFORCEMENT - Prevent Mixed Paths
  // ==========================================

  // Extract segments and check for mixed locale paths (e.g., /ar/en, /en/ar)
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const secondSegment = segments[1];

  // Check if first segment is a valid locale
  const isValidLocale = locales.includes(firstSegment as any);

  // If first segment is NOT a locale, redirect with cookie-based fallback
  if (!isValidLocale && segments.length > 0) {
    // Check cookie for preferred locale
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const targetLocale = locales.includes(cookieLocale as any) ? cookieLocale : defaultLocale;

    const url = new URL(request.url);
    url.pathname = `/${targetLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Handle root path (/) with cookie-based fallback
  if (!isValidLocale && segments.length === 0) {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const targetLocale = locales.includes(cookieLocale as any) ? cookieLocale : defaultLocale;

    const url = new URL(request.url);
    url.pathname = `/${targetLocale}`;
    return NextResponse.redirect(url);
  }

  // Check if second segment is also a locale (mixed path like /ar/en)
  if (isValidLocale && secondSegment && locales.includes(secondSegment as any)) {
    // Redirect to first locale only, removing the second locale
    const url = new URL(request.url);
    const restOfPath = segments.slice(2).join('/');
    url.pathname = `/${firstSegment}${restOfPath ? '/' + restOfPath : ''}`;
    return NextResponse.redirect(url);
  }

  // Apply i18n middleware
  const intlResponse = intlMiddleware(request);

  // Extract locale from pathname for further processing
  const pathnameLocale = firstSegment;
  const pathnameWithoutLocale =
    isValidLocale && pathnameLocale ? pathname.slice(pathnameLocale.length + 1) : pathname;

  // Get IP address for rate limiting
  const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'unknown';

  // ==========================================
  // 1. RATE LIMITING
  // ==========================================

  // API routes have stricter limits
  if (pathname.startsWith('/api/')) {
    if (!checkRateLimit(`api:${ip}`, 50, 60000)) {
      // 50 requests per minute for API
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'تجاوزت الحد المسموح من الطلبات. حاول مرة أخرى بعد دقيقة.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }
  } else {
    // General routes have more lenient limits
    if (!checkRateLimit(ip, 200, 60000)) {
      // 200 requests per minute
      return NextResponse.redirect(new URL('/error?code=429', request.url));
    }
  }

  // ==========================================
  // 2. AUTHENTICATION CHECK - DISABLED (Using Client-Side Firebase Auth)
  // ==========================================

  // NOTE: Authentication is handled client-side by Firebase Auth in each page
  // Middleware auth checks are disabled to prevent redirect loops
  // TODO: Implement proper session management with Firebase Admin SDK for server-side auth

  /*
  // Get session token from cookie (you'll need to implement this with Firebase Auth)
  const session = request.cookies.get('session');
  const isAuthenticated = !!session?.value;

  // Check if route is protected (use pathname without locale)
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const locale = isValidLocale ? pathnameLocale : defaultLocale;
    const url = new URL(`/${locale}/auth/login`, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && pathnameWithoutLocale.startsWith('/auth/')) {
    const locale = isValidLocale ? pathnameLocale : defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }
  */

  // ==========================================
  // 3. PREMIUM CHECK (if implemented)
  // ==========================================

  // Premium route checking disabled - handled client-side
  // const isPremiumRoute = PREMIUM_ROUTES.some((route) => pathnameWithoutLocale.startsWith(route));

  /*
  if (isPremiumRoute && isAuthenticated) {
    // TODO: Check user's subscription status from database
    // For now, we'll allow access
    // In production, fetch user data and check subscription
    const user = await getUserFromSession(session.value);
    if (!user || user.subscriptionTier === 'free') {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }
  */

  // ==========================================
  // 4. SECURITY HEADERS (already in next.config.ts, but can add more here)
  // ==========================================

  const response = intlResponse;

  // Add additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Robots-Tag', 'index, follow');

  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust in production
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  }

  return response;
}

// ==========================================
// MATCHER CONFIGURATION
// ==========================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|_vercel|favicon.ico|manifest.json|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
