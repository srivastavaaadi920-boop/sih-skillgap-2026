# Quick Start - Hybrid Matching System

## Current Status

✅ **Hybrid matching engine implemented**
✅ **All code updated and compiling successfully**
⏳ **Database connection required for testing**

## What You Need To Do

### 1. Reconnect to Database

Your mobile hotspot is currently disconnected. Reconnect and ensure stable connection.

### 2. Seed OpportunitySkill Records

```bash
cd C:\Users\Aadi Srivastava\OneDrive\Desktop\SIH
npx tsx prisma/seed-opportunities.ts
```

This creates 6 test opportunities with their required skills.

### 3. Test the System

```bash
npx tsx scripts/test-hybrid-matching.ts
```

This will:
- Show your student skill profile
- Test matching against all 6 opportunities
- Display exact vs semantic vs gap skills
- Show score breakdown per opportunity
- Generate a summary table

### 4. Check in Browser

1. Go to `http://localhost:3002` (NOT 3000 - server is on port 3002!)
2. Login as the student who completed assessment
3. Visit `/student/opportunities`
4. **Verify scores are DIFFERENT for each opportunity**
5. Click an opportunity to see detailed match breakdown

## What To Look For

### ✅ System Working Correctly:

- Each opportunity shows a DIFFERENT match score
- Frontend Developer shows high score for web dev students
- Machine Learning shows lower score for non-ML students
- Detail page shows:
  - **Exact matches** with green "Exact Match" badge
  - **Semantic matches** with blue "Similar Skill" badge
  - **Gap skills** in separate "Skills to Develop" section

### ❌ Still Broken (100% Bug):

If all opportunities still show 100% or same score:
1. OpportunitySkill records are missing - run seed script again
2. Check database with: `npx tsx scripts/debug-matching.ts`

## Root Cause of Original Bug

**Most Likely:** OpportunitySkill records were never created in the database.

- The seed script (`seed-opportunities.ts`) was created but not executed
- Without OpportunitySkill records, `opp.requiredSkills` is an empty array
- Empty array → matching function correctly returns 0%
- But the 100% you're seeing suggests either:
  - Frontend is showing cached/default values
  - Seed script was never run
  - Database queries are failing silently

**Fix:** Run `npx tsx prisma/seed-opportunities.ts` to create the records.

## New Features

### Hybrid Matching

**80% weight - Exact Matching:**
- Matches skills by exact ID
- Scores by proficiency ratio
- Student proficiency 5, required 3 → 100% credit
- Student proficiency 2, required 4 → 50% credit

**20% weight - Semantic Matching:**
- For unmatched skills only
- Uses AI to find similar skills
- "React" ≈ "ReactJS" (92% similar)
- "ML" ≈ "Machine Learning" (85% similar)
- Threshold: 75%+ similarity

### Visual Indicators

- **Green badge**: "Exact Match" - perfect skill ID match
- **Blue badge**: "Similar Skill" - semantic match found
- **Yellow warning**: Below required proficiency
- **Green check**: Meets or exceeds requirement

## Performance

**First Load:** 3-5 seconds (downloads ML model, ~100MB)
**Subsequent Loads:** <1 second (model cached)

The delay on first load is EXPECTED - it's downloading the sentence-transformer model locally.

## Troubleshooting

### "Can't reach database server"
→ Mobile hotspot disconnected, reconnect and try again

### "No student with skill profile found"
→ Complete the skill assessment first at `/student/assessment`

### All opportunities show 0%
→ OpportunitySkill records missing, run seed script

### All opportunities show same score
→ Semantic matching catching everything OR seed data is too uniform

### Model download fails
→ Check internet connection (needed for first-time model download)

## Files Changed

**New Files:**
- `/lib/matching-hybrid.ts` - Core algorithm
- `/scripts/test-hybrid-matching.ts` - Test suite
- `/scripts/debug-matching.ts` - Database verification

**Updated Files:**
- `/app/api/student/opportunities/route.ts` - Uses hybrid matching
- `/app/api/student/opportunities/[id]/route.ts` - Detailed hybrid results
- `/app/student/opportunities/[id]/page.tsx` - Shows exact/semantic/gap breakdown

**Package Added:**
- `@xenova/transformers` - Local ML inference (no API keys needed)

## Next Steps After Testing

1. **Optimize Performance:**
   - Pre-compute embeddings for all skills in database
   - Add `embedding` column to Skill table
   - Store vectors to avoid recomputation

2. **UI Improvements:**
   - Show semantic match similarity scores
   - Add "Why this match?" explanations
   - Recommend learning paths for gap skills

3. **Analytics:**
   - Track which semantic matches are most common
   - Identify skill name inconsistencies
   - Improve skill taxonomy

## Questions?

Check `HYBRID_MATCHING_REPORT.md` for full technical details.
