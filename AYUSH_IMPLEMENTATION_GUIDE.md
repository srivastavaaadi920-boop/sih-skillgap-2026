# AYUSH Domain Implementation Guide

## Status: PARTIALLY COMPLETE - DATABASE MIGRATION PENDING

---

## ✅ COMPLETED

### 1. Schema Changes
- ✅ Added `Domain` enum (TECHNOLOGY, AYUSH)
- ✅ Added `domain` field to Field model
- ✅ Added `FieldSkill` join table for field-specific skill mapping
- ✅ Added `selectedDomain` to StudentProfile
- ✅ Added `hasCompletedOnboarding` to StudentProfile
- ✅ Added unique constraint on Goal (fieldId, title)

**Files Modified:**
- `prisma/schema.prisma`

### 2. Seed Scripts Created
- ✅ Created `seed-ayush-domain.ts` with:
  - 20 AYUSH fields
  - 60 goals (3 per field)
  - 180 AYUSH-specific skills
  - Field-Skill mappings for all AYUSH fields
  - Technology field-skill retroactive mappings
  
**Files Created:**
- `prisma/seed-ayush-domain.ts`

### 3. Manual Migration SQL
- ✅ Created SQL file for manual migration when DB accessible

**Files Created:**
- `migration-ayush-domain.sql`

### 4. Test Start Route Fix
- ✅ Fixed MOCK_MODE to check BEFORE database calls
- ✅ Now works without database connection

**Files Modified:**
- `app/api/student/test/start/route.ts`

---

## ⏳ PENDING (Database Required)

### 1. Run Migration
```bash
# When database is accessible:
npx prisma migrate dev --name add_ayush_domain_and_field_skills

# OR run manual SQL:
psql $DATABASE_URL < migration-ayush-domain.sql
```

### 2. Run Seed Script
```bash
# After migration succeeds:
npx tsx prisma/seed-ayush-domain.ts
```

### 3. Update Onboarding Flow
Need to modify `/app/student/onboarding/page.tsx`:
- Add Step 0: Domain Selection (Technology vs AYUSH)
- Update Step 1: Filter fields by selected domain
- Update Step 3: Filter skills by selected field (via FieldSkill table)
- Renumber steps: 0, 1, 2, 3, 4, 5 (6 steps total)

### 4. Update API Routes

**`/api/student/onboarding/fields/route.ts`:**
- Accept optional `domain` query parameter
- Filter fields by domain

**`/api/student/assessment/skills/route.ts`:**
- Accept `fieldId` parameter
- Return only skills linked to that field via FieldSkill table

**`/api/student/onboarding/submit/route.ts`:**
- Save `selectedDomain` to StudentProfile
- Set `hasCompletedOnboarding = true`

### 5. Update Test Engine for AYUSH
Need to modify `lib/testEngine.ts` if using AI generation:
- Pass field name and domain in question generation prompt
- Ensure AYUSH questions are domain-appropriate

---

## 📋 AYUSH DATA STRUCTURE

### 20 AYUSH Fields

1. **Ayurveda Clinical Practice** - 9 skills
2. **Panchakarma Therapy** - 9 skills
3. **Yoga Therapy & Instruction** - 9 skills
4. **Naturopathy** - 9 skills
5. **Unani Medicine** - 9 skills
6. **Siddha Medicine** - 9 skills
7. **Homoeopathy Practice** - 9 skills
8. **AYUSH Pharmaceutical Manufacturing** - 9 skills
9. **Herbal Drug Quality Control & Testing** - 9 skills
10. **AYUSH Regulatory Affairs** - 9 skills
11. **AYUSH Clinical Research** - 9 skills
12. **Ayurvedic Nutrition & Dietetics** - 9 skills
13. **AYUSH Wellness Tourism & Spa Management** - 9 skills
14. **AYUSH Digital Health & Informatics** - 9 skills
15. **Medicinal Plant Cultivation** - 9 skills
16. **AYUSH Hospital & Clinic Administration** - 9 skills
17. **AYUSH Public Health & Community Outreach** - 9 skills
18. **Ayurvedic Cosmetology & Beauty Therapy** - 9 skills
19. **Yoga for Sports & Fitness** - 9 skills
20. **AYUSH Education & Academic Training** - 9 skills

**Total: 180 AYUSH-specific skills**

### Example Skills by Field

**Ayurveda Clinical Practice:**
- Nadi Pariksha
- Dravyaguna
- Roga Nidana
- Ayurvedic Case Documentation
- Ashtavidha Pariksha
- Prakriti Assessment
- Kaya Chikitsa
- Patient Counseling
- Cross-system Medical Communication

**Panchakarma Therapy:**
- Vamana & Virechana Techniques
- Basti Therapy
- Abhyanga
- Snehana & Swedana
- Detox Protocol Planning
- Nasya Therapy
- Raktamokshana
- Pre/Post Procedure Care
- Patient Safety Monitoring

---

## 🚧 NEXT STEPS (In Order)

### When Database is Accessible:

**Step 1: Run Migration**
```bash
cd "c:\Users\Aadi Srivastava\OneDrive\Desktop\SIH"
npx prisma migrate dev --name add_ayush_domain_and_field_skills
```

**Step 2: Run Seed Script**
```bash
npx tsx prisma/seed-ayush-domain.ts
```

**Step 3: Verify Seeding**
```bash
# Check field count
npx prisma studio
# Or create a verification script
```

**Step 4: Update Onboarding UI**
- I'll provide complete updated onboarding page code
- Add domain selection step
- Filter fields and skills appropriately

**Step 5: Update API Routes**
- Update fields API to accept domain filter
- Update skills API to use FieldSkill table
- Update submit API to save domain

**Step 6: Test End-to-End**
- Test Technology domain flow (ensure not broken)
- Test AYUSH domain flow
- Verify skill filtering works correctly
- Take test for AYUSH skill, verify question generation

---

## 🎯 TESTING CHECKLIST

### Technology Domain (Regression Test)
- [ ] Can select Technology domain
- [ ] See existing Technology fields
- [ ] See correct skills for selected field
- [ ] Complete onboarding successfully
- [ ] Take test for a Technology skill

### AYUSH Domain (New Feature)
- [ ] Can select AYUSH domain
- [ ] See 20 AYUSH fields
- [ ] Select an AYUSH field (e.g., "Panchakarma Therapy")
- [ ] See ONLY that field's 9 skills (not all 180)
- [ ] Complete onboarding with AYUSH selections
- [ ] Take test for an AYUSH skill
- [ ] Verify question is domain-appropriate (not generic)

---

## 📄 FILES REFERENCE

### Created Files
1. `prisma/seed-ayush-domain.ts` - Comprehensive AYUSH seeding
2. `migration-ayush-domain.sql` - Manual migration SQL
3. `AYUSH_IMPLEMENTATION_GUIDE.md` - This guide

### Modified Files
1. `prisma/schema.prisma` - Added Domain, FieldSkill, updated models
2. `app/api/student/test/start/route.ts` - Fixed MOCK_MODE order

### Files to Modify Next
1. `app/student/onboarding/page.tsx` - Add domain selection
2. `app/api/student/onboarding/fields/route.ts` - Add domain filter
3. `app/api/student/assessment/skills/route.ts` - Use FieldSkill table
4. `app/api/student/onboarding/submit/route.ts` - Save domain
5. `lib/testEngine.ts` - Add domain context for AI generation (if used)

---

## 💡 KEY DESIGN DECISIONS

### Why FieldSkill Table?
- **Problem:** Students saw ALL skills regardless of their chosen field
- **Solution:** Field-specific skill mapping via join table
- **Benefit:** Panchakarma students only see Panchakarma skills, not unrelated skills

### Why Domain as Separate Step?
- **Problem:** Mixing Technology and AYUSH fields felt incongruous
- **Solution:** Domain selection as Step 0 with distinct visual treatment
- **Benefit:** Clear structural choice, better UX, easier filtering

### Technology Retroactive Mapping
- **Problem:** Fix only for AYUSH would create inconsistency
- **Solution:** Create FieldSkill mappings for existing Technology fields too
- **Benefit:** Consistent behavior across both domains

---

## 🔧 TROUBLESHOOTING

### If Migration Fails
- The enum already exists: Drop it first or use ALTER TYPE
- Foreign key errors: Check that Field and Skill tables have required records

### If Seeding Fails
- Unique constraint violations: Script uses upsert, should handle this
- Foreign key errors: Ensure migration ran successfully first

### If Skills Don't Filter Correctly
- Check FieldSkill table has correct mappings
- Verify API route queries FieldSkill table
- Check frontend passes fieldId to skills API

---

*Last Updated: 2026-09-11*
*Status: Ready for database migration and seeding*
