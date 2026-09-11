import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { AdaptiveTestEngine } from '@/lib/testEngine';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    const { attemptId, questionId, selectedAnswerIndex, timeTakenSeconds } =
      await request.json();

    if (
      !attemptId ||
      !questionId ||
      typeof selectedAnswerIndex !== 'number' ||
      typeof timeTakenSeconds !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // MOCK MODE
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Simulating answer submission');
      console.log(`   Question ID: ${questionId}`);
      console.log(`   Selected Answer: ${selectedAnswerIndex}`);
      
      // Extract question number from questionId (format: mock-question-N)
      const currentQuestionNum = parseInt(questionId.split('-')[2] || '1');
      const nextQuestionNum = currentQuestionNum + 1;
      
      console.log(`   Current Question #: ${currentQuestionNum}`);
      
      // Serve 5 questions total, then complete
      if (currentQuestionNum < 5) {
        console.log(`   → Serving next question #${nextQuestionNum}`);
        return NextResponse.json({
          testComplete: false,
          question: {
            id: 'mock-question-' + nextQuestionNum,
            type: nextQuestionNum === 2 ? 'CODE_OUTPUT_PREDICTION' : 'CONCEPTUAL_MCQ',
            difficultyLevel: nextQuestionNum <= 2 ? 'BEGINNER' : nextQuestionNum <= 4 ? 'INTERMEDIATE' : 'ADVANCED',
            promptText: nextQuestionNum === 2 
              ? 'What will this code output?\n\nconst arr = [1, 2, 3];\nconsole.log(arr[arr.length]);'
              : `Mock question ${nextQuestionNum}: Which of the following is correct?`,
            codeSnippet: nextQuestionNum === 2 ? 'const arr = [1, 2, 3];\nconsole.log(arr[arr.length]);' : null,
            options: nextQuestionNum === 2 
              ? ['3', 'undefined', 'Error', 'null']
              : [`Option A for Q${nextQuestionNum}`, `Option B for Q${nextQuestionNum}`, `Option C for Q${nextQuestionNum}`, `Option D for Q${nextQuestionNum}`],
            timeLimitSeconds: nextQuestionNum === 2 ? 90 : 60,
            skillId: 'mock-skill-id',
          },
          mockMode: true,
        });
      }

      // After 5 questions, complete the test
      console.log(`   → Test complete after ${currentQuestionNum} questions`);
      return NextResponse.json({
        testComplete: true,
        testResult: {
          finalVerifiedLevel: 'INTERMEDIATE',
          status: 'PASSED',
          totalQuestions: 5,
          correctAnswers: 4,
          breakdown: [
            { tier: 'BEGINNER', correct: 2, total: 2 },
            { tier: 'INTERMEDIATE', correct: 2, total: 2 },
            { tier: 'ADVANCED', correct: 0, total: 1 },
          ],
          selfRatedLevel: 'ADVANCED',
          hasMismatch: true,
          mismatchMessage: 'You rated yourself advanced — verified level is intermediate. Keep practicing!',
        },
        mockMode: true,
      });
    }

    // Submit answer and get next question or result
    const result = await AdaptiveTestEngine.submitAnswer(
      attemptId,
      questionId,
      selectedAnswerIndex,
      timeTakenSeconds
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to submit answer:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
