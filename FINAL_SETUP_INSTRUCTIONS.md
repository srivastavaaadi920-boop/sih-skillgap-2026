# 🎯 Final Setup Instructions - Real Data Profile System

## ✅ What's Been Done

1. ✅ **Schema Updated:** Added `GoalSkill` model to link goals with required skills
2. ✅ **Mock Mode Disabled:** `.env` now has `MOCK_MODE="false"` - only real data
3. ✅ **APIs Updated:** All profile APIs fetch from database only (no demo data)
4. ✅ **Profile Page Rebuilt:** Shows real student data with skill gap analysis
5. ✅ **Seed Script Ready:** Complete mappings for all 60 AYUSH goals + Technology goals

---

## 🚀 Setup Steps (Run When Connected)

### Step 1: Ensure Database Connection
Make sure you have stable internet. Check `.env`:
```bash
DATABASE_URL="postgresql://postgres:Aadisri12!!@db.obuqevasbpeihdmusomb.supabase.co:5432/postgres"
MOCK_MODE="false"
```

### Step 2: Run AYUSH Seed (If Not Done)
This creates all 20 AYUSH fields + goals + skills:
```bash
npx tsx prisma/seed-ayush-domain.ts
```

**Expected:** 20 AYUSH fields, 60 goals, 180 skills created

### Step 3: Add GoalSkill Table
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

### Step 4: Seed GoalSkill Requirements
```bash
npx tsx prisma/seed-goal-skills.ts
```

**Expected output:**
```
🎯 Starting GoalSkill seeding...
Found 60+ goals to process

📌 Processing: Homoeopathic Physician (Homoeopathy Practice)
   ✅ Linked 6 skills

📌 Processing: Ayurvedic Physician (Ayurveda Clinical Practice)
   ✅ Linked 6 skills
...
📊 GOALSKILL SEEDING SUMMARY
Total Goals Processed: 60+
Goals with 4+ skills: 60+ ✅
Goals with <4 skills: 0 ⚠️
```

**Verify:** Every goal should have at least 4 skills

### Step 5: Restart Your Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## 🧪 Testing with Real Data

### Test Case 1: New Student Onboarding

1. **Register a new student account**
   - Email: `test-student-1@example.com`
   - Password: anything
   - Role: STUDENT

2. **Complete Onboarding:**
   - Step 0: Select **AYUSH** domain
   - Step 1: Select **Homoeopathy Practice** field
   - Step 2: Select **Homoeopathic Physician** goal
   - Step 3: Select these skills:
     - ✅ Repertorization → Rate as **INTERMEDIATE**
     - ✅ Materia Medica Knowledge → Rate as **ADVANCED**
     - ✅ Homoeopathic Case Taking → Rate as **INTERMEDIATE**
     - ✅ Detailed Patient Interviewing → Rate as **INTERMEDIATE**
     - ✅ Analytical Case Reasoning → Rate as **BEGINNER**
   - Step 4: Rate all 5 skills (as shown above)
   - Step 5: Complete onboarding

3. **Visit Profile Page:** `/student/profile`

### Expected Results (100% Real Data):

#### "Your Career Path" Section:
```
Domain: 🌿 AYUSH
Field of Interest: Homoeopathy Practice
Career Goal: Homoeopathic Physician
```

#### "My Skills" Section:
```
Total Skills: 5

⚙️ Technical Skills (3):
- Repertorization
  👤 Self-Rated | 📈 INTERMEDIATE
  → Take verification test

- Materia Medica Knowledge
  👤 Self-Rated | 🏆 ADVANCED
  → Take verification test

- Homoeopathic Case Taking
  👤 Self-Rated | 📈 INTERMEDIATE
  → Take verification test

🤝 Soft Skills (2):
- Detailed Patient Interviewing
  👤 Self-Rated | 📈 INTERMEDIATE
  → Take verification test

- Analytical Case Reasoning
  👤 Self-Rated | 🌱 BEGINNER
  → Take verification test
```

#### "Skills for Your Goal: Homoeopathic Physician" Section:

**✅ You're On Track (1 skill):**
```
Materia Medica Knowledge
Your level: 🏆 ADVANCED ≥ Required: 🏆 ADVANCED
```

**📈 Skills to Strengthen (2 skills):**
```
Repertorization
Your level: 📈 INTERMEDIATE → Target: 🏆 ADVANCED
💡 Consider courses, practice projects, or mentorship to level up

Detailed Patient Interviewing
Your level: 📈 INTERMEDIATE → Target: 📈 INTERMEDIATE
(This one should actually be "On Track" - equal levels!)
```

**📚 Skills to Learn (3 skills):**
```
Miasmatic Analysis
Required level: 🏆 ADVANCED
💡 Start learning this skill to improve your match with opportunities

Constitutional Prescribing
Required level: 🏆 ADVANCED
💡 Start learning this skill to improve your match with opportunities

(Homoeopathic Case Taking should NOT be here since student has it)
```

---

### Test Case 2: Different Student, Different Data

1. **Register another student**
   - Email: `test-student-2@example.com`

2. **Complete Onboarding:**
   - Domain: **AYUSH**
   - Field: **Yoga Therapy & Instruction**
   - Goal: **Yoga Therapist**
   - Skills: Select 4-5 different yoga skills

3. **Check Profile:**
   - Should show Yoga-related field/goal
   - Should show different skills than Student 1
   - Should show different skill gap analysis
   - **NO overlap with Homoeopathy data**

---

## 🔍 Database Verification

### Check Student's Skills:
```sql
SELECT s.name, sss.selfRatedLevel, s.category
FROM "StudentSkillSelection" sss
JOIN "Skill" s ON s.id = sss."skillId"
JOIN "StudentProfile" sp ON sp.id = sss."studentProfileId"
JOIN "User" u ON u.id = sp."userId"
WHERE u.email = 'test-student-1@example.com'
ORDER BY s.category, s.name;
```

**Expected:** 5 rows matching what student selected

### Check Goal Requirements:
```sql
SELECT s.name, gs."requiredLevel"
FROM "GoalSkill" gs
JOIN "Skill" s ON s.id = gs."skillId"
JOIN "Goal" g ON g.id = gs."goalId"
WHERE g.title = 'Homoeopathic Physician'
ORDER BY s.name;
```

**Expected:** 6 rows (the required skills for Homoeopathic Physician)

### Check Skill Gap Match:
```sql
-- Skills student has that meet requirements
SELECT s.name, sss."selfRatedLevel", gs."requiredLevel"
FROM "GoalSkill" gs
JOIN "StudentSkillSelection" sss ON gs."skillId" = sss."skillId"
JOIN "Skill" s ON s.id = gs."skillId"
JOIN "Goal" g ON g.id = gs."goalId"
JOIN "StudentProfile" sp ON sp.id = sss."studentProfileId"
WHERE g.title = 'Homoeopathic Physician'
  AND sp."goalId" = g.id
ORDER BY s.name;
```

**Expected:** Shows which skills student has vs what's required

---

## 📊 Expected Counts

After everything is set up:

### Database Tables:
```
Field: 29 records (9 Technology + 20 AYUSH)
Goal: 60-70 records (~3 per field)
Skill: 200+ records (50 base + 180 AYUSH)
FieldSkill: 180+ mappings (9 per field)
GoalSkill: 240-360 mappings (4-6 per goal)
```

### For Test Student 1:
```
StudentProfile: 1 record
  - selectedDomain: AYUSH
  - fieldId: <Homoeopathy Practice ID>
  - goalId: <Homoeopathic Physician ID>

StudentSkillSelection: 5 records
  - 3 TECHNICAL skills
  - 2 SOFT skills

SkillProfileEntry: 5 records
  - Synced from StudentSkillSelection
  - All with isVerified: false
```

### Profile Page Display:
```
My Skills: 5 skills (real count)
On Track: 1-2 skills
Needs Improvement: 1-2 skills
Missing: 2-4 skills
Total = 6 (goal requirements)
```

---

## ✅ Verification Checklist

Before considering setup complete, verify:

### Database:
- [ ] `GoalSkill` table exists
- [ ] Run: `SELECT COUNT(*) FROM "GoalSkill"` → Should be 240+
- [ ] Run: `SELECT "title", COUNT(gs.id) FROM "Goal" g LEFT JOIN "GoalSkill" gs ON g.id = gs."goalId" GROUP BY g.id, g."title"` → Each goal has 4+ skills

### Profile Page:
- [ ] Shows student's actual domain/field/goal (not hardcoded)
- [ ] "My Skills" count matches what student selected
- [ ] All skills show "👤 Self-Rated" badge
- [ ] Skill names are exactly what student chose
- [ ] "Skills for Your Goal" section appears
- [ ] Three categories populated with real comparisons

### Data Accuracy:
- [ ] "On Track" = student level ≥ required level
- [ ] "Needs Improvement" = student level < required level
- [ ] "Missing" = student doesn't have skill
- [ ] No duplicates across categories
- [ ] Math: On Track + Needs Improvement + Missing ≈ Goal's total requirements

### Different Students:
- [ ] Student A (Homoeopathy) sees different data than Student B (Yoga)
- [ ] No demo/mock data appears
- [ ] Each student sees only their own selections

---

## 🐛 Troubleshooting

### Problem: "Complete Your Profile" message
**Cause:** Student hasn't finished onboarding  
**Fix:** Complete all 5 onboarding steps

### Problem: "My Skills" is empty
**Cause:** Student didn't select any skills in Step 3  
**Fix:** Re-do onboarding, select at least 1 skill

### Problem: "No skill requirements defined yet"
**Cause:** GoalSkill table empty or seed failed  
**Fix:**
```bash
# Check if table exists
npx tsx -e "import { PrismaClient } from '@prisma/client'; const p = new PrismaClient(); p.goalSkill.count().then(c => { console.log('GoalSkill count:', c); p.\$disconnect(); });"

# If 0, re-run seed
npx tsx prisma/seed-goal-skills.ts
```

### Problem: Same data for all students
**Cause:** Mock mode still on OR cache issue  
**Fix:**
1. Check `.env`: `MOCK_MODE="false"`
2. Restart dev server
3. Clear browser cache
4. Try incognito window

### Problem: Skill count mismatch
**Cause:** Data inconsistency or partial seed  
**Fix:** Check database directly (SQL queries above)

---

## 🎯 Success Criteria

Your setup is complete when:

1. ✅ Profile page loads without errors
2. ✅ Domain/Field/Goal show student's actual selections
3. ✅ "My Skills" count = number of skills student selected
4. ✅ All skills tagged "👤 Self-Rated" (not "Verified")
5. ✅ Skill Gap Analysis shows 3 categories
6. ✅ Categories have correct skills based on real comparison
7. ✅ Different students see different data
8. ✅ No hardcoded/demo data anywhere

---

## 📝 Summary

**What you have now:**
- ✅ Complete AYUSH domain (20 fields, 60 goals, 180 skills)
- ✅ GoalSkill requirements (each goal defines needed skills + levels)
- ✅ Profile page showing 100% real student data
- ✅ Skill Gap Analysis comparing student vs goal requirements
- ✅ No mock/demo data anywhere

**What students see:**
- Their selected domain, field, and goal
- Their self-rated skills (exactly what they chose)
- Skill gap showing: what they have, what they need to improve, what they're missing
- All based on real database comparisons

**Ready for test engine:**
- When tests go live, just set `isVerified: true`
- Badge automatically changes from "Self-Rated" to "Verified"
- No code changes needed

---

**Next:** Run the 4 setup commands and test with real student accounts! 🚀
