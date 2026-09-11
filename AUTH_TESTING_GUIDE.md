# Authentication Testing Guide
Academia-Industry Collaboration Portal - SIH26044

## 🎯 What's Been Built

### ✅ Complete Authentication System:
1. **Email + Password Auth** - Secure registration and login
2. **JWT in httpOnly Cookies** - No localStorage, secure token storage
3. **Bcrypt Password Hashing** - Passwords never stored in plain text
4. **Role-Based Access Control** - Middleware protects routes by role
5. **Transaction-Based Registration** - User + Profile created atomically

### 📁 Files Created:

**API Routes:**
- `/app/api/auth/register/route.ts` - User registration with profile creation
- `/app/api/auth/login/route.ts` - Login with JWT cookie
- `/app/api/auth/logout/route.ts` - Clear auth cookie
- `/app/api/auth/me/route.ts` - Get current user info

**Frontend Pages:**
- `/app/auth/register/page.tsx` - Dynamic registration form (role-based fields)
- `/app/auth/login/page.tsx` - Login form
- `/app/student/page.tsx` - Student dashboard (protected)
- `/app/industry/page.tsx` - Industry dashboard (protected)
- `/app/academician/page.tsx` - Academician dashboard (protected)
- `/app/unauthorized/page.tsx` - 403 page for role mismatches

**Utilities:**
- `/lib/auth.ts` - JWT signing, verification, cookie management
- `/middleware.ts` - Route protection based on JWT role claims

---

## 🧪 Testing Instructions

### Prerequisites:
```bash
npm run dev
```
Server should be running on http://localhost:3000

---

### Test 1: Register a STUDENT ✅

1. Visit: http://localhost:3000/auth/register
2. Fill in:
   - Name: `John Doe`
   - Email: `student@test.com`
   - Password: `password123`
   - Role: Select **STUDENT**
   - Institution Name: `MIT`
   - Course: `Computer Science`
   - Year of Study: `2`
   - Bio: `Passionate about AI` (optional)
3. Click **Register**
4. **Expected:** Redirect to `/student` dashboard
5. **Verify:** Dashboard shows "Welcome, John Doe!" with role STUDENT

---

### Test 2: Register an INDUSTRY User ✅

1. **Open a new incognito window** (or logout first)
2. Visit: http://localhost:3000/auth/register
3. Fill in:
   - Name: `Tech Corp`
   - Email: `company@test.com`
   - Password: `password123`
   - Role: Select **INDUSTRY**
   - Company Name: `TechCorp Inc`
   - Industry Type: `Technology`
   - Website: `https://techcorp.com` (optional)
   - Description: `Leading tech company` (optional)
4. Click **Register**
5. **Expected:** Redirect to `/industry` dashboard
6. **Verify:** Dashboard shows "Welcome, Tech Corp!" with role INDUSTRY

---

### Test 3: Register an ACADEMICIAN ✅

1. **Open another incognito window** (or logout)
2. Visit: http://localhost:3000/auth/register
3. Fill in:
   - Name: `Dr. Jane Smith`
   - Email: `professor@test.com`
   - Password: `password123`
   - Role: Select **ACADEMICIAN**
   - Institution Name: `Stanford University`
   - Department: `Computer Science`
   - Designation: `Professor`
4. Click **Register**
5. **Expected:** Redirect to `/academician` dashboard
6. **Verify:** Dashboard shows "Welcome, Dr. Jane Smith!" with role ACADEMICIAN

---

### Test 4: Login Flow ✅

1. Click **Logout** on any dashboard
2. Visit: http://localhost:3000/auth/login
3. Enter:
   - Email: `student@test.com`
   - Password: `password123`
4. Click **Sign in**
5. **Expected:** Redirect to `/student` dashboard
6. **Verify:** You're logged in as the student

---

### Test 5: Role-Based Access Control ✅

**Test unauthorized access:**

1. **Login as STUDENT** (`student@test.com`)
2. **Manually visit:** http://localhost:3000/industry
3. **Expected:** Redirected to `/unauthorized` page (403)
4. **Verify:** Message says "You don't have permission to access this page"

**Test another role:**

1. **Login as INDUSTRY** (`company@test.com`)
2. **Manually visit:** http://localhost:3000/student
3. **Expected:** Redirected to `/unauthorized` page (403)

---

### Test 6: /api/auth/me Endpoint ✅

1. **While logged in**, visit: http://localhost:3000/api/auth/me
2. **Expected:** JSON response with your user info:
   ```json
   {
     "user": {
       "id": "...",
       "email": "student@test.com",
       "name": "John Doe",
       "role": "STUDENT",
       "createdAt": "..."
     }
   }
   ```
3. **Verify:** No `passwordHash` field in response ✅

**Test unauthenticated:**

1. **Logout or open incognito**
2. Visit: http://localhost:3000/api/auth/me
3. **Expected:** 401 response with error: "Not authenticated"

---

### Test 7: Logout ✅

1. **Login to any dashboard**
2. Click **Logout** button
3. **Expected:** Redirected to `/auth/login`
4. **Verify:** Try visiting your dashboard URL directly - should redirect to login

---

### Test 8: Duplicate Email Prevention ✅

1. Try registering with `student@test.com` again
2. **Expected:** Error message: "User with this email already exists"

---

### Test 9: Invalid Login ✅

1. Visit: http://localhost:3000/auth/login
2. Enter:
   - Email: `student@test.com`
   - Password: `wrongpassword`
3. **Expected:** Error message: "Invalid email or password"

---

### Test 10: Missing Required Fields ✅

1. Visit: http://localhost:3000/auth/register
2. Select **STUDENT** but leave institution name empty
3. Try to submit
4. **Expected:** Browser validation prevents submission
5. Fill institution, leave course empty
6. **Expected:** Same validation error

---

## 🔍 Database Verification

Check if profiles were created properly:

1. **Open Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```

2. **Check User table:**
   - Should see 3 users (student, industry, academician)
   - Verify `passwordHash` is bcrypt hash (not plain text)
   - Verify roles are correct

3. **Check StudentProfile table:**
   - Should have 1 record linked to student user
   - Verify institutionName, course, yearOfStudy

4. **Check IndustryProfile table:**
   - Should have 1 record linked to industry user
   - Verify companyName, industryType

5. **Check AcademicianProfile table:**
   - Should have 1 record linked to academician user
   - Verify institutionName, department, designation

---

## ✅ Success Criteria

All tests should pass:
- ✅ Register STUDENT, INDUSTRY, ACADEMICIAN with correct profile data
- ✅ Login with each role redirects to correct dashboard
- ✅ Logout clears session and redirects to login
- ✅ `/api/auth/me` returns user info when authenticated, 401 when not
- ✅ Role-based route protection works (STUDENT can't access /industry)
- ✅ Duplicate email registration is prevented
- ✅ Invalid credentials are rejected
- ✅ Passwords are hashed in database (never plain text)
- ✅ JWT stored in httpOnly cookie (not accessible via JavaScript)

---

## 🚀 What's Next

Authentication is complete! Now you can build:

1. **Student Features:**
   - Skill assessment system
   - Browse and apply to opportunities
   - Portfolio management
   - Application tracking

2. **Industry Features:**
   - Post opportunities (jobs/internships)
   - Review applications
   - Skill-based candidate matching

3. **Academician Features:**
   - View student progress
   - Consultation opportunities
   - Faculty development programs

---

## 📝 Notes

- **No OAuth/Social login** - Email/password only as requested
- **No password reset** - Can be added later
- **No email verification** - Can be added later
- **httpOnly cookies** - More secure than localStorage
- **Transaction-based** - User + Profile created atomically (rollback on error)
