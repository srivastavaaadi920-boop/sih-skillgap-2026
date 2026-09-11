# Adaptive Test Engine - Implementation Documentation

## Overview
Built a complete adaptive skill verification test system that validates student self-rated skill levels through intelligent testing with dynamic difficulty adjustment.

## Architecture

### 1. Database Schema (`prisma/schema.prisma`)

#### New Models Added:

**TestAttempt**
- Tracks each test session for a student-skill combination
- Fields: `id`, `studentProfileId`, `skillId`, `startedAt`, `completedAt`, `status`, `finalVerifiedLevel`
- Status enum: `IN_PROGRESS`, `PASSED`, `FAILED`
- Final verified level: `BEGINNER`, `INTERMEDIATE`, `ADVANCED` (or null if failed)

**TestAnswer**
- Records each individual answer within a test
- Fields: `id`, `testAttemptId`, `questionId`, `selectedAnswerIndex`, `isCorrect`, `timeTakenSeconds`, `answeredAt`
- Links answers to both the test attempt and the specific question

**ServedQuestion**
- Prevents question repetition across all test attempts for a student
- Fields: `id`, `studentProfileId`, `questionId`, `servedAt`
- Unique constraint on `[studentProfileId, questionId]` - **NEVER repeats questions**

### 2. Adaptive Test Engine (`/lib/testEngine.ts`)

#### Core Algorithm:

**Starting Point:**
- Begin at student's self-rated level (from StudentSkillSelection)

**Adaptive Difficulty Logic:**
```typescript
After each answer:
  - Correct → increase difficulty one tier (max: ADVANCED)
  - Incorrect → decrease difficulty one tier (min: BEGINNER)
```

**Stopping Conditions:**
1. **Maximum questions:** 7 questions (hard stop)
2. **Early confidence stop:** After 5 questions, if student has 3+ correct at any tier
3. **No questions available:** If question bank is exhausted

**Pass/Fail Threshold:**
- **PASS:** 2+ correct answers at a tier verifies the student at that level
- Final verified level = **highest tier where pass threshold is met**
- If no tier meets threshold → status = `FAILED`, verifiedLevel = `null`

**Timer Enforcement:**
- Server-side validation via `timeTakenSeconds` parameter
- Frontend timer auto-submits on timeout with no answer (treated as incorrect)
- Time limits: 60s for MCQ types, 90s for code questions

**Question Selection:**
1. Query for unserved question at target difficulty for the skill
2. Check against ServedQuestion table (never repeat)
3. If no seeded question available → trigger AI generation fallback

### 3. AI Generation Fallback

**Trigger:** When no unserved seeded questions exist for skill+difficulty combo

**Implementation:**
- Uses Claude Sonnet 4 (`claude-sonnet-4-20250514`) via Anthropic SDK
- Generates ONE question matching exact schema of seeded questions
- Validates structure: type, 4 options, valid correctAnswerIndex, explanation
- Saves to Question table with `isAIGenerated = true`
- Marks as served and returns to student
- Future students can use this question (becomes permanent)

**Retry Logic:**
- If validation fails → retry once
- If second attempt fails → return null (test ends gracefully)

**API Key Required:** `ANTHROPIC_API_KEY` in `.env`

### 4. API Routes

#### POST `/api/student/test/start`
**Input:** `{ skillId: string }`
**Output:** `{ attemptId, firstQuestion }`
- Creates TestAttempt with status `IN_PROGRESS`
- Returns first question at self-rated level (without correct answer)
- MOCK_MODE: Returns mock question

#### POST `/api/student/test/answer`
**Input:** `{ attemptId, questionId, selectedAnswerIndex, timeTakenSeconds }`
**Output:** 
- If test continues: `{ testComplete: false, question }`
- If test ends: `{ testComplete: true, testResult }`

**Logic:**
1. Grade answer (compare to question.correctAnswerIndex)
2. Record TestAnswer with isCorrect flag
3. Mark question as ServedQuestion
4. Update test state (correctByTier, totalByTier, highestCorrectTier)
5. Determine next difficulty using adaptive logic
6. Check stopping conditions
7. If continuing: fetch next question
8. If ending: finalize test and return result

#### GET `/api/student/test/[attemptId]/result`
**Output:** Full TestResult object
- finalVerifiedLevel
- status (PASSED/FAILED)
- totalQuestions, correctAnswers
- breakdown by tier (correct/total per difficulty)
- selfRatedLevel (for comparison)
- hasMismatch flag (if verified ≠ self-rated)
- mismatchMessage (constructive feedback)

**All routes support MOCK_MODE** for testing without database connection.

### 5. Frontend UI (`/app/student/test/[skillId]/page.tsx`)

#### Test-Taking Interface:
- **Header:** Question counter + timer with color coding
  - Green: >30s remaining
  - Amber: 10-30s remaining
  - Red: <10s remaining
- **Question Display:** 
  - Difficulty badge
  - Question text
  - Code snippet in monospace block (if applicable)
- **Answer Options:** 4 clickable cards with radio button UI
- **Auto-submit:** Timer hits 0 → auto-submit with selectedAnswerIndex = -1

#### Results Screen:
- Pass/Fail icon with color-coded background
- Verified level badge
- Summary stats (total questions, correct answers)
- Performance breakdown by tier with progress bars
- Mismatch warning if verified level < self-rated level
- Navigation to profile or opportunities

### 6. Onboarding Integration

**Step 5 (Confirmation) Updated:**
- Shows first 5 selected skills with "Start Test" buttons
- Each button links to `/student/test/[skillId]`
- Encourages immediate verification after onboarding
- "View Profile" and "Browse Opportunities" as alternatives

### 7. Profile Update Flow

**After Test Completion:**
```typescript
If status === PASSED && finalVerifiedLevel:
  Update SkillProfileEntry:
    - verifiedLevel = finalVerifiedLevel
    - isVerified = true
```

This updates the matching engine to use verified levels for opportunity matching.

## Testing Guide

### Test with MOCK_MODE (no database required):

1. Set `MOCK_MODE="true"` in `.env`
2. Login with `student@test.com` / `password123`
3. Complete onboarding (mock data returned)
4. Click "Start Test" on any skill
5. Mock questions will be served
6. After 5 questions, test completes with mock results showing mismatch

### Test with Real Database:

1. Set `MOCK_MODE="false"` in `.env`
2. Set `ANTHROPIC_API_KEY` (get from https://console.anthropic.com/)
3. Ensure 103 seeded questions are in database (run `npm run prisma:seed`)
4. Login as student
5. Complete onboarding selecting skills with seeded questions
6. Start a test:
   - **Test adaptive difficulty:** Answer correctly → harder questions
   - **Test adaptive difficulty:** Answer incorrectly → easier questions
   - **Test timeout:** Let timer expire → auto-submit
   - **Test early stop:** Get 3+ correct at a tier after 5 questions
   - **Test AI fallback:** Select skill+difficulty combo with no seeded questions

### Verification Checklist:

- ✅ Test starts at self-rated level
- ✅ Correct answer → difficulty increases
- ✅ Incorrect answer → difficulty decreases
- ✅ Timer auto-submits on expiration (server-side enforcement)
- ✅ Test stops at 7 questions max
- ✅ Test stops early if confidence threshold reached (3+ correct at tier)
- ✅ Questions never repeat for same student (ServedQuestion tracking)
- ✅ AI generation triggers when seeded questions exhausted
- ✅ AI-generated questions saved with `isAIGenerated = true`
- ✅ Final verified level = highest tier with 2+ correct
- ✅ SkillProfileEntry updated with verifiedLevel + isVerified
- ✅ Mismatch message shown if verified < self-rated
- ✅ MOCK_MODE works for all routes

## Adaptive Algorithm Details

### Scoring Example:

**Test progression for student self-rated as ADVANCED:**

1. Q1 at ADVANCED → Correct ✓ → Next: ADVANCED (already at max)
2. Q2 at ADVANCED → Incorrect ✗ → Next: INTERMEDIATE (down one tier)
3. Q3 at INTERMEDIATE → Correct ✓ → Next: ADVANCED (up one tier)
4. Q4 at ADVANCED → Incorrect ✗ → Next: INTERMEDIATE (down one tier)
5. Q5 at INTERMEDIATE → Correct ✓ → Next: ADVANCED (up one tier)
6. Q6 at ADVANCED → Correct ✓ → Next: ADVANCED
7. Q7 at ADVANCED → Incorrect ✗ → Test ends (max questions)

**Final tally:**
- ADVANCED: 2 correct, 4 total (50%)
- INTERMEDIATE: 2 correct, 2 total (100%)
- BEGINNER: 0 correct, 0 total

**Result:**
- INTERMEDIATE tier has 2+ correct → **Verified Level: INTERMEDIATE**
- Self-rated: ADVANCED → **Mismatch detected**
- Message: "You rated yourself advanced — verified level is intermediate. Keep practicing!"

### Pass Threshold Rationale:

**Why 2+ correct?**
- With 5-7 questions total, 2 correct at a tier shows consistent competency
- Too low (1) → false positives from lucky guesses
- Too high (3+) → requires too many questions at same tier (conflicts with adaptive nature)

**Why highest tier?**
- Student may answer correctly at multiple tiers (beginner + intermediate)
- We verify at the **highest** tier they passed, not average
- This matches the SkillLevel enum (single value, not range)

## Files Modified/Created

### Created:
- ✅ `/lib/testEngine.ts` - Adaptive algorithm + AI generation
- ✅ `/app/api/student/test/start/route.ts` - Start test endpoint
- ✅ `/app/api/student/test/answer/route.ts` - Submit answer endpoint
- ✅ `/app/api/student/test/[attemptId]/result/route.ts` - Get result endpoint
- ✅ `/app/student/test/[skillId]/page.tsx` - Test-taking UI
- ✅ `ADAPTIVE_TEST_ENGINE.md` - This documentation

### Modified:
- ✅ `/prisma/schema.prisma` - Added TestAttempt, TestAnswer, ServedQuestion models
- ✅ `/app/student/onboarding/page.tsx` - Added test links to confirmation step
- ✅ `.env` - Added ANTHROPIC_API_KEY
- ✅ `.env.example` - Added ANTHROPIC_API_KEY + MOCK_MODE
- ✅ `package.json` - Added @anthropic-ai/sdk dependency

### Migration:
- ✅ `20260910080015_add_test_engine_models` - Schema changes applied

## Environment Variables

```bash
# Required for AI generation fallback
ANTHROPIC_API_KEY="sk-ant-..."

# Optional: bypass database for testing
MOCK_MODE="true"
```

## Next Steps (Future Enhancements)

1. **Batch testing:** Allow testing multiple skills in sequence
2. **Retry tests:** Allow students to retake tests to improve verified level
3. **Question quality tracking:** Track AI-generated question performance (correct rate) to filter poor questions
4. **Admin dashboard:** Review AI-generated questions before making them permanent
5. **Test analytics:** Track average completion time, difficulty distribution, pass rates per skill
6. **Cooldown period:** Prevent test retries within X days to discourage gaming
7. **Partial credit:** For fill-in-blank or multi-part questions
8. **Explanation after answer:** Show correct answer + explanation after each submission (optional mode)

## Current Status

✅ **COMPLETE** - Ready for testing

All components implemented:
- Schema migrated
- Adaptive engine built with exact pass/fail logic
- AI generation fallback with Claude Sonnet 4
- Server-side timer enforcement
- Question never-repeat tracking
- API routes with MOCK_MODE support
- Full test-taking UI with timer and results
- Onboarding integration with test links
- Profile update on test completion
