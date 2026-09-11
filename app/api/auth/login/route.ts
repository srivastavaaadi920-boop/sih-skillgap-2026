import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, createAuthCookie } from '@/lib/auth';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

// Mock credentials for development
const MOCK_CREDENTIALS = [
  { email: 'student@test.com', password: 'password123', role: 'STUDENT', name: 'Test Student' },
  { email: 'company@test.com', password: 'password123', role: 'INDUSTRY', name: 'Test Company' },
  { email: 'professor@test.com', password: 'password123', role: 'ACADEMICIAN', name: 'Dr. Professor' },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // MOCK MODE - Bypass database
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Simulating login without database');
      
      // Check mock credentials
      const mockUser = MOCK_CREDENTIALS.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      console.log('✅ MOCK MODE: Login successful:', mockUser.email);

      // Generate JWT token
      const token = await signToken({
        userId: `mock_${mockUser.email}`,
        email: mockUser.email,
        role: mockUser.role,
      });

      // Create response with user info
      const response = NextResponse.json({
        user: {
          id: `mock_${mockUser.email}`,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
        mockMode: true,
      });

      // Set httpOnly cookie
      const cookieOptions = createAuthCookie(token);
      response.cookies.set(cookieOptions);

      return response;
    }

    // REAL MODE - Use database
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response with user info (never return passwordHash)
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set httpOnly cookie
    const cookieOptions = createAuthCookie(token);
    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
