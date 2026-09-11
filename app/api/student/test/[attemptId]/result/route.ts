import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { AdaptiveTestEngine } from '@/lib/testEngine';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    const { attemptId } = params;

    // MOCK MODE
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Returning mock test result');
      return NextResponse.json({
        finalVerifiedLevel: 'INTERMEDIATE',
        status: 'PASSED',
        totalQuestions: 6,
        correctAnswers: 5,
        breakdown: [
          { tier: 'BEGINNER', correct: 2, total: 2 },
          { tier: 'INTERMEDIATE', correct: 3, total: 3 },
          { tier: 'ADVANCED', correct: 0, total: 1 },
        ],
        selfRatedLevel: 'ADVANCED',
        hasMismatch: true,
        mismatchMessage: 'You rated yourself advanced — verified level is intermediate. Keep practicing!',
        mockMode: true,
      });
    }

    // Get test result
    const result = await AdaptiveTestEngine.getTestResult(attemptId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to get test result:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get test result' },
      { status: 500 }
    );
  }
}
