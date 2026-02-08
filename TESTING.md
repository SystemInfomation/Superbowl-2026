# Testing Guide - Super Bowl LX (2026) Voting Application

## Overview
This document provides comprehensive testing instructions for the Super Bowl voting application.

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Web browser (Chrome, Firefox, Safari, Edge)

## Backend Testing

### 1. Setup and Installation
```bash
cd backend
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Start Backend Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Server running on port 4000
📊 Environment: development
```

### 4. Test API Endpoints

#### Health Check
```bash
curl http://localhost:4000/health
```
Expected: `{"status":"ok","timestamp":"..."}`

#### Get Root Info
```bash
curl http://localhost:4000/
```
Expected: JSON with API documentation

#### Get Vote Counts
```bash
curl http://localhost:4000/api/votes
```
Expected:
```json
{
  "patriots": 0,
  "seahawks": 0,
  "total": 0,
  "percentages": {
    "patriots": 0,
    "seahawks": 0
  }
}
```

#### Submit a Vote
```bash
curl -X POST http://localhost:4000/api/votes \
  -H "Content-Type: application/json" \
  -d '{"team":"patriots"}'
```
Expected:
```json
{
  "success": true,
  "message": "Vote recorded successfully!",
  "votes": {
    "patriots": 1,
    "seahawks": 0,
    "total": 1,
    "percentages": {
      "patriots": 100,
      "seahawks": 0
    }
  }
}
```

#### Test Invalid Team
```bash
curl -X POST http://localhost:4000/api/votes \
  -H "Content-Type: application/json" \
  -d '{"team":"invalid"}'
```
Expected: 400 error with validation message

### 5. MongoDB Verification
Check MongoDB Atlas dashboard to verify:
- [ ] Database `superbowl2026` created
- [ ] Collection `votes` created
- [ ] Vote documents are being inserted

## Frontend Testing

### 1. Setup and Installation
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Build Test
```bash
npm run build
```
Expected: Successful build with no errors

### 4. Start Development Server
```bash
npm run dev
```
Expected: Server running on `http://localhost:3000`

### 5. Manual UI Testing

#### Desktop View (1920x1080)
- [ ] Title "WHO WILL WIN SUPER BOWL LX?" is large and centered
- [ ] Countdown timer shows Days, Hours, Minutes, Seconds
- [ ] Two team cards side-by-side
- [ ] Patriots card: Navy/Red gradient with logo
- [ ] Seahawks card: Navy/Green gradient with logo
- [ ] Hover effects work (scale up, neon glow)
- [ ] Live results section shows vote counts
- [ ] Progress bar displays correctly
- [ ] Animated grid background visible
- [ ] Split gradient background (Patriots left, Seahawks right)

#### Tablet View (768x1024)
- [ ] Layout remains functional
- [ ] Team cards adjust size appropriately
- [ ] Countdown timer readable
- [ ] All text legible

#### Mobile View (375x667)
- [ ] Team cards stack vertically
- [ ] Touch targets large enough (minimum 44x44px)
- [ ] Countdown timer fits screen
- [ ] All content scrollable
- [ ] No horizontal overflow
- [ ] Progress bar works on narrow screen

### 6. Voting Flow Testing

#### Test Case 1: First Vote
1. Open application in browser
2. Clear localStorage: `localStorage.clear()`
3. Click on Patriots card
4. Expected:
   - [ ] Confetti animation appears
   - [ ] Toast notification: "Vote confirmed! 🎉"
   - [ ] Vote counts update immediately
   - [ ] Progress bar animates
   - [ ] Card becomes disabled/grayed out

#### Test Case 2: Duplicate Vote
1. Try to click on Seahawks card (after voting for Patriots)
2. Expected:
   - [ ] Toast notification: "You've already voted!"
   - [ ] No vote submitted
   - [ ] Cards remain disabled

#### Test Case 3: Real-time Updates
1. Open application in two browser windows
2. Vote in Window 1
3. Expected in Window 2 (within 5 seconds):
   - [ ] Vote counts update automatically
   - [ ] Progress bar updates
   - [ ] No need to refresh page

#### Test Case 4: Countdown Timer
1. Observe countdown timer
2. Expected:
   - [ ] Seconds count down continuously
   - [ ] Minutes decrement when seconds reach 0
   - [ ] Hours and days update correctly
   - [ ] Timer animates (scale effect on change)

#### Test Case 5: Voting Closed (After Kickoff)
Note: To test this before Feb 8, 2026, temporarily modify the KICKOFF_DATE in the code.

1. Set date/time to after kickoff
2. Expected:
   - [ ] "VOTING LOCKED" banner appears
   - [ ] Team cards are hidden or disabled
   - [ ] Confetti burst on countdown completion
   - [ ] Voting attempts return error

### 7. Browser Compatibility Testing

Test in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 8. Performance Testing

#### Lighthouse Audit
1. Open Chrome DevTools
2. Run Lighthouse audit
3. Target scores:
   - [ ] Performance: >90
   - [ ] Accessibility: >90
   - [ ] Best Practices: >90
   - [ ] SEO: >90

#### Network Throttling
1. Enable slow 3G in DevTools
2. Expected:
   - [ ] Page loads within reasonable time
   - [ ] Images lazy load
   - [ ] UI remains responsive

### 9. Accessibility Testing

- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Screen reader compatibility (VoiceOver, NVDA)
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] Semantic HTML structure

### 10. Security Testing

- [ ] CORS configured correctly (backend)
- [ ] No sensitive data in localStorage
- [ ] MongoDB credentials not exposed
- [ ] Input validation on vote submission
- [ ] Rate limiting (optional, for production)

## Integration Testing

### Full Flow Test
1. Start backend server
2. Start frontend development server
3. Open application in browser
4. Vote for a team
5. Verify vote in MongoDB Atlas
6. Check backend logs
7. Verify frontend updates
8. Test in different browsers
9. Test on mobile device

### Expected Results
- [ ] Vote saved to MongoDB
- [ ] Real-time updates work across devices
- [ ] No console errors
- [ ] Smooth animations
- [ ] Toast notifications appear correctly
- [ ] Countdown timer accurate

## Production Testing (After Deployment)

### Backend (Render/Railway)
- [ ] API endpoints accessible
- [ ] MongoDB connection successful
- [ ] CORS allows frontend origin
- [ ] SSL/HTTPS enabled
- [ ] Environment variables set correctly

### Frontend (Vercel/Netlify)
- [ ] Build successful
- [ ] Static assets served correctly
- [ ] Google Fonts load properly
- [ ] API requests reach backend
- [ ] Environment variables configured
- [ ] Custom domain (if applicable)

## Known Issues / Limitations

1. **Local Testing**: MongoDB Atlas requires internet connection
2. **DNS Resolution**: May not work in some sandboxed environments
3. **Rate Limiting**: No rate limiting implemented (add for production)
4. **IP Deduplication**: Currently commented out (optional feature)

## Troubleshooting

### Backend won't start
- Check MongoDB URI is correct
- Verify MongoDB Atlas IP whitelist includes your IP
- Check port 4000 is not already in use

### Frontend can't connect to backend
- Verify backend is running on correct port
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS settings in backend

### Votes not saving
- Check MongoDB Atlas connection
- Verify database user has write permissions
- Check backend logs for errors

### Images not loading
- Team logos use Wikimedia URLs (check internet connection)
- Verify Next.js image configuration in next.config.js

## Test Report Template

```
Test Date: ___________
Tester: ___________

Backend Tests:
[ ] API endpoints working
[ ] MongoDB connection successful
[ ] Vote submission works
[ ] Vote retrieval works

Frontend Tests:
[ ] UI displays correctly
[ ] Countdown timer works
[ ] Voting flow successful
[ ] Animations working
[ ] Responsive on mobile

Integration Tests:
[ ] End-to-end voting flow works
[ ] Real-time updates working
[ ] No console errors

Issues Found:
1. ___________
2. ___________

Overall Status: PASS / FAIL
```
