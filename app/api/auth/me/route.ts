import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // MOCK MODE - Return mock user data
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Returning mock user data');
      return NextResponse.json({
        user: {
          id: authUser.userId,
          email: authUser.email,
          name: authUser.email.split('@')[0],
          role: authUser.role,
          createdAt: new Date(),
        },
        mockMode: true,
      });
    }

    // REAL MODE - Fetch from database
    // Fetch full user details from database
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Failed to get user info' },
      { status: 500 }
    );
  }
}
