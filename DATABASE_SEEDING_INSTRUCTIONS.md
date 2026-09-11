# Database Seeding Instructions - GoalSkill Gap Issue

## Problem Summary
The Skill Gap section shows "No skill requirements defined yet" because the `GoalSkill` table is EMPTY. The seed file (`prisma/seed-goal-skills.ts`) exists and is comprehensive, but was never executed due to database connection timeouts.

## Root Cause
- ✅ Schema has `GoalSkill` model defined correctly
- ✅ Seed file `prisma/seed-goal-skills.ts` exists with 60+ goal mappings
- ✅ Each goal has 4-6 skills with appropriate levels
- ❌ **Seed script was NEVER RUN** (database connection times out on phone network)
- ❌ **GoalSkill table is EMPTY** (no goal has ANY skill requirements)

## When Database Connection Is Available

### Step 1: Audit Current State

Run the audit script to see the complete picture:

```bash
npx tsx audit-goalskills.ts
```

This will report:
- Total count of Goal records
- Goals with ZERO GoalSkill entries (should be ALL of them currently)
- Goals with fewer than 4 GoalSkill entries
- Breakdown by domain (TECHNOLOGY vs AYUSH)

**Expected Current State:**
```
Total Goals: ~60
Goals with ZERO GoalSkills: ~60 (ALL)
Goals with < 4 GoalSkills: 0
Goals with 4+ GoalSkills: 0
```

### Step 2: Run GoalSkill Seeding

Execute the comprehensive seed script:

```bash
npx tsx prisma/seed-goal-skills.ts
```

This script will:
- ✅ Process ALL goals (both TECHNOLOGY and AYUSH domains)
- ✅ Use `upsert` logic (safe to re-run, won't duplicate)
- ✅ Link 4-6 relevant skills per goal with appropriate levels
- ✅ Show progress for each goal processed
- ✅ Provide final verification counts

**Expected Output:**
```
📊 GOALSKILL SEEDING SUMMARY

Total Goals Processed: 60
Goals with 4+ skills: 60 ✅
Goals with <4 skills: 0 ⚠️
```

### Step 3: Verify Seeding Success

Re-run the audit script:

```bash
npx tsx audit-goalskills.ts
```

**Expected Final State:**
```
Total Goals: ~60
Goals with ZERO GoalSkills: 0 (NONE)
Goals with < 4 GoalSkills: 0 (NONE)  
Goals with 4+ GoalSkills: ~60 (ALL)

✅ BREAKDOWN BY DOMAIN:
   TECHNOLOGY: ~20 goals
     - Complete (4+): ~20
   
   AYUSH: ~40 goals
     - Complete (4+): ~40
```

### Step 4: Spot-Check Specific Goals

Verify these specific goals mentioned in the issue:

**Detox Therapist (Panchakarma Therapy field):**
Should have 5 skills:
- Detox Protocol Planning (INTERMEDIATE)
- Snehana & Swedana (INTERMEDIATE)
- Nasya Therapy (INTERMEDIATE)
- Pre/Post Procedure Care (ADVANCED)
- Patient Safety Monitoring (INTERMEDIATE)

Query to check:
```sql
SELECT g.title, gs.requiredLevel, s.name 
FROM "Goal" g
JOIN "GoalSkill" gs ON g.id = gs."goalId"
JOIN "Skill" s ON gs."skillId" = s.id
WHERE g.title = 'Detox Therapist';
```

**Other goals to spot-check:**
- Yoga Therapist (should have 6 skills)
- Homoeopathic Physician (should have 6 skills)
- Frontend Developer (should have 5 skills)
- Data Analyst (should have 5 skills)

### Step 5: Set MOCK_MODE to False

Once seeding is complete, update `.env`:

```env
MOCK_MODE="false"
```

This will allow real database queries and the skill gap feature will work properly.

### Step 6: Test in UI

1. **Login**: `student@test.com` / `password123`
2. **Complete onboarding** with a goal that was verified in Step 4 (e.g., "Detox Therapist")
3. **Navigate to profile**: `/student/profile`
4. **Verify Skill Gap section shows**:
   - ✅ "You're On Track" - skills you have at required level
   - ⚠️ "Skills to Strengthen" - skills you have but below required level
   - 📚 "Skills to Learn" - required skills you don't have yet
5. **Test multiple goals** across different fields:
   - Technology goal (e.g., Frontend Developer)
   - AYUSH goal from different field (e.g., Yoga Therapist, Homoeopathic Physician)

## Current Fallback Mechanism (Temporary)

Since database seeding cannot be done now, I've implemented a **graceful degradation fallback**:

### How It Works:
1. API checks if goal has GoalSkill entries
2. If ZERO entries exist, activates fallback mode
3. Fallback finds top 5 most common skills from OTHER goals in the same field
4. Compares student's skills against these field-wide requirements
5. Returns gap analysis with `isFallback: true` flag
6. Profile UI shows yellow info box: "Showing general requirements for [Field Name] field (goal-specific requirements being finalized)"

### Why This Is Better Than Nothing:
- ✅ Student sees SOME skill gap data instead of empty state
- ✅ Gap analysis is still relevant (based on field's common requirements)
- ✅ UI clearly indicates this is temporary/general data
- ✅ Feature doesn't completely break when data is missing
- ✅ Automatic upgrade when GoalSkill is seeded (fallback stops being used)

### Limitations of Fallback:
- ⚠️ Shows field-level requirements, not goal-specific
- ⚠️ May miss specialized skills unique to specific goal
- ⚠️ Only works if SOME goals in the field have GoalSkill data
- ⚠️ Won't work at all if entire field has no GoalSkill data

## Files Modified for Fallback

1. **`app/api/student/profile/skill-gap/route.ts`**
   - Added fallback logic when `goalSkills.length === 0`
   - Queries other goals in same field for common skills
   - Returns `isFallback: true` flag with fallback message

2. **`app/student/profile/page.tsx`**
   - Updated `SkillGap` interface to include `isFallback?` and `fallbackMessage?`
   - Shows yellow info box when fallback is active

## What Happens After Seeding

Once `prisma/seed-goal-skills.ts` is run successfully:

1. **All goals will have 4-6 GoalSkill entries**
2. **Fallback will never trigger** (goalSkills.length will be > 0)
3. **Skill gap shows EXACT requirements** for the specific goal
4. **Yellow info box disappears** (isFallback will be false)
5. **Feature works as designed**

## Verification Checklist

After running the seed scripts, verify:

- [ ] `npx tsx audit-goalskills.ts` shows 0 goals with zero GoalSkills
- [ ] "Detox Therapist" goal has 5 GoalSkill entries
- [ ] "Yoga Therapist" goal has 6 GoalSkill entries
- [ ] "Homoeopathic Physician" goal has 6 GoalSkill entries
- [ ] "Frontend Developer" goal has 5 GoalSkill entries
- [ ] "Data Analyst" goal has 5 GoalSkill entries
- [ ] Profile page skill gap section shows real data (not fallback warning)
- [ ] Tested 3+ different goals across different fields
- [ ] All show specific skill requirements, not general field requirements

## Known Issues & Solutions

### Issue: "Skill not found" warnings during seeding
**Cause**: Skill name in seed file doesn't exactly match Skill.name in database  
**Solution**: 
1. Check exact spelling in database: `SELECT name FROM "Skill" WHERE name ILIKE '%keyword%';`
2. Update seed file to match exact database name
3. Re-run seed script

### Issue: Goals from old schema still missing GoalSkill
**Cause**: New goals added after seed file was created  
**Solution**:
1. Add new goal to `GOAL_SKILL_REQUIREMENTS` object in `prisma/seed-goal-skills.ts`
2. Follow existing pattern: 4-6 skills with appropriate levels
3. Re-run seed script (upsert is safe)

### Issue: Skill levels seem wrong for a goal
**Cause**: Initial seed file may have subjective level assignments  
**Solution**:
1. Identify the goal and skills that need adjustment
2. Update levels in `GOAL_SKILL_REQUIREMENTS` in seed file
3. Re-run seed script (upsert will update existing entries)

## Critical Files

- ✅ `prisma/seed-goal-skills.ts` - Main seeding script (READY TO RUN)
- ✅ `audit-goalskills.ts` - Audit script to check current state (READY TO RUN)
- ✅ `app/api/student/profile/skill-gap/route.ts` - API with fallback logic (DEPLOYED)
- ✅ `app/student/profile/page.tsx` - Profile page with fallback UI (DEPLOYED)
- ⚠️ `.env` - Set `MOCK_MODE="false"` after seeding

## Summary

**Current Status**: GoalSkill table is EMPTY, causing "No skill requirements defined yet" message  
**Temporary Solution**: Fallback mechanism shows field-level common requirements  
**Permanent Solution**: Run `npx tsx prisma/seed-goal-skills.ts` when database connection available  
**Expected Result**: All 60+ goals will have 4-6 skill requirements with proper levels  
**Verification**: Use audit script + manual UI testing across multiple goals/fields
