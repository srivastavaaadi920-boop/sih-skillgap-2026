# 🔄 How to Restart and See Changes

## The Problem
Your dev server hasn't picked up the code changes. The browser is showing the OLD version.

## Solution - Follow These Steps EXACTLY:

### Step 1: Stop Dev Server
In your terminal where `npm run dev` is running:
```
Press: Ctrl + C
```
Wait until you see "Process terminated" or the command prompt returns.

### Step 2: Clean Next.js Cache
```bash
rmdir /s /q .next
```
This deletes the `.next` folder which contains cached builds.

### Step 3: Start Dev Server Again
```bash
npm run dev
```
Wait until you see "Ready in X ms" or "compiled successfully"

### Step 4: Hard Refresh Browser
- **Option 1:** Press `Ctrl + Shift + R`
- **Option 2:** 
  1. Open DevTools (F12)
  2. Right-click the refresh button
  3. Select "Empty Cache and Hard Reload"

### Step 5: Clear Application Data (If Still Not Working)
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Clear site data" button
4. Reload page

---

## ✅ After Restart, Test This:

1. **Go to onboarding:** `http://localhost:3000/student/onboarding`

2. **Select AYUSH domain**

3. **Select "Panchakarma Therapy"** field

4. **Select a goal** (e.g., "Panchakarma Specialist")

5. **You should now see Step 3 with:**
   - 7 Technical Skills:
     - Vamana & Virechana Techniques
     - Basti Therapy
     - Abhyanga
     - Snehana & Swedana
     - Detox Protocol Planning
     - Nasya Therapy
     - Raktamokshana
   
   - 2 Soft Skills:
     - Pre/Post Procedure Care
     - Patient Safety Monitoring
   
   - **NEW: "Don't see your skill?" section** with:
     - "+ Add Custom Skill" button

6. **Total: 9 skills** (not 3!)

---

## 🐛 If STILL Not Working

### Check 1: Verify Server Console
Look at your terminal where `npm run dev` is running.
You should see logs like:
```
🔧 MOCK MODE: Returning skills for field: ayush-field-2
```

### Check 2: Verify Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for API calls
4. Should see fetch to: `/api/student/assessment/skills?fieldId=ayush-field-2`

### Check 3: Verify Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "skills"
4. Click on the request
5. Check Response - should show 9 skills

### Check 4: Verify MOCK_MODE is True
```bash
type .env | findstr MOCK_MODE
```
Should show: `MOCK_MODE="true"`

---

## 🆘 Emergency Fix

If nothing works, try this nuclear option:

```bash
# Stop server (Ctrl+C)

# Delete everything
rmdir /s /q .next
rmdir /s /q node_modules

# Reinstall
npm install

# Start fresh
npm run dev
```

**This will take 5-10 minutes but guarantees a clean state.**

---

## 📞 Report Back

After restarting, tell me:
1. How many skills do you see in Step 3?
2. Do you see the "+ Add Custom Skill" button?
3. Any errors in browser console?
4. Any errors in server console?

If still showing 3 skills after all this, there's a different issue and we'll need to debug the API calls.
