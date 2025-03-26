import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isSellerPage = req.nextUrl.pathname.startsWith('/seller') || req.nextUrl.pathname.startsWith('/v1/seller')
    
    // If it's a seller page and user is not a seller, redirect to home
    if (isSellerPage && token?.role !== 'SELLER') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token // Ensure user is authenticated
    }
  }
)

// Protect all seller routes
export const config = {
  matcher: [
    '/seller/:path*',
    '/v1/seller/:path*',
    '/api/seller/:path*'
  ]
} 