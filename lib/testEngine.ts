import { prisma } from '@/lib/prisma';
import { SkillLevel, QuestionType, TestStatus } from '@prisma/client';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const MIN_QUESTIONS = 5;
const MAX_QUESTIONS = 7;

// Confidence threshold for early stopping:
// If student gets 3+ correct at a tier and maintains it, we can stop early
const CONFIDENCE_THRESHOLD = 3;

// Pass threshold: need 2+ correct answers at a tier to verify at that level
const PASS_THRESHOLD = 2;

// Difficulty tier ordering
const DIFFICULTY_TIERS: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

// ============================================
// TYPES
// ============================================

interface Question {
  id: string;
  skillId: string;
  type: QuestionType;
  difficultyLevel: SkillLevel;
  promptText: string;
  codeSnippet: string | null;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  timeLimitSeconds: number;
  isAIGenerated: boolean;
}

interface TestState {
  attemptId: string;
  skillId: string;
  studentProfileId: string;
  currentDifficulty: SkillLevel;
  questionsAsked: number;
  correctByTier: Map<SkillLevel, number>;
  totalByTier: Map<SkillLevel, number>;
  highestCorrectTier: SkillLevel | null;
}

interface NextQuestionResult {
  question?: Omit<Question, 'correctAnswerIndex' | 'explanation'>; // Hide answer until submitted
  testComplete: boolean;
  testResult?: TestResult;
}

interface TestResult {
  finalVerifiedLevel: SkillLevel | null;
  status: TestStatus;
  totalQuestions: number;
  correctAnswers: number;
  breakdown: {
    tier: SkillLevel;
    correct: number;
    total: number;
  }[];
  selfRatedLevel?: SkillLevel;
  hasMismatch: boolean;
  mismatchMessage?: string;
}

// ============================================
// ADAPTIVE TEST ENGINE
// ============================================

export class AdaptiveTestEngine {
  /**
   * Start a new test attempt for a student and skill.
   * Returns the first question at the student's self-rated level.
   */
  static async startTest(
    studentProfileId: string,
    skillId: string
  ): Promise<{ attemptId: string; firstQuestion: Omit<Question, 'correctAnswerIndex' | 'explanation'> }> {
    // Get student's self-rated level for this skill
    const selfRating = await prisma.studentSkillSelection.findUnique({
      where: {
        studentProfileId_skillId: {
          studentProfileId,
          skillId,
        },
      },
    });

    if (!selfRating) {
      throw new Error('Student has not self-rated this skill yet');
    }

    // Create test attempt
    const attempt = await prisma.testAttempt.create({
      data: {
        studentProfileId,
        skillId,
        status: 'IN_PROGRESS',
      },
    });

    // Get first question at self-rated level
    const firstQuestion = await this.getNextQuestion(
      studentProfileId,
      skillId,
      selfRating.selfRatedLevel
    );

    if (!firstQuestion) {
      throw new Error('No questions available for this skill');
    }

    // Return question without answer
    const { correctAnswerIndex, explanation, ...questionWithoutAnswer } = firstQuestion;

    return {
      attemptId: attempt.id,
      firstQuestion: questionWithoutAnswer,
    };
  }

  /**
   * Submit an answer and get the next question or final result.
   */
  static async submitAnswer(
    attemptId: string,
    questionId: string,
    selectedAnswerIndex: number,
    timeTakenSeconds: number
  ): Promise<NextQuestionResult> {
    // Get test attempt
    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new Error('Test attempt not found');
    }

    if (attempt.status !== 'IN_PROGRESS') {
      throw new Error('Test is already completed');
    }

    // Get question details
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new Error('Question not found');
    }

    // Check if answer is correct
    const isCorrect = selectedAnswerIndex === question.correctAnswerIndex;

    // Record answer
    await prisma.testAnswer.create({
      data: {
        testAttemptId: attemptId,
        questionId,
        selectedAnswerIndex,
        isCorrect,
        timeTakenSeconds,
      },
    });

    // Build current test state
    const state = this.buildTestState(attempt, question.difficultyLevel);
    
    // Update state with this answer
    if (isCorrect) {
      state.correctByTier.set(
        question.difficultyLevel,
        (state.correctByTier.get(question.difficultyLevel) || 0) + 1
      );
      
      // Update highest correct tier
      const currentTierIndex = DIFFICULTY_TIERS.indexOf(question.difficultyLevel);
      const highestTierIndex = state.highestCorrectTier
        ? DIFFICULTY_TIERS.indexOf(state.highestCorrectTier)
        : -1;
      
      if (currentTierIndex > highestTierIndex) {
        state.highestCorrectTier = question.difficultyLevel;
      }
    }

    state.totalByTier.set(
      question.difficultyLevel,
      (state.totalByTier.get(question.difficultyLevel) || 0) + 1
    );
    state.questionsAsked += 1;

    // Decide next difficulty (adaptive logic)
    const nextDifficulty = this.getNextDifficulty(
      question.difficultyLevel,
      isCorrect
    );

    // Check if test should end
    if (this.shouldEndTest(state)) {
      const result = await this.finalizeTest(attemptId, state);
      return {
        testComplete: true,
        testResult: result,
      };
    }

    // Get next question
    const nextQuestion = await this.getNextQuestion(
      attempt.studentProfileId,
      attempt.skillId,
      nextDifficulty
    );

    if (!nextQuestion) {
      // No more questions available - all questions for this skill+difficulty have been served
      // End test gracefully with current performance
      const result = await this.finalizeTest(attemptId, state);
      return {
        testComplete: true,
        testResult: result,
      };
    }

    // Return next question without answer
    const { correctAnswerIndex: _ans, explanation: _exp, ...questionWithoutAnswer } = nextQuestion;

    return {
      testComplete: false,
      question: questionWithoutAnswer,
    };
  }

  /**
   * Get test result for a completed attempt.
   */
  static async getTestResult(attemptId: string): Promise<TestResult> {
    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
        studentProfile: {
          include: {
            studentSkillSelections: {
              where: {
                skillId: {
                  equals: undefined, // Will be set below
                },
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new Error('Test attempt not found');
    }

    // Get self-rated level
    const selfRating = await prisma.studentSkillSelection.findUnique({
      where: {
        studentProfileId_skillId: {
          studentProfileId: attempt.studentProfileId,
          skillId: attempt.skillId,
        },
      },
    });

    // Build breakdown
    const breakdown = DIFFICULTY_TIERS.map(tier => {
      const answersAtTier = attempt.answers.filter(
        a => a.question.difficultyLevel === tier
      );
      return {
        tier,
        correct: answersAtTier.filter(a => a.isCorrect).length,
        total: answersAtTier.length,
      };
    });

    const totalCorrect = attempt.answers.filter(a => a.isCorrect).length;

    // Check for mismatch
    const hasMismatch =
      selfRating &&
      attempt.finalVerifiedLevel &&
      selfRating.selfRatedLevel !== attempt.finalVerifiedLevel;

    let mismatchMessage: string | undefined;
    if (hasMismatch && selfRating && attempt.finalVerifiedLevel) {
      const selfLevel = selfRating.selfRatedLevel.toLowerCase();
      const verifiedLevel = attempt.finalVerifiedLevel.toLowerCase();
      mismatchMessage = `You rated yourself ${selfLevel} — verified level is ${verifiedLevel}. Keep practicing!`;
    }

    return {
      finalVerifiedLevel: attempt.finalVerifiedLevel,
      status: attempt.status,
      totalQuestions: attempt.answers.length,
      correctAnswers: totalCorrect,
      breakdown,
      selfRatedLevel: selfRating?.selfRatedLevel,
      hasMismatch: hasMismatch || false,
      mismatchMessage,
    };
  }

  // ============================================
  // PRIVATE HELPERS
  // ============================================

  /**
   * Get next unserved question for student at target difficulty.
   * Returns null if all questions for this skill+difficulty have been served.
   */
  private static async getNextQuestion(
    studentProfileId: string,
    skillId: string,
    targetDifficulty: SkillLevel
  ): Promise<Question | null> {
    // Get already served question IDs
    const served = await prisma.servedQuestion.findMany({
      where: { studentProfileId },
      select: { questionId: true },
    });

    const servedIds = served.map(s => s.questionId);

    // Try to find unserved question at target difficulty
    let question = await prisma.question.findFirst({
      where: {
        skillId,
        difficultyLevel: targetDifficulty,
        id: {
          notIn: servedIds,
        },
      },
    });

    // If no question found, we've exhausted all questions for this skill+difficulty
    if (!question) {
      console.log(
        `⚠️  No unserved questions available for skill ${skillId} at ${targetDifficulty} - all questions have been served`
      );
      // Return null - caller will complete test with current performance
      return null;
    }

    // Mark as served
    await prisma.servedQuestion.create({
      data: {
        studentProfileId,
        questionId: question.id,
      },
    });

    return {
      ...question,
      options: question.options as string[],
    };
  }

  /**
   * Adaptive difficulty logic:
   * - Correct answer → increase difficulty one tier (bounded)
   * - Incorrect answer → decrease difficulty one tier (bounded)
   */
  private static getNextDifficulty(
    currentDifficulty: SkillLevel,
    wasCorrect: boolean
  ): SkillLevel {
    const currentIndex = DIFFICULTY_TIERS.indexOf(currentDifficulty);

    if (wasCorrect) {
      // Increase difficulty (max ADVANCED)
      const nextIndex = Math.min(currentIndex + 1, DIFFICULTY_TIERS.length - 1);
      return DIFFICULTY_TIERS[nextIndex];
    } else {
      // Decrease difficulty (min BEGINNER)
      const nextIndex = Math.max(currentIndex - 1, 0);
      return DIFFICULTY_TIERS[nextIndex];
    }
  }

  /**
   * Build test state from existing attempt data.
   */
  private static buildTestState(
    attempt: { id: string; studentProfileId: string; skillId: string; answers: any[] },
    currentDifficulty: SkillLevel
  ): TestState {
    const correctByTier = new Map<SkillLevel, number>();
    const totalByTier = new Map<SkillLevel, number>();
    let highestCorrectTier: SkillLevel | null = null;

    for (const answer of attempt.answers) {
      const tier = answer.question.difficultyLevel;
      totalByTier.set(tier, (totalByTier.get(tier) || 0) + 1);

      if (answer.isCorrect) {
        correctByTier.set(tier, (correctByTier.get(tier) || 0) + 1);

        const tierIndex = DIFFICULTY_TIERS.indexOf(tier);
        const highestIndex = highestCorrectTier
          ? DIFFICULTY_TIERS.indexOf(highestCorrectTier)
          : -1;

        if (tierIndex > highestIndex) {
          highestCorrectTier = tier;
        }
      }
    }

    return {
      attemptId: attempt.id,
      skillId: attempt.skillId,
      studentProfileId: attempt.studentProfileId,
      currentDifficulty,
      questionsAsked: attempt.answers.length,
      correctByTier,
      totalByTier,
      highestCorrectTier,
    };
  }

  /**
   * Determine if test should end based on:
   * 1. Max questions reached (7)
   * 2. Min questions + confidence threshold (5 + stable performance)
   */
  private static shouldEndTest(state: TestState): boolean {
    // Always end at max questions
    if (state.questionsAsked >= MAX_QUESTIONS) {
      return true;
    }

    // After min questions, check confidence
    if (state.questionsAsked >= MIN_QUESTIONS) {
      // If student has achieved confidence threshold at any tier, end early
      for (const [tier, correct] of state.correctByTier.entries()) {
        if (correct >= CONFIDENCE_THRESHOLD) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Finalize test: determine verified level and update student profile.
   * 
   * Pass threshold: Need 2+ correct answers at a tier to verify at that level.
   * Final verified level = highest tier where student passed threshold.
   */
  private static async finalizeTest(
    attemptId: string,
    state: TestState
  ): Promise<TestResult> {
    // Determine final verified level
    let finalVerifiedLevel: SkillLevel | null = null;
    let status: TestStatus = 'FAILED';

    // Check each tier from highest to lowest
    for (let i = DIFFICULTY_TIERS.length - 1; i >= 0; i--) {
      const tier = DIFFICULTY_TIERS[i];
      const correct = state.correctByTier.get(tier) || 0;

      if (correct >= PASS_THRESHOLD) {
        finalVerifiedLevel = tier;
        status = 'PASSED';
        break;
      }
    }

    // Update test attempt
    await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        status,
        finalVerifiedLevel,
        completedAt: new Date(),
      },
    });

    // Update SkillProfileEntry if test passed
    if (status === 'PASSED' && finalVerifiedLevel) {
      const skillProfile = await prisma.skillProfile.findUnique({
        where: { studentProfileId: state.studentProfileId },
      });

      if (skillProfile) {
        await prisma.skillProfileEntry.updateMany({
          where: {
            skillProfileId: skillProfile.id,
            skillId: state.skillId,
          },
          data: {
            verifiedLevel: finalVerifiedLevel,
            isVerified: true,
          },
        });
      }
    }

    // Get full result
    return this.getTestResult(attemptId);
  }
}
