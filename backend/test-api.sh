#!/bin/bash

# Super Bowl 2026 API Test Script
# Tests all API endpoints to ensure they're working correctly

BASE_URL="http://localhost:4000"
PASS=0
FAIL=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "================================================"
echo "  Super Bowl 2026 API Comprehensive Test Suite"
echo "================================================"
echo ""

# Helper function to test endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local expected_status=$3
  local description=$4
  local data=$5
  
  echo -n "Testing: $description ... "
  
  if [ "$method" == "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
  elif [ "$method" == "POST" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data")
  elif [ "$method" == "DELETE" ]; then
    response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL$endpoint")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
    ((PASS++))
  else
    echo -e "${RED}✗ FAIL${NC} (Expected HTTP $expected_status, got HTTP $http_code)"
    echo "  Response: $body"
    ((FAIL++))
  fi
}

echo "=== System Health Tests ==="
test_endpoint "GET" "/" "200" "Root endpoint"
test_endpoint "GET" "/health" "200" "Health check endpoint"
test_endpoint "GET" "/api/status" "200" "System status endpoint"
echo ""

echo "=== Vote Endpoints Tests ==="
test_endpoint "GET" "/api/votes" "200" "Get vote counts"
test_endpoint "GET" "/api/votes/stats" "200" "Get vote statistics"
test_endpoint "POST" "/api/votes" "201" "Vote for Patriots" '{"team":"patriots"}'
test_endpoint "POST" "/api/votes" "201" "Vote for Seahawks" '{"team":"seahawks"}'
test_endpoint "POST" "/api/votes" "400" "Invalid team (should fail)" '{"team":"invalid"}'
test_endpoint "POST" "/api/votes" "400" "Missing team (should fail)" '{}'
echo ""

echo "=== Game Endpoints Tests ==="
test_endpoint "GET" "/api/game" "200" "Get game data"
test_endpoint "GET" "/api/game/test" "200" "Get game test data"
echo ""

echo "=== Edge Cases & Error Handling ==="
test_endpoint "GET" "/api/nonexistent" "404" "Non-existent endpoint (should 404)"
echo ""

echo "================================================"
echo "  Test Results Summary"
echo "================================================"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed!${NC}"
  exit 1
fi
