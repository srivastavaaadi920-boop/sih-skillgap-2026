# Quick Start Testing Guide

## 🚀 5-Minute Quick Test

### Step 1: Verify Setup
```bash
# Check MOCK_MODE is false
type .env | findstr MOCK_MODE
```
Should show: `MOCK_MODE=false`

### Step 2: Clear Previous Data
```bash
node clear-test-student-data.js
```
Wait for: ✅ Test student data cleared successfully!

### Step 3: Login
- Open: http://localhost:3000/auth/login
- Email: `student@test.com`
- Password: `password123`
- Click Login

### Step 4: Complete Onboarding
1. Go to: http://localhost:3000/student/onboarding
2. **Step 1:** Select any field → Next
3. **Step 2:** Select any goal → Next
4. **Step 3:** ✅ **VERIFY: Only 23 skills shown** (not 50)
   - Select 2-3 skills (e.g., JavaScript, Python)
   - Next
5. **Step 4:** Rate each skill (pick any level) → Next
6. **Step 5:** Review → Complete Onboarding

### Step 5: Take Test
1. Go to: http://localhost:3000/student/profile
2. Click "Take Test" for one skill
3. ✅ **VERIFY: Real questions appear** (not "Mock question N")
4. ✅ **VERIFY: Real options** (not "Option A for QN")
5. Answer all questions (5-7 total)
6. ✅ **VERIFY: Test completes successfully** (no errors)

---

## ✅ SUCCESS = All These Pass

- ✅ Only 23 skills in onboarding
- ✅ Real question text
- ✅ Real answer options
- ✅ Test completes without errors
- ✅ Results screen shows correctly

## ❌ FAILURE = Any of These

- ❌ More than 23 skills shown
- ❌ "Mock question" text
- ❌ "Option A for Q1" text
- ❌ "No questions available" error
- ❌ Any crash or error

---

## 🔧 Troubleshooting

**Login fails?**
```bash
node check-users.js
```

**Questions not loading?**
```bash
node show-real-questions.js
```

**Want to test again?**
```bash
node clear-test-student-data.js
```

---

## 📚 Full Testing

For comprehensive testing, see: **TESTING_CHECKLIST.md**

---

*This is all you need to quickly verify the system works!*
