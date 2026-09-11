# AYUSH Database Setup Status

## ✅ COMPLETED WORK

### 1. Database Schema Migration
- ✅ Created `Domain` enum with TECHNOLOGY and AYUSH values
- ✅ Added `domain` column to `Field` table
- ✅ Added `isCustom` column to `Skill` table  
- ✅ Created `FieldSkill` join table to link skills to specific fields
- ✅ All existing Technology fields marked with TECHNOLOGY domain
- ✅ Indexes and foreign keys properly configured

### 2. Custom Skill "Other" Feature
- ✅ API endpoint at `/api/student/skills/custom` already exists
- ✅ Frontend UI already integrated in onboarding page (Step 3)
- ✅ Students can add custom skills with category selection (TECHNICAL/SOFT)
- ✅ Custom skills automatically linked to the field via FieldSkill
- ✅ Custom skills are marked with `isCustom: true` flag
- ✅ Duplicate prevention (case-insensitive checking)
- ✅ Custom skills become available for future students in that field

### 3. AYUSH Seed Script Ready
- ✅ Seed script created: `prisma/seed-ayush-domain.ts`
- ✅ Contains all 20 AYUSH fields
- ✅ Each field has 3 career goals (60 total goals)
- ✅ Each field has 9 unique skills (180 total AYUSH skills)
- ✅ Idempotent (safe to re-run using upsert)
- ✅ Includes Technology field skill mapping

### 4. Excel Export
- ✅ Created `AYUSH_Fields_Goals_Skills.csv` with all data
- ✅ 540 rows (20 fields × 3 goals × 9 skills)
- ✅ Ready to open in Excel/Google Sheets

---

## ⚠️ PENDING: AYUSH Data Seeding

### Issue
Your Supabase database connection times out intermittently (you mentioned connecting via phone network). The AYUSH seed script is ready but hasn't fully run yet due to connection issues.

### What Needs to Happen

**When you have a stable internet connection:**

1. **Run the AYUSH seed script:**
   ```bash
   npx tsx prisma/seed-ayush-domain.ts
   ```

   This will:
   - Create all 20 AYUSH fields
   - Create 60 goals (3 per field)
   - Create 180 AYUSH skills
   - Link skills to fields via FieldSkill

2. **Verify the data was seeded:**
   ```bash
   npx tsx check-db-state.ts
   ```

   Expected output:
   - Technology Fields: 9
   - AYUSH Fields: 20
   - Total Fields: 29
   - Total Goals: ~70-80 (existing + 60 new)
   - Total FieldSkill Mappings: Should show ~9 skills per field

---

## 📊 EXPECTED DATABASE STATE (After Seeding)

### Fields (29 total)
**Technology (9 existing):**
- Software Development
- Data Science & Analytics
- Digital Marketing
- UI/UX Design
- DevOps & Cloud Engineering
- Mobile App Development
- Cybersecurity
- Blockchain Development
- Game Development

**AYUSH (20 new):**
1. Ayurveda Clinical Practice
2. Panchakarma Therapy
3. Yoga Therapy & Instruction
4. Naturopathy
5. Unani Medicine
6. Siddha Medicine
7. Homoeopathy Practice
8. AYUSH Pharmaceutical Manufacturing
9. Herbal Drug Quality Control & Testing
10. AYUSH Regulatory Affairs
11. AYUSH Clinical Research
12. Ayurvedic Nutrition & Dietetics
13. AYUSH Wellness Tourism & Spa Management
14. AYUSH Digital Health & Informatics
15. Medicinal Plant Cultivation
16. AYUSH Hospital & Clinic Administration
17. AYUSH Public Health & Community Outreach
18. Ayurvedic Cosmetology & Beauty Therapy
19. Yoga for Sports & Fitness
20. AYUSH Education & Academic Training

### Goals
- 3 goals per field = 60 new AYUSH goals
- Example for Homoeopathy Practice:
  - Homoeopathic Physician
  - Classical Homoeopath
  - Alternative Medicine Consultant

### Skills per Field
Each AYUSH field has 9 unique skills:

**Example: Homoeopathy Practice**
1. Repertorization (TECHNICAL)
2. Materia Medica Knowledge (TECHNICAL)
3. Miasmatic Analysis (TECHNICAL)
4. Homoeopathic Case Taking (TECHNICAL)
5. Potentization Techniques (TECHNICAL)
6. Organon of Medicine Application (TECHNICAL)
7. Constitutional Prescribing (TECHNICAL)
8. Detailed Patient Interviewing (SOFT)
9. Analytical Case Reasoning (SOFT)

---

## 🔧 TROUBLESHOOTING

### If seed script fails with "Domain enum does not exist"
Run this first:
```bash
npx tsx create-domain-enum.ts
npx tsx fix-domain-column.ts
```

### If Prisma client is out of sync
**Note:** You may see file lock errors on Windows. This is usually okay - just retry or restart your editor.
```bash
npx prisma generate
```

### To manually check database state anytime
```bash
npx tsx check-db-state.ts
```

### If skills are missing for a field
The seed script uses upsert, so you can safely re-run:
```bash
npx tsx prisma/seed-ayush-domain.ts
```

---

## ✅ FEATURES READY TO TEST

### 1. Domain Selection (Step 0)
- Students choose between Technology 💻 or AYUSH 🌿

### 2. Field Selection (Step 1)
- Shows only fields for the selected domain
- 9 Technology fields OR 20 AYUSH fields

### 3. Goal Selection (Step 2)
- Shows 2-3 goals specific to the selected field
- Each field has its own unique career paths

### 4. Skill Selection (Step 3)
- Shows ~9 skills specific to the selected field
- Skills are NOT shared across unrelated fields
- **"Other" custom skill option:**
  - Click "+ Add Custom Skill"
  - Enter skill name
  - Choose TECHNICAL or SOFT category
  - Skill is saved and auto-selected
  - Future students in that field will see it

### 5. Self-Rating (Step 4)
- Students rate each selected skill as BEGINNER/INTERMEDIATE/ADVANCED

### 6. Completion (Step 5)
- Links to verification tests for selected skills

---

## 🚀 NEXT STEPS

1. **When you have stable internet:**
   - Run `npx tsx prisma/seed-ayush-domain.ts`
   - Verify with `npx tsx check-db-state.ts`

2. **Test the flow:**
   - Register as a student
   - Go through onboarding
   - Test both Technology AND AYUSH domains
   - Test at least 3 different AYUSH fields to verify distinct skills
   - Try adding a custom skill (e.g., "Pulse Reading" for Ayurveda)

3. **Verify skill counts:**
   - Each field should show ~9 skills (not 3!)
   - Skills should be field-specific (e.g., Homoeopathy skills ≠ Yoga skills)

4. **Check custom skills:**
   - Add a custom skill
   - Log out and register as a new student
   - Select the same field
   - Confirm the custom skill now appears in the list

---

## 📋 FILES CREATED

### Migration Scripts
- `simple-migration.ts` - Initial schema migration (already run ✅)
- `create-domain-enum.ts` - Creates Domain enum type (already run ✅)
- `fix-domain-column.ts` - Fixes domain column type (already run ✅)

### Seed Scripts
- `prisma/seed-ayush-domain.ts` - Main AYUSH seed (needs stable connection)

### Verification Scripts
- `check-db-state.ts` - Comprehensive database state checker

### Data Export
- `AYUSH_Fields_Goals_Skills.csv` - Excel export of all AYUSH data

---

## 💡 TIPS

### Excel Export
The CSV file is already created and open in your editor. You can:
- Open in Excel: Double-click the file
- Open in Google Sheets: File → Import → Upload
- Use filters to view specific fields or categories

### Mock Mode
Your `.env` has `MOCK_MODE="true"`. This might bypass database calls. To test with real data:
- Set `MOCK_MODE="false"` in `.env`
- Restart your Next.js dev server

### Custom Skills
The "Other" option in Step 3 is fully functional. Test it with realistic AYUSH skills like:
- "Marma Therapy"
- "Ayurvedic Cooking"
- "Herbal Garden Management"
- "Patient Pulse Diagnosis"

---

## ❓ NEED HELP?

If you see any issues after running the seed:

1. **No fields showing in UI:**
   - Check `MOCK_MODE` setting
   - Verify seed completed: `npx tsx check-db-state.ts`

2. **Only 3 skills per field instead of 9:**
   - Re-run the seed: `npx tsx prisma/seed-ayush-domain.ts`
   - Check output logs for errors

3. **Goals are empty for a field:**
   - Check database: `npx tsx check-db-state.ts`
   - Look for specific field name in output

4. **Custom skill not appearing:**
   - Check if it was actually saved (check browser console)
   - Verify FieldSkill link was created
   - Try refreshing the page

---

**Status:** ✅ Schema migrated, APIs ready, UI complete  
**Remaining:** ⚠️ Run AYUSH seed script when you have stable internet

**Estimated time to complete:** 2-3 minutes once connection is stable
