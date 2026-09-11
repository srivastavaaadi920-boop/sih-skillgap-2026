import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const MOCK_MODE = process.env.MOCK_MODE === 'true';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Token exists:', !!token);
  console.log('Middleware - Mock Mode:', MOCK_MODE);

  // Protected routes that require authentication
  const protectedPaths = ['/student', '/industry', '/academician'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    // Check if user is authenticated
    if (!token) {
      console.log('Middleware - No token, redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Verify token
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      console.log('Middleware - Token payload:', payload);
      
      // Check role-based access
      const role = (payload.role as string).toLowerCase();
      console.log('Middleware - User role:', role, 'Path:', pathname);
      
      if (pathname.startsWith('/student') && role !== 'student') {
        console.log('Middleware - Wrong role for /student');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      if (pathname.startsWith('/industry') && role !== 'industry') {
        console.log('Middleware - Wrong role for /industry');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      if (pathname.startsWith('/academician') && role !== 'academician') {
        console.log('Middleware - Wrong role for /academician');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      console.log('Middleware - Access granted');
    } catch (error) {
      console.error('Middleware - Token verification failed:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/industry/:path*', '/academician/:path*'],
};
