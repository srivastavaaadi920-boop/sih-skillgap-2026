# Testing Checklist - Question Bank System

## 🎯 Goal
Verify that the seeded question bank is now the complete source of truth, with NO "No questions available" errors for any offered skill.

---

## ⚙️ Pre-Testing Setup

### 1. Verify Environment
```bash
# Check .env file - MOCK_MODE should be false
type .env | findstr MOCK_MODE
```
Expected: `MOCK_MODE=false`

### 2. Clear Test Student Data (Start Fresh)
```bash
node clear-test-student-data.js
```
Expected output:
- ✅ Found student profile
- 🗑️ Deleted served questions
- 🗑️ Deleted test answers
- 🗑️ Deleted test attempts
- 🗑️ Deleted skill selections
- ♻️ Reset student profile onboarding status
- ✅ Test student data cleared successfully!

### 3. Verify Available Skills (Optional - requires DB connection)
```bash
node verify-available-skills.js
```
Expected: 23 skills with full coverage listed

---

## 📋 TESTING STEPS

### PHASE 1: Onboarding Skill Selection

#### Step 1.1: Login
- Navigate to: `http://localhost:3000/auth/login`
- Email: `student@test.com`
- Password: `password123`
- Click "Login"
- ✅ **VERIFY:** Successfully logged in and redirected

#### Step 1.2: Access Onboarding
- Navigate to: `http://localhost:3000/student/onboarding`
- ✅ **VERIFY:** Onboarding wizard loads with 5 steps

#### Step 1.3: Select Field (Step 1)
- Choose any field (e.g., "Software Development", "Data Science", etc.)
- Click "Next"
- ✅ **VERIFY:** Moves to step 2

#### Step 1.4: Select Goal (Step 2)
- Choose any goal relevant to your field
- Click "Next"
- ✅ **VERIFY:** Moves to step 3

#### Step 1.5: Select Skills (Step 3) - **CRITICAL VERIFICATION**
- ✅ **COUNT SKILLS:** Should show exactly **23 skills** (not 50)
- ✅ **CHECK CATEGORIES:** Should include both Technical and Soft Skills
- ✅ **VERIFY SKILL NAMES:** Should see skills like:
  - Technical: JavaScript, Python, Java, C++, React, Node.js, SQL, Git, etc.
  - Soft Skills: Communication, Teamwork, Problem-solving, Leadership, etc.
- ❌ **SHOULD NOT SEE:** Docker, HTML/CSS, or skills with no questions
- Select **3-4 skills** for testing (recommended: JavaScript, Python, React, SQL)
- Click "Next"
- ✅ **VERIFY:** Moves to step 4

#### Step 1.6: Rate Skills (Step 4)
- Rate each selected skill:
  - Mix it up: Try 1 BEGINNER, 1 INTERMEDIATE, 1 ADVANCED, 1 any level
- Click "Next"
- ✅ **VERIFY:** Moves to step 5 (review)

#### Step 1.7: Review and Submit (Step 5)
- ✅ **VERIFY:** All selections are displayed correctly
- Click "Complete Onboarding"
- ✅ **VERIFY:** Redirected to student dashboard
- ✅ **VERIFY:** Dashboard shows selected field, goal, and skills

---

### PHASE 2: Skill Verification Tests

#### For EACH skill you selected, perform the following:

### Test Execution Template (Repeat for Each Skill)

**Testing Skill: ________________** (e.g., JavaScript)

#### Step 2.1: Navigate to Profile
- Go to: `http://localhost:3000/student/profile`
- ✅ **VERIFY:** Profile shows your selected skills
- ✅ **VERIFY:** Each skill shows self-rated level and verification status

#### Step 2.2: Start Test
- Find the skill you want to test
- Click "Take Test" button
- ✅ **VERIFY:** Test page loads successfully (no errors)
- ✅ **VERIFY:** Timer starts counting down
- ✅ **VERIFY:** First question displays

#### Step 2.3: Verify Question Content - **CRITICAL**
For EVERY question in the test:

**Question #1:**
- ✅ **READ THE QUESTION:** Does it make sense? Is it real content?
- ❌ **SHOULD NOT SAY:** "Mock question 1" or "Mock question N"
- ✅ **CHECK OPTIONS:** Are they real answer choices?
- ❌ **SHOULD NOT SAY:** "Option A for Q1" or similar placeholder text
- ✅ **CHECK DIFFICULTY BADGE:** Shows BEGINNER/INTERMEDIATE/ADVANCED
- ✅ **CHECK TIMER:** Counting down (60s for MCQ, 90s for code questions)
- If code snippet shown:
  - ✅ **VERIFY:** Code is syntactically correct and relevant
  - ✅ **VERIFY:** Syntax highlighting works
- Record actual question text here: _________________________________

**Question #2-7:** (Repeat same checks for each question)
- ✅ Real content (not mock)
- ✅ Real options (not placeholder)
- ✅ Timer working
- ✅ Difficulty may change based on your answers (adaptive)

#### Step 2.4: Complete Test
- Answer all questions (5-7 total)
- ✅ **VERIFY:** Test completes after 5-7 questions
- ✅ **VERIFY:** Results screen displays
- ✅ **NO ERRORS** at any point

#### Step 2.5: Review Results
- ✅ **VERIFY:** "Test Complete!" message
- ✅ **VERIFY:** Shows verified level (or message about practicing)
- ✅ **VERIFY:** Shows total questions and correct answers
- ✅ **VERIFY:** Shows breakdown by tier (Beginner/Intermediate/Advanced)
- ✅ **VERIFY:** Each tier shows correct/total count
- If mismatch between self-rated and verified:
  - ✅ **VERIFY:** Shows warning message explaining the difference

#### Step 2.6: Verify Profile Update
- Click "View Profile" button
- ✅ **VERIFY:** Profile updated with verified level (if passed)
- ✅ **VERIFY:** Verified checkmark appears for this skill

---

### PHASE 3: Test Additional Skills

Repeat all steps in Phase 2 for your remaining 2-3 selected skills.

**Skill #2:** ________________
- ✅ All questions are real content
- ✅ Test completes successfully
- ✅ No errors

**Skill #3:** ________________
- ✅ All questions are real content
- ✅ Test completes successfully
- ✅ No errors

**Skill #4:** ________________ (if selected)
- ✅ All questions are real content
- ✅ Test completes successfully
- ✅ No errors

---

### PHASE 4: Edge Case - Question Exhaustion

**Purpose:** Verify system handles running out of questions gracefully.

#### Step 4.1: Retake Same Test
- Go back to profile
- Click "Take Test" again for a skill you already tested
- ✅ **VERIFY:** Test starts with different questions (not repeated)

#### Step 4.2: Exhaust Questions (Optional - Time Consuming)
- Keep retaking the same test 2-3 more times
- Eventually you should exhaust all 4 questions for that skill
- ✅ **VERIFY:** When questions run out, test completes gracefully
- ✅ **VERIFY:** Shows message like "You've completed all available questions for this skill! Check back soon for more."
- ❌ **SHOULD NOT SHOW:** "No questions available" error
- ❌ **SHOULD NOT CRASH:** Test should complete with results based on questions answered

---

## 📊 TEST RESULTS SUMMARY

### Overall Results
- **Total Skills Selected:** _____ (should be 3-4)
- **Total Tests Completed:** _____ (should match skills selected)
- **Total Questions Seen:** _____ (should be 15-28 for 3-4 skills)
- **Errors Encountered:** _____ (should be 0 ✅)

### Skills Offered in Onboarding
- **Count:** _____ (should be 23)
- **Previously Problematic Skills Removed?** _____ (Yes/No)

### Question Quality
- **All questions real content?** _____ (Yes/No)
- **Any mock/placeholder text seen?** _____ (Yes/No - should be No)
- **Code snippets display correctly?** _____ (Yes/No - if applicable)

### System Behavior
- **Tests complete successfully?** _____ (Yes/No)
- **Timers work correctly?** _____ (Yes/No)
- **Difficulty adapts based on answers?** _____ (Yes/No)
- **Results screen accurate?** _____ (Yes/No)
- **Profile updates after tests?** _____ (Yes/No)

---

## ✅ SUCCESS CRITERIA

ALL of the following must be true:

- ✅ Only 23 skills shown in onboarding (not 50)
- ✅ All selected skills have working tests
- ✅ ZERO "No questions available" errors
- ✅ ALL questions show real content (no mock data)
- ✅ Code snippets are real and syntactically correct
- ✅ Tests complete after 5-7 questions
- ✅ Results display correctly with accurate breakdowns
- ✅ Profile updates with verified levels
- ✅ Question exhaustion handled gracefully (if tested)

---

## 🐛 IF ERRORS OCCUR

### Error: "No questions available for this skill"
**This should NOT happen!** If it does:
1. Note which skill caused the error
2. Check if that skill should have been filtered out
3. Run: `node audit-question-coverage.js`
4. Check: `/app/api/student/assessment/skills/route.ts` filter logic

### Error: "Failed to start test"
1. Check browser console for error details
2. Check if student completed onboarding
3. Check database connection
4. Try: `node clear-test-student-data.js` and redo onboarding

### Mock/Placeholder Questions Appearing
**This should NOT happen!** If it does:
1. Check `.env` - should be `MOCK_MODE=false`
2. Check browser console for "MOCK MODE" logs
3. Check API responses in Network tab
4. Restart dev server: `npm run dev`

### Questions Repeating Immediately
1. Check ServedQuestion table is being populated
2. Check database connection is stable
3. May indicate caching issue - try hard refresh (Ctrl+Shift+R)

---

## 📸 SCREENSHOTS TO CAPTURE (Optional)

1. Onboarding Step 3 showing 23 skills
2. A real question with code snippet
3. Test results screen showing breakdown
4. Profile page with verified skills
5. Any errors encountered (if any)

---

## 🎉 COMPLETION

When all tests pass:
1. Mark this checklist as complete
2. Document any issues found in a new file
3. System is ready for demo/presentation

**Tester:** ________________
**Date:** ________________
**Result:** PASS / FAIL
**Notes:** ________________________________________________

---

*This checklist ensures the question bank system works end-to-end with real seeded questions as the complete source of truth.*
