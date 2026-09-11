'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
type QuestionType =
  | 'CONCEPTUAL_MCQ'
  | 'CODE_OUTPUT_PREDICTION'
  | 'DEBUG_SNIPPET'
  | 'FILL_IN_BLANK_CODE'
  | 'SCENARIO_MCQ'
  | 'SITUATIONAL_JUDGMENT';

interface Question {
  id: string;
  type: QuestionType;
  difficultyLevel: SkillLevel;
  promptText: string;
  codeSnippet: string | null;
  options: string[];
  timeLimitSeconds: number;
  skillId: string;
}

interface TestResult {
  finalVerifiedLevel: SkillLevel | null;
  status: 'PASSED' | 'FAILED';
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

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Start test
  useEffect(() => {
    const startTest = async () => {
      try {
        console.log('Starting test for skillId:', skillId);
        const res = await fetch('/api/student/test/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skillId }),
        });

        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Response data:', data);

        if (!res.ok) {
          throw new Error(data.error || 'Failed to start test');
        }

        setAttemptId(data.attemptId);
        setCurrentQuestion(data.firstQuestion);
        setTimeRemaining(data.firstQuestion.timeLimitSeconds);
        setLoading(false);
      } catch (err) {
        console.error('Test start error:', err);
        setError(err instanceof Error ? err.message : 'Failed to start test');
        setLoading(false);
      }
    };

    startTest();
  }, [skillId]);

  // Timer countdown
  useEffect(() => {
    if (!currentQuestion || testComplete || timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time expired - auto-submit with no answer
          handleSubmit(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, testComplete, timeRemaining]);

  const handleSubmit = useCallback(
    async (answerIndex: number) => {
      if (!attemptId || !currentQuestion || submitting) {
        return;
      }

      setSubmitting(true);

      try {
        const timeTaken = currentQuestion.timeLimitSeconds - timeRemaining;

        const res = await fetch('/api/student/test/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attemptId,
            questionId: currentQuestion.id,
            selectedAnswerIndex: answerIndex,
            timeTakenSeconds: timeTaken,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to submit answer');
        }

        const data = await res.json();

        if (data.testComplete) {
          setTestComplete(true);
          setTestResult(data.testResult);
        } else {
          setCurrentQuestion(data.question);
          setQuestionNumber((prev) => prev + 1);
          setTimeRemaining(data.question.timeLimitSeconds);
          setSelectedAnswer(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit answer');
      } finally {
        setSubmitting(false);
      }
    },
    [attemptId, currentQuestion, timeRemaining, submitting]
  );

  const getTimerColor = () => {
    if (timeRemaining > 30) return 'text-success';
    if (timeRemaining > 10) return 'text-warning';
    return 'text-error';
  };

  const getDifficultyColor = (level: SkillLevel): 'success' | 'warning' | 'default' => {
    switch (level) {
      case 'BEGINNER':
        return 'success';
      case 'INTERMEDIATE':
        return 'warning';
      case 'ADVANCED':
        return 'default'; // Changed from 'error' to 'default'
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-muted">Loading test...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-error mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-bold text-error mb-4">Failed to Start Test</h2>
              <p className="text-muted mb-2">Error details:</p>
              <p className="text-error mb-6 font-mono text-sm bg-error-light p-4 rounded">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push('/student/onboarding')}>
                  Back to Onboarding
                </Button>
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (testComplete && testResult) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center">
              <div
                className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  testResult.status === 'PASSED'
                    ? 'bg-success-light'
                    : 'bg-error-light'
                }`}
              >
                {testResult.status === 'PASSED' ? (
                  <svg
                    className="w-10 h-10 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-10 h-10 text-error"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <h2 className="font-heading text-section text-primary mb-2">
                Test Complete!
              </h2>

              {testResult.finalVerifiedLevel ? (
                <div className="mb-6">
                  <Badge variant={getDifficultyColor(testResult.finalVerifiedLevel)}>
                    Verified Level: {testResult.finalVerifiedLevel}
                  </Badge>
                </div>
              ) : (
                <p className="text-muted mb-6">
                  {testResult.totalQuestions < 5 
                    ? "You've completed all available questions for this skill! Check back soon for more."
                    : "Keep practicing to reach verified status"}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
                <div className="bg-surface p-4 rounded-lg">
                  <p className="text-sm text-muted mb-1">Total Questions</p>
                  <p className="text-2xl font-bold text-primary">
                    {testResult.totalQuestions}
                  </p>
                </div>
                <div className="bg-surface p-4 rounded-lg">
                  <p className="text-sm text-muted mb-1">Correct Answers</p>
                  <p className="text-2xl font-bold text-success">
                    {testResult.correctAnswers}
                  </p>
                </div>
              </div>

              {/* Breakdown by tier */}
              <div className="bg-surface p-6 rounded-lg mb-6 text-left">
                <h3 className="font-semibold text-primary-dark mb-4">
                  Performance Breakdown
                </h3>
                {testResult.breakdown.map((tier) => (
                  <div key={tier.tier} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-center mb-1">
                      <Badge variant={getDifficultyColor(tier.tier)}>
                        {tier.tier}
                      </Badge>
                      <span className="text-sm text-primary">
                        {tier.correct}/{tier.total} correct
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{
                          width: `${tier.total > 0 ? (tier.correct / tier.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mismatch warning */}
              {testResult.hasMismatch && testResult.mismatchMessage && (
                <div className="bg-warning/10 border-2 border-warning/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primary-dark">
                    ⚠️ {testResult.mismatchMessage}
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/student/profile')}
                >
                  View Profile
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push('/student/opportunities')}
                >
                  Browse Opportunities
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-border">
            <div>
              <p className="text-sm text-muted mb-1">Question {questionNumber}</p>
              <Badge variant={getDifficultyColor(currentQuestion.difficultyLevel)}>
                {currentQuestion.difficultyLevel}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted mb-1">Time Remaining</p>
              <p className={`text-2xl font-bold ${getTimerColor()}`}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="font-heading text-section text-primary mb-4">
              {currentQuestion.promptText}
            </h2>

            {currentQuestion.codeSnippet && (
              <pre className="bg-primary-dark text-white p-4 rounded-lg mb-4 overflow-x-auto">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-accent bg-accent-light text-primary-dark'
                    : 'border-border bg-surface hover:border-accent/50 text-primary-dark'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-accent bg-accent'
                        : 'border-border'
                    }`}
                  >
                    {selectedAnswer === index && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Submit */}
          <Button
            variant="primary"
            className="w-full"
            onClick={() => selectedAnswer !== null && handleSubmit(selectedAnswer)}
            disabled={selectedAnswer === null || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Answer'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
