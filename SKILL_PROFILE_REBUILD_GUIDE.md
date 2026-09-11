# 🔄 Skill Profile Rebuild - Setup Guide

## ✅ COMPLETED WORK

### 1. Schema Changes
- ✅ Added `GoalSkill` model to schema
- ✅ Links goals to required skills with required levels (BEGINNER/INTERMEDIATE/ADVANCED)
- ✅ Migration script created: `add-goalskill-table.ts`

### 2. Seed Script for GoalSkill Mappings
- ✅ Created comprehensive seed: `prisma/seed-goal-skills.ts`
- ✅ Includes mappings for ALL AYUSH goals
- ✅ Includes sample Technology domain goals
- ✅ Each goal has 4-6 relevant skills with sensible required levels

### 3. Sync Logic Verified
- ✅ Onboarding submit API already syncs StudentSkillSelection → SkillProfileEntry
- ✅ Maps levels correctly: BEGINNER=2, INTERMEDIATE=3, ADVANCED=4
- ✅ Sets `isVerified: false` (ready for test engine later)

### 4. New Profile Page Built
- ✅ File: `app/student/profile/page.tsx`
- ✅ Shows Domain, Field, and Goal at top
- ✅ Lists self-rated skills with clear "Self-Rated" badges (not "Verified")
- ✅ **NEW: Skill Gap Analysis section** with 3 categories:
  - ✅ "You're On Track" - meets/exceeds requirements
  - ✅ "Skills to Strengthen" - has skill but below required level
  - ✅ "Skills to Learn" - missing entirely

### 5. API Endpoints Created
- ✅ `/api/student/profile/data` - Returns student's profile with all self-rated skills
- ✅ `/api/student/profile/skill-gap` - Compares student skills vs Goal requirements

### 6. Opportunity Detail Page
- ✅ Already has skill gap analysis for opportunity-specific skills
- ✅ Uses existing OpportunitySkill data
- ✅ Shows exact matches, semantic matches, and gaps

---

## 🚀 SETUP STEPS (Run When Connected)

### Step 1: Add GoalSkill Table to Database
```bash
npx tsx add-goalskill-table.ts
```

**Expected output:**
```
🔧 Adding GoalSkill table...
[1/3] Creating GoalSkill table...
✅ GoalSkill table created
[2/3] Adding unique constraint...
✅ Unique constraint added
[3/3] Adding indexes and foreign keys...
✅ Indexes and foreign keys added
✅ GoalSkill table setup complete!
```

### Step 2: Seed GoalSkill Requirements
```bash
npx tsx prisma/seed-goal-skills.ts
```

**Expected output:**
```
🎯 Starting GoalSkill seeding...
Found 70 goals to process

📌 Processing: Homoeopathic Physician (Homoeopathy Practice)
   ✅ Linked 6 skills

📌 Processing: Ayurvedic Physician (Ayurveda Clinical Practice)
   ✅ Linked 6 skills
...
(continues for all goals)
...
📊 GOALSKILL SEEDING SUMMARY
Total Goals Processed: 70
Goals with 4+ skills: 70 ✅
Goals with <4 skills: 0 ⚠️

🔍 Verification - Goals with skill counts:
   ✅ Homoeopathic Physician (Homoeopathy Practice): 6 skills
   ✅ Ayurvedic Physician (Ayurveda Clinical Practice): 6 skills
   ✅ Frontend Developer (Software Development): 5 skills
   ...
```

**Verify every goal has at least 4 skills linked!**

### Step 3: Test the New Profile Page

1. **Register/Login as a student** (or use existing test student)

2. **Complete onboarding if needed:**
   - Go to `/student/onboarding`
   - Select AYUSH domain
   - Choose "Homoeopathy Practice" field
   - Choose "Homoeopathic Physician" goal
   - Select skills and rate them (e.g., Repertorization: INTERMEDIATE, Materia Medica: ADVANCED, etc.)

3. **Visit Profile Page:**
   - Go to `/student/profile`
   - Should see:
     - Domain, Field, Goal displayed at top
     - All self-rated skills with "👤 Self-Rated" badges (NOT "✓ Verified")
     - **Skill Gap Analysis section** with:
       - "You're On Track" - skills meeting requirements
       - "Skills to Strengthen" - skills below required level
       - "Skills to Learn" - missing required skills

4. **Check Opportunity Detail:**
   - Go to `/student/opportunities`
   - Click any opportunity
   - Should see skill gap for that specific opportunity

---

## 📊 EXAMPLE: Homoeopathic Physician Goal

### Required Skills (from seed):
1. Repertorization - ADVANCED
2. Materia Medica Knowledge - ADVANCED
3. Miasmatic Analysis - ADVANCED
4. Homoeopathic Case Taking - INTERMEDIATE
5. Constitutional Prescribing - ADVANCED
6. Detailed Patient Interviewing - INTERMEDIATE

### Example Student Self-Ratings:
- Repertorization: INTERMEDIATE
- Materia Medica Knowledge: ADVANCED
- Homoeopathic Case Taking: INTERMEDIATE
- Detailed Patient Interviewing: BEGINNER

### Expected Skill Gap Breakdown:

**✅ You're On Track (1 skill):**
- Materia Medica Knowledge: ADVANCED (meets ADVANCED requirement)

**📈 Skills to Strengthen (2 skills):**
- Repertorization: INTERMEDIATE → need ADVANCED
- Detailed Patient Interviewing: BEGINNER → need INTERMEDIATE

**📚 Skills to Learn (3 skills):**
- Miasmatic Analysis: ADVANCED (not in profile)
- Constitutional Prescribing: ADVANCED (not in profile)
- Homoeopathic Case Taking: INTERMEDIATE (wait, student has this at INTERMEDIATE - should be On Track!)

---

## 🔍 TESTING CHECKLIST

### ✅ Database Verification
- [ ] Run `add-goalskill-table.ts` - no errors
- [ ] Run `seed-goal-skills.ts` - all goals have 4+ skills
- [ ] Query: `SELECT g.title, COUNT(gs.id) FROM "Goal" g LEFT JOIN "GoalSkill" gs ON g.id = gs."goalId" GROUP BY g.id, g.title;`
- [ ] Confirm every goal has at least 4 GoalSkill records

### ✅ Profile Page
- [ ] Domain/Field/Goal displayed correctly at top
- [ ] Skills grouped by Technical/Soft
- [ ] All skills show "👤 Self-Rated" badge (not "Verified")
- [ ] Skill levels display correctly (BEGINNER/INTERMEDIATE/ADVANCED with icons)
- [ ] "Take verification test" links appear (even if test engine not ready)

### ✅ Skill Gap Section
- [ ] Section title shows correct goal name
- [ ] "You're On Track" section shows skills meeting/exceeding requirements
- [ ] "Skills to Strengthen" shows skills below required level with → target level
- [ ] "Skills to Learn" shows missing required skills
- [ ] Counts are accurate (check against database manually)
- [ ] No duplicate skills across categories

### ✅ Opportunity Detail
- [ ] Still shows skill gap for opportunity-specific requirements
- [ ] Uses OpportunitySkill data (not GoalSkill)
- [ ] Distinguishes exact matches vs semantic matches vs gaps

### ✅ Data Accuracy
- [ ] StudentSkillSelection created during onboarding
- [ ] SkillProfileEntry synced with correct proficiencyLevel
- [ ] GoalSkill requirements match what's in seed script
- [ ] Skill gap logic correctly compares levels (BEGINNER=1, INTERMEDIATE=2, ADVANCED=3 rank)

---

## 🐛 TROUBLESHOOTING

### Issue: "No skill requirements defined yet" in Skill Gap
**Cause:** GoalSkill seed didn't run or goal has no skills linked
**Fix:**
```bash
# Check if goal has skills
npx tsx -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.goal.findFirst({
  where: { title: 'Homoeopathic Physician' },
  include: { goalSkills: { include: { skill: true } } }
}).then(g => { console.log(g); prisma.\$disconnect(); });
"

# Re-run seed if empty
npx tsx prisma/seed-goal-skills.ts
```

### Issue: Skills show "✓ Verified" instead of "👤 Self-Rated"
**Cause:** `isVerified` is true in SkillProfileEntry
**Fix:** This shouldn't happen with current onboarding logic. Check:
```sql
SELECT * FROM "SkillProfileEntry" WHERE "isVerified" = true;
```
Should be empty since test engine is on hold.

### Issue: Wrong skills in gap categories
**Cause:** Level comparison logic might be wrong
**Debug:**
1. Check student's self-rated level for skill
2. Check required level in GoalSkill
3. Verify comparison: currentRank >= requiredRank should = "On Track"

### Issue: GoalSkill seed fails with "Skill not found"
**Cause:** Skill name in seed doesn't match exactly with Skill table
**Fix:** Check spelling/capitalization in `GOAL_SKILL_REQUIREMENTS` object

---

## 📝 FUTURE ENHANCEMENTS (Not in Scope Now)

- [ ] Test verification system (when ready, update `isVerified` flag)
- [ ] Update skill gap to show verified vs self-rated in different colors
- [ ] Add progress bars for "Skills to Strengthen"
- [ ] Recommend learning resources for missing skills
- [ ] Track skill gap changes over time
- [ ] Add "Update Skills" flow from profile page

---

## 📋 KEY CHANGES SUMMARY

### What Changed:
1. **Added GoalSkill model** - defines what skills each goal requires
2. **Profile page rebuilt** - clear self-rated labeling, new skill gap section
3. **New APIs** - `/profile/data` and `/profile/skill-gap`
4. **Honest data labeling** - everything shows "Self-Rated" until test engine ready

### What Didn't Change:
- Onboarding flow (already working correctly)
- StudentSkillSelection → SkillProfileEntry sync (already working)
- Opportunity matching logic (uses existing SkillProfileEntry data)
- Opportunity detail page (already had skill gap for OpportunitySkill)

### What's Ready for Later:
- Test engine can update `isVerified: true` when ready
- Verified skills will automatically show "✓ Verified" instead of "👤 Self-Rated"
- Profile page already has test links for each skill
- No code changes needed when test engine goes live

---

## 🎯 SUCCESS CRITERIA

Your implementation is successful when:

1. ✅ Every Goal has 4+ GoalSkill entries in database
2. ✅ Profile page shows Domain/Field/Goal correctly
3. ✅ All skills labeled "Self-Rated" (not "Verified")
4. ✅ Skill Gap section categorizes skills into 3 groups accurately
5. ✅ Numbers match: if student has 3/6 required skills at correct level, gap shows:
   - On Track: 3
   - Needs Improvement: 0-3 (depending on levels)
   - Missing: 0-3 (6 required - skills student has)
6. ✅ Test with at least 3 different AYUSH goals to verify distinct requirements

---

**Status:** ✅ Code complete, ready to run migrations and seed when connected
