# 🚀 RUN THESE COMMANDS WHEN YOU HAVE STABLE INTERNET

## Quick Setup (2 minutes)

### Step 1: Run the AYUSH Seed
```bash
npx tsx prisma/seed-ayush-domain.ts
```

**Expected output:**
```
🚀 Starting comprehensive AYUSH + Technology field-skill seeding
✅ Assuming existing fields are already set to TECHNOLOGY domain
🌿 Starting AYUSH domain seeding...
📋 Creating AYUSH fields...
  ✅ Ayurveda Clinical Practice
  📌 Creating goals for Ayurveda Clinical Practice...
     • Ayurvedic Physician
     • Clinical Consultant
     • Wellness Practitioner
  🎯 Creating skills for Ayurveda Clinical Practice...
     ✅ 9 skills linked
...
(continues for all 20 fields)
...
✅ AYUSH domain seeding complete!
📊 AYUSH Domain Summary:
   Fields: 20
   Goals: 60
   Field-Skill Mappings: 180
```

### Step 2: Verify Everything Worked
```bash
npx tsx check-db-state.ts
```

**Look for:**
- ✅ Technology Fields: 9
- ✅ AYUSH Fields: 20
- ✅ Total Fields: 29
- ✅ Each AYUSH field should show 9 skills (NOT 3!)

### Step 3: Test in Browser
1. Open your app: `http://localhost:3000`
2. Register as a new student
3. In onboarding, select "AYUSH / Traditional Medicine" domain
4. Pick any field (e.g., "Homoeopathy Practice")
5. Verify you see 9 skills for that field
6. Try adding a custom skill using the "+ Add Custom Skill" button

---

## If You See Errors

### Error: "Can't reach database server"
- Your internet connection dropped again
- Wait for stable connection and retry

### Error: "type Domain does not exist"
Run this first:
```bash
npx tsx create-domain-enum.ts
npx tsx fix-domain-column.ts
```
Then retry the seed.

### Error: Prisma client out of sync
```bash
npx prisma generate
```
Then retry the seed.

---

## That's It!

Once the seed completes successfully, your AYUSH platform is fully ready with:
- 20 AYUSH fields ✅
- 60 career goals ✅
- 180 field-specific skills ✅
- Custom skill "Other" option ✅
- All features from the Excel sheet you have open ✅
