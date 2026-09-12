# Debug Guide: Opportunity Creation Issue

## Issue
When creating an opportunity on the industry side, you see the error:
**"Failed to create opportunity. Please try again."**

## Debug Steps

### Step 1: Open Browser Console
1. Press **F12** or **Ctrl+Shift+I** to open Developer Tools
2. Go to the **Console** tab
3. Clear any existing logs (click the 🚫 icon)

### Step 2: Try Creating an Opportunity Again
1. Fill out all 3 steps of the form
2. Select at least 1 skill with a proficiency level
3. Click **"Create Opportunity"**
4. Watch the console for logs

### Step 3: Look for These Log Messages

#### ✅ Expected Logs (Success):
```
📤 POST /api/industry/opportunities - Response status: 201
✅ Opportunity created successfully: {opportunity: {...}, useMockStorage: true}
🔧 MOCK MODE: Storing opportunity in localStorage
   Stored opportunity: mock-opp-1234567890
   Total opportunities: 1
```

#### ❌ Error Logs (Need to Fix):
```
📥 POST /api/industry/opportunities - Request received
   Auth user: company@test.com (INDUSTRY)
   ❌ [Some validation error]
```

OR

```
❌ Failed to create opportunity: 403 {error: "Unauthorized"}
```

OR

```
❌ Network or unexpected error: [error details]
```

### Step 4: Check Common Issues

#### Issue 1: Not Logged In or Wrong User
**Symptom:** `❌ Unauthorized - Role: STUDENT` or no auth user
**Fix:** 
1. Go to `/auth/login`
2. Login with: `company@test.com` / `password123`
3. Try creating opportunity again

#### Issue 2: Missing Required Fields
**Symptom:** `❌ Missing required fields`
**Fix:**
1. Make sure you entered a **Title**
2. Make sure you entered a **Description**
3. Make sure you selected a **Domain** (Technology or AYUSH)
4. Make sure you selected a **Field**
5. Make sure you selected **at least 1 skill**

#### Issue 3: Network Error
**Symptom:** `❌ Network or unexpected error`
**Fix:**
1. Check if the dev server is running on http://localhost:3002
2. Check if there are any CORS errors
3. Try refreshing the page and logging in again

#### Issue 4: Invalid Field/Skill IDs
**Symptom:** Server logs show unexpected field or skill IDs
**Fix:**
1. The field and skill selection APIs might be returning wrong data
2. Check console for the field/skill selection responses

### Step 5: Share Console Logs

If none of the above helps, copy **all console logs** and share them. Look for:
1. Any red error messages
2. The complete request/response cycle
3. Any warnings about localStorage

## Quick Test

To verify the system is working, try this minimal test:

1. **Clear localStorage:**
   - Open Console
   - Run: `localStorage.clear()`
   - Refresh page

2. **Login:**
   - Email: `company@test.com`
   - Password: `password123`

3. **Create Simple Opportunity:**
   - Step 1: Title = "Test Job", Description = "Test description", Type = INTERNSHIP
   - Step 2: Domain = Technology, Field = (any field)
   - Step 3: Select 1 skill with any proficiency
   - Click Create

4. **Check Console:**
   - Should see `✅ Opportunity created successfully`
   - Should see `🔧 MOCK MODE: Storing opportunity in localStorage`

5. **Verify Storage:**
   - Run in console: `JSON.parse(localStorage.getItem('industry_opportunities'))`
   - Should show an array with 1 opportunity

## Environment Check

Make sure `.env` has:
```
MOCK_MODE="true"
```

If it's not set to true, the system will try to connect to the database and will fail.

## Common Console Commands for Debugging

```javascript
// Check if user is logged in
localStorage.getItem('auth_token')

// Check stored opportunities
JSON.parse(localStorage.getItem('industry_opportunities') || '[]')

// Clear all opportunities
localStorage.removeItem('industry_opportunities')

// Clear everything and start fresh
localStorage.clear()
```

## Next Steps After Fixing

Once opportunity creation works:
1. Test viewing the opportunity list at `/industry/opportunities`
2. Test clicking on an opportunity to view details
3. Test toggling opportunity status (Open/Closed)
4. All should work with the localStorage-based mock mode
