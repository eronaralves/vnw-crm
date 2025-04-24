import {
  NextResponse,
  type MiddlewareConfig,
  type NextRequest,
} from 'next/server'

const publicRouter = [
  {
    path: '/sign-in',
    whenAuthenticated: 'redirect',
  },
  {
    path: '/register',
    whenAuthenticated: 'redirect',
  },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/sign-in'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const publicRoute = publicRouter.find((route) => route.path === path)

  const authToken = request.cookies.get('session')

  if (path === '/') {
    const redirectUrl = request.nextUrl.clone()

    redirectUrl.pathname = authToken
      ? '/leads'
      : REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

    return NextResponse.redirect(redirectUrl)
  }

  if (!authToken && publicRoute) {
    return NextResponse.next()
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

    return NextResponse.redirect(redirectUrl)
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/leads'

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
