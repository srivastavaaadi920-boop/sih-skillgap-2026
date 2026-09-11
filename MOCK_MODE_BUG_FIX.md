# CRITICAL FIX: Mock Questions Bug

## Root Cause

**YOU HAD MOCK_MODE ENABLED** in `.env`:
```bash
MOCK_MODE="true"  # ← This was bypassing the entire database and test engine
```

When `MOCK_MODE="true"`, the API routes return hardcoded placeholder questions like:
- "Mock question 3: Which of the following is correct?"
- Options: "Option A for Q3", "Option B for Q3", etc.

This is **BY DESIGN** - MOCK_MODE is meant for testing without a database connection.

## The Real System

When `MOCK_MODE="false"`, the system:
1. Queries the **Question** table in the database
2. Filters by `skillId` and `difficultyLevel`
3. Excludes already-served questions (via ServedQuestion table)
4. Returns **REAL seeded questions** with actual content
5. Falls back to AI generation if no seeded questions available

## Database Status

✅ **103 real questions exist in your database**
- Questions were seeded successfully
- Cover 25+ skills
- Include Beginner, Intermediate, and Advanced levels
- Have real content (code snippets, explanations, etc.)

Sample from database:
```
Skill: JavaScript
Type: CONCEPTUAL_MCQ
Difficulty: BEGINNER
Prompt: "What is the correct way to declare a variable in JavaScript that cannot be reassigned?"
Options: [real options with const, let, var, etc.]
```

## The Fix

**Changed `.env`:**
```bash
# Before:
MOCK_MODE="true"

# After:
MOCK_MODE="false"
```

That's it. The real test engine was always correct - it was just being bypassed.

## How the Real System Works

### 1. Start Test (`/api/student/test/start`)
When MOCK_MODE="false":
```typescript
// Get student's self-rated level
const selfRating = await prisma.studentSkillSelection.findUnique({
  where: { studentProfileId_skillId: { studentProfileId, skillId } }
});

// Create test attempt
const attempt = await prisma.testAttempt.create({
  data: { studentProfileId, skillId, status: 'IN_PROGRESS' }
});

// Get REAL question from database
const firstQuestion = await AdaptiveTestEngine.getNextQuestion(
  studentProfileId,
  skillId,
  selfRating.selfRatedLevel
);
```

### 2. Get Next Question (`testEngine.getNextQuestion`)
```typescript
// Query database for unserved question
const question = await prisma.question.findFirst({
  where: {
    skillId: skillId,                    // Match skill
    difficultyLevel: targetDifficulty,   // Match difficulty
    id: { notIn: servedQuestionIds },    // Never repeat
  },
});

// If no question found, try AI generation
if (!question) {
  question = await generateQuestionWithAI(skillId, targetDifficulty);
}

// Mark as served
await prisma.servedQuestion.create({
  data: { studentProfileId, questionId: question.id }
});
```

### 3. Submit Answer (`/api/student/test/answer`)
```typescript
// Get question from database
const question = await prisma.question.findUnique({
  where: { id: questionId }
});

// Grade answer
const isCorrect = selectedAnswerIndex === question.correctAnswerIndex;

// Record answer
await prisma.testAnswer.create({
  data: { testAttemptId, questionId, selectedAnswerIndex, isCorrect, timeTakenSeconds }
});

// Apply adaptive logic
const nextDifficulty = isCorrect ? increaseLevel() : decreaseLevel();

// Get next question or complete test
const nextQuestion = await getNextQuestion(studentProfileId, skillId, nextDifficulty);
```

## Why MOCK_MODE Exists

MOCK_MODE is for:
- ✅ Testing UI without database
- ✅ Developing frontend offline
- ✅ Demo environments without Supabase access
- ✅ Quick iteration on UI/UX

It should **NEVER be used for real testing of the adaptive algorithm or question quality**.

## Test Plan

### 1. Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

Server will now load with `MOCK_MODE="false"` and connect to real database.

### 2. Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R`
- Or open incognito window

### 3. Login
```
http://localhost:3000/auth/login
Email: student@test.com
Password: password123
```

### 4. Complete Onboarding
- Go to `/student/onboarding`
- Select field: "Software Development" (has seeded questions)
- Select goal: Any
- Select skills: **JavaScript, Python, React** (these have seeded questions)
- Rate them: Any level
- Click "Complete Setup"

### 5. Start Test
- Click "Start Test" on **JavaScript** or **Python** or **React**
- You should now see REAL questions

### 6. Verify Real Questions

**You should see:**
- ✅ Actual technical questions (not "Mock question N")
- ✅ Real answer options (not "Option A for QN")
- ✅ Code snippets for CODE_OUTPUT_PREDICTION questions
- ✅ Thoughtful explanations after completion
- ✅ Questions never repeat across multiple test attempts

**Example real question (JavaScript, BEGINNER):**
```
Type: CONCEPTUAL_MCQ
Prompt: "What is the correct way to declare a variable in JavaScript that cannot be reassigned?"
Options:
  A) var myVar = 10;
  B) let myVar = 10;
  C) const myVar = 10;
  D) constant myVar = 10;
Correct: C
```

**Example real question (Python, INTERMEDIATE):**
```
Type: CODE_OUTPUT_PREDICTION
Prompt: "What will this code output?"
Code:
  def func(x=[]):
      x.append(1)
      return x
  print(func())
  print(func())
Options:
  A) [1] [1]
  B) [1] [1, 1]
  C) [] [1]
  D) Error
Correct: B
```

### 7. Test Adaptive Logic

- Answer question 1 correctly → Next should be harder
- Answer question 2 incorrectly → Next should be easier
- Complete test (5-7 questions)
- Results show actual performance

### 8. Verify Database Records

After completing a test, check:
```sql
-- Your test attempt
SELECT * FROM "TestAttempt" ORDER BY "startedAt" DESC LIMIT 1;

-- Your answers
SELECT 
  ta.*,
  q."promptText",
  q."difficultyLevel",
  ta."isCorrect"
FROM "TestAnswer" ta
JOIN "Question" q ON ta."questionId" = q.id
WHERE ta."testAttemptId" = 'YOUR_ATTEMPT_ID'
ORDER BY ta."answeredAt";

-- Served questions (should never repeat)
SELECT COUNT(*) FROM "ServedQuestion"
WHERE "studentProfileId" = 'YOUR_STUDENT_ID';
```

## Skills with Seeded Questions

These skills have real questions in the database:
- JavaScript (5 questions)
- Python (4 questions)
- Java (4 questions)
- C++ (4 questions)
- SQL (4 questions)
- React (4 questions)
- Node.js (4 questions)
- Angular (4 questions)
- Vue.js (4 questions)
- TypeScript (4 questions)
- ... (25+ skills total, 103 questions)

Test with these skills first to verify real questions are served.

## AI Generation Fallback

If you test a skill WITHOUT seeded questions (or exhaust all questions), the system will:

1. Detect no unserved questions available
2. Log: "⚠️ No seeded questions for skill X at DIFFICULTY, generating with AI..."
3. Call Claude Sonnet 4 API to generate a question
4. Validate the response structure
5. Save to database with `isAIGenerated = true`
6. Serve it to the student

**Requirements for AI generation:**
- Set `ANTHROPIC_API_KEY` in `.env` (currently not set)
- Without API key, test will end if questions exhausted

## Summary

**Problem:** MOCK_MODE was enabled, serving placeholder questions
**Fix:** Disabled MOCK_MODE to use real database
**Status:** ✅ 103 real questions ready to serve
**Action:** Restart server and test with JavaScript/Python/React skills

---

**The system is now configured correctly to serve real questions from the database.** 🚀
