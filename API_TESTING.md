# API Testing and Endpoints Documentation

## Overview
This document provides comprehensive information about all API endpoints in the Super Bowl 2026 application and their test results.

## Base URL
- **Local Development**: `http://localhost:4000`
- **Production**: `https://superbowl-2026.onrender.com`

## System Status Endpoints

### GET `/health`
Quick health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-08T22:50:24.301Z"
}
```

**Status Code:** `200 OK`

---

### GET `/api/status`
Comprehensive system status including server info, database health, and memory usage.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-08T22:50:24.351Z",
  "uptime": 32.212,
  "environment": "development",
  "server": {
    "port": 4000,
    "nodeVersion": "v24.13.0",
    "platform": "linux",
    "memory": {
      "used": 23,
      "total": 35,
      "unit": "MB"
    }
  },
  "database": {
    "status": "connected",
    "test": "responsive",
    "totalVotes": 71
  },
  "endpoints": {
    "health": "/health",
    "status": "/api/status",
    "votes": "/api/votes",
    "voteStats": "/api/votes/stats",
    "game": "/api/game",
    "gameTest": "/api/game/test"
  }
}
```

**Status Code:** `200 OK`

---

## Voting Endpoints

### GET `/api/votes`
Get current vote counts for both teams.

**Response:**
```json
{
  "patriots": 36,
  "seahawks": 35,
  "total": 71,
  "percentages": {
    "patriots": 51,
    "seahawks": 49
  }
}
```

**Status Code:** `200 OK`

---

### POST `/api/votes`
Submit a new vote for a team.

**Request Body:**
```json
{
  "team": "patriots"  // or "seahawks"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Vote recorded successfully!",
  "votes": {
    "patriots": 36,
    "seahawks": 35,
    "total": 71,
    "percentages": {
      "patriots": 51,
      "seahawks": 49
    }
  }
}
```

**Status Code:** `201 Created`

**Error Responses:**

- Invalid team:
  ```json
  {
    "error": "Invalid team. Must be \"patriots\" or \"seahawks\""
  }
  ```
  **Status Code:** `400 Bad Request`

- Voting closed (after kickoff):
  ```json
  {
    "error": "Voting is closed. The game has started!"
  }
  ```
  **Status Code:** `403 Forbidden`

---

### GET `/api/votes/stats`
Get detailed voting statistics including recent votes and analytics.

**Response:**
```json
{
  "totals": {
    "patriots": 36,
    "seahawks": 35,
    "total": 71,
    "percentages": {
      "patriots": 51,
      "seahawks": 49
    }
  },
  "recent": [
    {
      "team": "patriots",
      "votedAt": "2026-02-08T22:48:55.682Z"
    }
    // ... up to 10 most recent votes
  ],
  "analytics": {
    "votesLast24Hours": 71,
    "averageVotesPerHour": 3
  }
}
```

**Status Code:** `200 OK`

---

### DELETE `/api/votes/reset`
Reset all votes (for testing and admin purposes).

**Response:**
```json
{
  "success": true,
  "message": "All votes have been reset",
  "deletedCount": 71
}
```

**Status Code:** `200 OK`

---

## Game Data Endpoints

### GET `/api/game`
Get real-time game data and scores from ESPN API.

**Pre-game Response:**
```json
{
  "gameStarted": false,
  "status": "PREGAME",
  "countdown": {
    "days": 0,
    "hours": 0,
    "minutes": 39,
    "seconds": 35
  }
}
```

**Live Game Response:**
```json
{
  "gameStarted": true,
  "eventId": "401772988",
  "status": "LIVE",
  "quarter": 2,
  "timeRemaining": "8:45",
  "teams": {
    "patriots": {
      "name": "New England Patriots",
      "abbreviation": "NE",
      "score": 14,
      "timeouts": 3,
      "possession": true,
      "record": "14-3",
      "logo": "https://...",
      "stats": { ... },
      "players": [ ... ]
    },
    "seahawks": { ... }
  },
  "fieldPosition": {
    "team": "patriots",
    "yardLine": 35
  },
  "down": 2,
  "yardsToGo": 7,
  "lastPlay": "...",
  "plays": [ ... ],
  "scoringPlays": [ ... ],
  "drives": { ... },
  "venue": { ... }
}
```

**Status Code:** `200 OK`

---

### GET `/api/game/test`
Test endpoint that returns game data structure information.

**Response:**
```json
{
  "success": true,
  "eventId": "401772988",
  "dataStructure": {
    "hasTeams": true,
    "hasPatriotsStats": true,
    "hasSeahawksStats": true,
    "patriotsPlayerCount": 10,
    "seahawksPlayerCount": 10,
    "hasScoringPlays": false,
    "scoringPlayCount": 0,
    "hasPlays": false,
    "playCount": 0,
    "hasDrives": true,
    "hasVenue": true,
    "hasWeather": false,
    "hasLeaders": true
  },
  "sampleData": {
    "patriots": {
      "name": "New England Patriots",
      "score": 0,
      "statsKeys": [ ... ],
      "samplePlayer": { ... }
    },
    "seahawks": { ... }
  }
}
```

**Status Code:** `200 OK`

---

## Running Tests

### Automated Test Suite

Run the comprehensive API test suite:

```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

**Expected Output:**
```
================================================
  Super Bowl 2026 API Comprehensive Test Suite
================================================

=== System Health Tests ===
Testing: Root endpoint ... ✓ PASS (HTTP 200)
Testing: Health check endpoint ... ✓ PASS (HTTP 200)
Testing: System status endpoint ... ✓ PASS (HTTP 200)

=== Vote Endpoints Tests ===
Testing: Get vote counts ... ✓ PASS (HTTP 200)
Testing: Get vote statistics ... ✓ PASS (HTTP 200)
Testing: Vote for Patriots ... ✓ PASS (HTTP 201)
Testing: Vote for Seahawks ... ✓ PASS (HTTP 201)
Testing: Invalid team (should fail) ... ✓ PASS (HTTP 400)
Testing: Missing team (should fail) ... ✓ PASS (HTTP 400)

=== Game Endpoints Tests ===
Testing: Get game data ... ✓ PASS (HTTP 200)
Testing: Get game test data ... ✓ PASS (HTTP 200)

=== Edge Cases & Error Handling ===
Testing: Non-existent endpoint (should 404) ... ✓ PASS (HTTP 404)

================================================
  Test Results Summary
================================================
Passed: 12
Failed: 0

✓ All tests passed!
```

### Manual Testing

You can also test individual endpoints using `curl`:

```bash
# Health check
curl http://localhost:4000/health

# System status
curl http://localhost:4000/api/status

# Get votes
curl http://localhost:4000/api/votes

# Submit a vote
curl -X POST http://localhost:4000/api/votes \
  -H "Content-Type: application/json" \
  -d '{"team":"patriots"}'

# Get vote statistics
curl http://localhost:4000/api/votes/stats

# Get game data
curl http://localhost:4000/api/game

# Test game data
curl http://localhost:4000/api/game/test
```

---

## Frontend Updates

### Polling Interval
The frontend now polls the backend API **every 3 seconds** for real-time updates:

- **File**: `frontend/components/Providers.tsx`
  - Changed `refetchInterval` from `10 * 1000` to `3 * 1000`
  - Changed `staleTime` from `8 * 1000` to `2 * 1000`

- **File**: `frontend/app/page.tsx`
  - Changed `refetchInterval` from `5 * 1000` to `3 * 1000`

- **File**: `frontend/components/ConnectionStatus.tsx`
  - Updated display text from "Updates every 5s" to "Updates every 3s"

---

## Testing Checklist

- [x] All 12 API endpoints tested and passing
- [x] Health check endpoints functional
- [x] Vote submission and retrieval working
- [x] Vote statistics and analytics working
- [x] Game data endpoints returning correct structure
- [x] Error handling for invalid requests working
- [x] 404 handling for non-existent endpoints working
- [x] Frontend builds successfully
- [x] Polling interval updated to 3 seconds
- [x] Connection status display updated

---

## Notes

- The backend server runs on port 4000 by default
- MongoDB connection is tested as part of the `/api/status` endpoint
- All endpoints support CORS for frontend communication
- The system automatically handles timezone conversions for game timing
- Vote submission includes IP hashing for basic fraud prevention
