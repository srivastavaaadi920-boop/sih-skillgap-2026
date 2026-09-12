import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);
const COOKIE_NAME = 'auth_token';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('✅ Token verified successfully:', payload);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (error) {
    console.error('❌ Token verification failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  try {
    console.log('🔐 getAuthUser() called');
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    
    console.log('   Cookie name:', COOKIE_NAME);
    console.log('   Token exists:', !!token);
    console.log('   Token (first 20 chars):', token?.substring(0, 20) + '...');
    
    if (!token) {
      console.log('   ❌ No token found in cookies');
      return null;
    }
    
    const result = await verifyToken(token);
    console.log('   Verification result:', result ? `${result.email} (${result.role})` : 'null');
    return result;
  } catch (error) {
    console.error('❌ getAuthUser() error:', error);
    return null;
  }
}

export function createAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };
}

export function clearAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  };
}
