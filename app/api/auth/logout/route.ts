import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // Clear the auth cookie
  const cookieOptions = clearAuthCookie();
  response.cookies.set(cookieOptions);
  
  return response;
}
