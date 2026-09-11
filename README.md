# Academia-Industry Collaboration Portal
Smart India Hackathon 2026 - Problem Statement: SIH26044

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ installed and running

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the example env file
copy .env.example .env

# Edit .env and set your actual DATABASE_URL and JWT_SECRET
```

### 3. Set Up Database
```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables (when migrations are added)
# npx prisma migrate dev
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Verify Health Check
Visit [http://localhost:3000/api/health](http://localhost:3000/api/health) to verify backend + database connection.

## Project Structure
```
/app
  /student          # Student role pages
  /industry         # Industry role pages
  /academician      # Academician role pages
  /auth             # Authentication pages
  /shared           # Shared components
  /api              # API routes
/prisma             # Database schema
/lib                # Utility functions
/public             # Static assets
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)

## Authentication System

### ✅ Implemented Features:
- Email + password authentication
- JWT tokens stored in httpOnly cookies
- Password hashing with bcrypt
- Role-based access control (STUDENT, INDUSTRY, ACADEMICIAN)
- Protected routes with middleware
- Transaction-based user + profile creation

### API Endpoints:
- `POST /api/auth/register` - Register new user with role-specific profile
- `POST /api/auth/login` - Login and receive JWT cookie
- `POST /api/auth/logout` - Clear authentication cookie
- `GET /api/auth/me` - Get current user info

### Protected Routes:
- `/student` - STUDENT role only
- `/industry` - INDUSTRY role only
- `/academician` - ACADEMICIAN role only

### Testing Authentication:

**Start the dev server:**
```bash
npm run dev
```

**Manual Testing Flow:**

1. **Register a STUDENT:**
   - Visit http://localhost:3000/auth/register
   - Select "STUDENT" role
   - Fill in: institution, course, year of study
   - Submit → Should redirect to /student dashboard

2. **Register an INDUSTRY user:**
   - Visit http://localhost:3000/auth/register (in a new incognito window)
   - Select "INDUSTRY" role
   - Fill in: company name, industry type
   - Submit → Should redirect to /industry dashboard

3. **Register an ACADEMICIAN:**
   - Visit http://localhost:3000/auth/register (in another incognito window)
   - Select "ACADEMICIAN" role
   - Fill in: institution, department, designation
   - Submit → Should redirect to /academician dashboard

4. **Test Login:**
   - Logout from any dashboard
   - Visit http://localhost:3000/auth/login
   - Login with any registered email
   - Should redirect to role-specific dashboard

5. **Test Role-Based Access Control:**
   - Login as STUDENT
   - Try to visit http://localhost:3000/industry
   - Should redirect to /unauthorized page ✅

6. **Test /api/auth/me:**
   - While logged in, visit http://localhost:3000/api/auth/me
   - Should return your user info (no password)

## Next Steps
1. ✅ Project skeleton initialized
2. ✅ Database schema created (13 tables)
3. ✅ Authentication & role-based access implemented
4. ⏳ Build student features (skill assessment, applications)
5. ⏳ Build industry features (opportunity posting)
6. ⏳ Build academician features
