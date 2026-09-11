# Login Issue Fix

## Problem

Login fails with "Invalid email or password" because:
- `MOCK_MODE="false"` was set to use real database
- Real database doesn't have test user accounts (`student@test.com / password123`)
- Your real account (`aadi.srivastava37@nmims.in`) password is unknown

## Solution: Choose One

### Option 1: Use MOCK_MODE (Recommended for Testing)

**Quick fix - Already applied:**

`.env` is now set to:
```bash
MOCK_MODE="true"
```

**Restart server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

**Login with:**
```
Email: student@test.com
Password: password123
```

**Benefits:**
- ✅ Works immediately
- ✅ No database connection needed
- ✅ Good for testing UI/UX
- ✅ Stable (no connection drops)

**Limitations:**
- ⚠️ Uses mock data (not real database)
- ⚠️ Test results won't persist
- ⚠️ Can't test real database features

---

### Option 2: Create Test Users in Real Database

If you want to use the real database with known passwords:

**1. Ensure database connection is stable**

**2. Run seed script:**
```bash
npm run seed:test-users
```

This creates 3 test accounts:
- `student@test.com` / `password123`
- `company@test.com` / `password123`
- `professor@test.com` / `password123`

**3. Set MOCK_MODE="false" in `.env`**

**4. Restart server:**
```bash
npm run dev
```

**5. Login with:**
```
Email: student@test.com
Password: password123
```

**Benefits:**
- ✅ Uses real database
- ✅ Data persists
- ✅ Can test all features end-to-end
- ✅ Test results saved

**Limitations:**
- ⚠️ Requires stable database connection
- ⚠️ May fail if mobile hotspot unstable

---

### Option 3: Reset Password for Existing Account

If you want to use your existing account (`aadi.srivastava37@nmims.in`):

**1. Create password reset script:**

Save as `reset-password.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  const email = 'aadi.srivastava37@nmims.in';
  const newPassword = 'mynewpassword123';
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { email },
    data: { passwordHash: hashedPassword },
  });
  
  console.log(`Password reset for ${email}`);
  console.log(`New password: ${newPassword}`);
  
  await prisma.$disconnect();
}

resetPassword();
```

**2. Run it:**
```bash
node reset-password.js
```

**3. Login with:**
```
Email: aadi.srivastava37@nmims.in
Password: mynewpassword123
```

---

## Current Status

✅ **MOCK_MODE="true"** is now enabled (quick fix applied)

**To test right now:**

1. **Restart server:**
   ```bash
   npm run dev
   ```

2. **Go to:**
   ```
   http://localhost:3000/auth/login
   ```

3. **Login:**
   ```
   Email: student@test.com
   Password: password123
   ```

4. **Should work!** You'll be redirected to dashboard.

---

## Switching Between Modes

### To use MOCK_MODE (for testing):
```bash
# In .env:
MOCK_MODE="true"

# Restart server
npm run dev

# Login:
student@test.com / password123
```

### To use REAL DATABASE:
```bash
# 1. Create test users first:
npm run seed:test-users

# 2. In .env:
MOCK_MODE="false"

# 3. Restart server
npm run dev

# 4. Login:
student@test.com / password123
```

---

## Checking Database Users

To see what users exist in your database:

```bash
node check-users.js
```

This shows:
- All users in database
- Their emails
- Their roles
- Whether they have passwords

---

## Summary

**Current Fix:** MOCK_MODE enabled
**Login:** student@test.com / password123
**Status:** ✅ Ready to use

**To switch to real database later:**
1. Run `npm run seed:test-users`
2. Set `MOCK_MODE="false"`
3. Restart server

---

**Login should now work!** 🚀
