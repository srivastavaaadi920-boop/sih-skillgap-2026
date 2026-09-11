import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, createAuthCookie } from '@/lib/auth';
import { UserRole } from '@prisma/client';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

// Mock in-memory storage for development
const mockUsers: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, ...roleSpecificFields } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['STUDENT', 'INDUSTRY', 'ACADEMICIAN', 'INSTITUTION_ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // MOCK MODE - Bypass database
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Simulating registration without database');
      
      // Check if user already exists in mock storage
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      // Create mock user
      const mockUser = {
        id: `mock_${Date.now()}`,
        email,
        name,
        role: role as UserRole,
        createdAt: new Date(),
      };

      mockUsers.push(mockUser);
      console.log('✅ MOCK MODE: User registered:', mockUser);

      // Generate JWT token
      const token = await signToken({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });

      // Create response with cookie
      const response = NextResponse.json(
        {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role,
          },
          mockMode: true,
        },
        { status: 201 }
      );

      // Set httpOnly cookie
      const cookieOptions = createAuthCookie(token);
      response.cookies.set(cookieOptions);

      return response;
    }

    // REAL MODE - Use database
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: role as UserRole,
        },
      });

      // Create role-specific profile
      if (role === 'STUDENT') {
        const { institutionName, course, yearOfStudy, bio } = roleSpecificFields;
        
        if (!institutionName || !course || !yearOfStudy) {
          throw new Error('Student requires: institutionName, course, yearOfStudy');
        }

        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            institutionName,
            course,
            yearOfStudy: parseInt(yearOfStudy),
            bio: bio || null,
          },
        });
      } else if (role === 'INDUSTRY') {
        const { companyName, industryType, website, description } = roleSpecificFields;
        
        if (!companyName || !industryType) {
          throw new Error('Industry requires: companyName, industryType');
        }

        await tx.industryProfile.create({
          data: {
            userId: newUser.id,
            companyName,
            industryType,
            website: website || null,
            description: description || null,
          },
        });
      } else if (role === 'ACADEMICIAN') {
        const { institutionName, department, designation } = roleSpecificFields;
        
        if (!institutionName || !department || !designation) {
          throw new Error('Academician requires: institutionName, department, designation');
        }

        await tx.academicianProfile.create({
          data: {
            userId: newUser.id,
            institutionName,
            department,
            designation,
          },
        });
      }

      return newUser;
    });

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response with cookie
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Set httpOnly cookie
    const cookieOptions = createAuthCookie(token);
    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 500 }
    );
  }
}
