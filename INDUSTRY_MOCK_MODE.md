# Industry Mock Mode Implementation

## Overview
This document explains the localStorage-based mock mode implementation for the Industry flow, which allows the application to work without database connectivity.

## How It Works

### API Layer (Backend)
All industry API endpoints check for `MOCK_MODE=true` in environment variables:

1. **POST /api/industry/opportunities** - Creates opportunity
   - Returns `useMockStorage: true` flag to signal client-side storage
   - Returns the submitted data with a generated ID

2. **GET /api/industry/opportunities** - Lists opportunities
   - Returns `useMockStorage: true` flag
   - Client loads from localStorage instead

3. **GET /api/industry/opportunities/[id]** - Gets opportunity detail
   - Returns `useMockStorage: true` flag with the requested ID
   - Client loads from localStorage instead

4. **PATCH /api/industry/opportunities/[id]** - Updates opportunity
   - Returns `useMockStorage: true` flag with updates
   - Client updates localStorage

5. **GET /api/industry/opportunities/[id]/candidates** - Lists applicants
   - Returns empty array (no applications in mock mode yet)

6. **PATCH /api/industry/applications/[id]** - Updates application status
   - Returns `useMockStorage: true` flag
   - Client would update localStorage (when applications exist)

### Frontend Layer (Client)
Frontend pages detect `useMockStorage: true` and interact with localStorage:

1. **Create Opportunity** (`/industry/opportunities/new`)
   - After POST succeeds, checks for `useMockStorage` flag
   - Stores opportunity in `industry_opportunities` localStorage key
   - Enriches data with skill names before storing

2. **List Opportunities** (`/industry/opportunities`)
   - After GET succeeds, checks for `useMockStorage` flag
   - Loads from `industry_opportunities` localStorage
   - Formats data for display

3. **Opportunity Detail** (`/industry/opportunities/[id]`)
   - After GET succeeds, checks for `useMockStorage` flag
   - Loads specific opportunity from localStorage by ID
   - Shows "Opportunity not found" if not in localStorage

4. **Update Opportunity Status**
   - After PATCH succeeds, checks for `useMockStorage` flag
   - Updates the specific opportunity in localStorage
   - Refreshes UI with new status

## localStorage Schema

### Key: `industry_opportunities`
```json
[
  {
    "id": "mock-opp-1234567890",
    "title": "Full Stack Developer Internship",
    "description": "We are looking for...",
    "type": "INTERNSHIP",
    "status": "OPEN",
    "location": "Mumbai, India",
    "isRemote": true,
    "deadline": "2024-12-31",
    "domain": "TECHNOLOGY",
    "fieldId": "field-123",
    "postedAt": "2024-01-15T10:30:00.000Z",
    "requiredSkills": [
      {
        "skillId": "skill-1",
        "skillName": "React",
        "minProficiency": 3
      },
      {
        "skillId": "skill-2",
        "skillName": "Node.js",
        "minProficiency": 3
      }
    ]
  }
]
```

## Testing the Flow

1. **Login as Industry User**
   - Email: `company@test.com`
   - Password: `password123`

2. **Create an Opportunity**
   - Navigate to `/industry/opportunities/new`
   - Fill in the form (3 steps)
   - Submit
   - Check browser console for "🔧 MOCK MODE" logs
   - Check localStorage: `industry_opportunities` should have 1 item

3. **View Opportunities List**
   - Navigate to `/industry/opportunities`
   - Should see the created opportunity
   - Check console logs

4. **View Opportunity Detail**
   - Click on an opportunity
   - Should see full details with skills
   - Check console logs

5. **Toggle Status**
   - Click "Close Applications" or "Reopen Applications"
   - Status should update in UI
   - Check localStorage to confirm update persisted

## Known Limitations in Mock Mode

1. **No Student Applications**
   - Student application feature doesn't exist yet
   - Candidates tab will always be empty
   - `applicantCount` is always 0

2. **No Cross-User Data**
   - Each browser instance has its own localStorage
   - Industry users on different machines won't see each other's opportunities
   - This is expected for development/testing

3. **No Validation Against Database**
   - Field IDs and Skill IDs are not validated
   - They're stored as provided

4. **Manual Data Cleanup**
   - To reset: `localStorage.removeItem('industry_opportunities')`
   - Or use browser DevTools → Application → Local Storage → Clear

## Console Debugging

All mock mode operations log to console with `🔧 MOCK MODE:` prefix:
- Operation being performed
- Data being stored/loaded
- Keys and counts

## Next Steps

To complete the industry flow in mock mode:

1. **Build Student Application Feature**
   - Create `/student/opportunities/[id]` detail page with "Apply" button
   - Create `POST /api/student/applications` endpoint
   - Store applications in localStorage
   - Then candidates tab will show data

2. **Add Application Management**
   - Update candidates API to load from localStorage
   - Update status change handler to persist to localStorage

3. **Add Analytics/Stats**
   - Dashboard should aggregate localStorage data
   - Total opportunities, applicants, etc.
