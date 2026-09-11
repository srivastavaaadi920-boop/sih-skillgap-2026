# 💾 LocalStorage Mock Mode - Real Selections

## Problem Solved

**Issue:** Profile page was showing hardcoded demo data instead of what student selected during onboarding.

**Root Cause:** Mock mode meant onboarding data wasn't saved to database.

**Solution:** Use browser localStorage to store onboarding selections temporarily during mock mode.

---

## How It Works Now

### Step 1: Student Completes Onboarding
```
Domain: AYUSH
Field: Yoga Therapy & Instruction
Goal: Yoga Therapist
Skills: Asana Sequencing (ADVANCED), Pranayama (INTERMEDIATE), etc.
```

### Step 2: Data Saved to LocalStorage
```javascript
localStorage.setItem('mockOnboardingData', JSON.stringify({
  domain: 'AYUSH',
  fieldName: 'Yoga Therapy & Instruction',
  goalTitle: 'Yoga Therapist',
  skills: [
    { skillName: 'Asana Sequencing', level: 'ADVANCED', category: 'TECHNICAL' },
    { skillName: 'Pranayama Techniques', level: 'INTERMEDIATE', category: 'TECHNICAL' },
    // ... exactly what they selected
  ]
}));
```

### Step 3: Profile Page Reads from LocalStorage
```javascript
const mockData = JSON.parse(localStorage.getItem('mockOnboardingData'));
// Display exactly what student selected!
```

---

## Test It Now

### Step 1: Complete Onboarding
1. Login: `student@test.com` / `password123`
2. Go to `/student/onboarding`
3. Select **YOUR OWN** choices:
   - Domain: AYUSH or TECHNOLOGY
   - Field: ANY field you want
   - Goal: ANY goal you want
   - Skills: ANY skills you want + rate them

### Step 2: Check Profile
1. Go to `/student/profile`
2. You should see:
   - **YOUR domain** (not hardcoded AYUSH)
   - **YOUR field** (not hardcoded Homoeopathy)
   - **YOUR goal** (not hardcoded Homoeopathic Physician)
   - **YOUR skills** (exactly what you selected)
   - **YOUR levels** (exactly what you rated)

### Step 3: Verify It's Real
1. Open browser DevTools → Console
2. Type: `JSON.parse(localStorage.getItem('mockOnboardingData'))`
3. See your actual selections!

---

## Different Students, Different Data

### Test Case A:
```
Student: student@test.com
Selections:
  - AYUSH → Yoga Therapy → Yoga Therapist
  - Skills: Asana Sequencing, Pranayama, Meditation
```

### Test Case B:
Clear localStorage and re-do onboarding:
```
Student: student@test.com (same account)
New Selections:
  - AYUSH → Homoeopathy Practice → Classical Homoeopath
  - Skills: Repertorization, Materia Medica, Miasmatic Analysis
```

**Result:** Profile updates to show Classical Homoeopath with different skills!

---

## Skill Gap Analysis

**Current Status:** Skill gap shows empty/demo data because GoalSkill table not seeded yet.

**When GoalSkill is seeded:**
1. Run: `npx tsx add-goalskill-table.ts`
2. Run: `npx tsx prisma/seed-goal-skills.ts`
3. Profile will calculate real gap based on your localStorage selections

**Example:**
```
Your selection: Yoga Therapist with 4 skills
Goal requires: 6 skills (from GoalSkill seed)

Gap Analysis:
  ✅ On Track: 2 skills (you meet requirements)
  📈 Needs Improvement: 2 skills (you have them but below level)
  📚 Missing: 2 skills (you don't have them)
```

---

## What's Stored in LocalStorage

```json
{
  "domain": "AYUSH",
  "fieldId": "mock-field-yoga",
  "fieldName": "Yoga Therapy & Instruction",
  "goalId": "mock-goal-therapist",
  "goalTitle": "Yoga Therapist",
  "skills": [
    {
      "skillId": "mock-skill-1",
      "skillName": "Asana Sequencing",
      "category": "TECHNICAL",
      "selfRatedLevel": "ADVANCED"
    },
    {
      "skillId": "mock-skill-2",
      "skillName": "Pranayama Techniques",
      "category": "TECHNICAL",
      "selfRatedLevel": "INTERMEDIATE"
    },
    {
      "skillId": "mock-skill-3",
      "skillName": "Motivational Coaching",
      "category": "SOFT",
      "selfRatedLevel": "INTERMEDIATE"
    }
  ]
}
```

---

## Switching to Real Database

When you're ready to use real data:

### Step 1: Seed Database
```bash
npx tsx prisma/seed-ayush-domain.ts
npx tsx add-goalskill-table.ts
npx tsx prisma/seed-goal-skills.ts
```

### Step 2: Disable Mock Mode
```
MOCK_MODE="false"
```

### Step 3: Register Real Account
1. Clear localStorage: `localStorage.clear()`
2. Register new account
3. Complete onboarding
4. Data saved to real database

### Step 4: Profile Shows Real Data
- Reads from database (not localStorage)
- Skill gap calculated from real GoalSkill requirements
- Different students see different data (from their DB records)

---

## Files Updated

**APIs:**
- ✅ `app/api/student/onboarding/status/route.ts` - Detects mock users
- ✅ `app/api/student/profile/data/route.ts` - Returns mock flag if needed
- ✅ `app/api/student/profile/skill-gap/route.ts` - Handles mock users

**Frontend:**
- ✅ `app/student/onboarding/page.tsx` - Saves to localStorage on submit
- ✅ `app/student/profile/page.tsx` - Reads from localStorage for mock users

---

## Verification Checklist

### ✅ After Onboarding:
- [ ] Check DevTools Console: "💾 Saved onboarding data to localStorage"
- [ ] Check localStorage: Contains your selections
- [ ] Profile page loads

### ✅ Profile Page Shows:
- [ ] YOUR domain (not hardcoded)
- [ ] YOUR field (not hardcoded)
- [ ] YOUR goal (not hardcoded)
- [ ] YOUR skills (exactly what you selected)
- [ ] Correct skill count
- [ ] Correct levels (BEGINNER/INTERMEDIATE/ADVANCED as you rated)

### ✅ Different Selections:
- [ ] Clear localStorage
- [ ] Redo onboarding with different choices
- [ ] Profile updates to show new selections

---

## Debug Commands

### View Stored Data:
```javascript
// In browser console
JSON.parse(localStorage.getItem('mockOnboardingData'))
```

### Clear and Start Over:
```javascript
// In browser console
localStorage.clear()
// Then redo onboarding
```

### Check If Data Exists:
```javascript
// In browser console
!!localStorage.getItem('mockOnboardingData')
// true = data exists, false = no data
```

---

## Summary

**Now:**
- ✅ Onboarding saves YOUR selections to localStorage
- ✅ Profile reads YOUR selections from localStorage
- ✅ No hardcoded demo data
- ✅ Different selections = different profile data

**Later (with real DB):**
- ✅ Onboarding saves to database
- ✅ Profile reads from database
- ✅ Skill gap uses real GoalSkill requirements
- ✅ Everything persists across sessions/devices

---

**Try it now:** Complete onboarding with YOUR choices and see YOUR data in the profile! 🎉
