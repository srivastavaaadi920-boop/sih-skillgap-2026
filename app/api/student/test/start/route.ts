import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { AdaptiveTestEngine } from '@/lib/testEngine';
import { prisma } from '@/lib/prisma';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

export async function POST(request: NextRequest) {
  try {
    const { skillId } = await request.json();

    if (!skillId) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // MOCK MODE - check this BEFORE any database calls
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Simulating test start');
      return NextResponse.json({
        attemptId: 'mock-attempt-' + Date.now(),
        firstQuestion: {
          id: 'mock-question-1',
          type: 'CONCEPTUAL_MCQ',
          difficultyLevel: 'INTERMEDIATE',
          promptText: 'What is the primary purpose of version control systems like Git?',
          codeSnippet: null,
          options: [
            'To compile code faster',
            'To track changes and collaborate on code',
            'To deploy applications to production',
            'To write documentation automatically',
          ],
          timeLimitSeconds: 60,
          skillId,
        },
        mockMode: true,
      });
    }

    // Real mode - check auth
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: authUser.userId },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Start test
    const result = await AdaptiveTestEngine.startTest(
      studentProfile.id,
      skillId
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to start test:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start test' },
      { status: 500 }
    );
  }
}
