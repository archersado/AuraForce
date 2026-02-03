#!/bin/bash

# Test script for Files API Authentication Fix
# This script verifies that files API works correctly in development mode

echo "🧪 Testing Files API Authentication Fix"
echo "=========================================="
echo ""

# Check if development server is running
echo "📍 Checking if development server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running"
else
    echo "❌ Development server is not running!"
    echo "   Please start it with: npm run dev"
    exit 1
fi

echo ""
echo "🧪 Testing Files API Endpoints"
echo "=========================================="

# Test 1: List files
echo ""
echo "Test 1: GET /api/files/list"
response=$(curl -s http://localhost:3000/api/files/list)
if echo "$response" | grep -q '"files"'; then
    echo "✅ File list API works"
    echo "   Response: $(echo "$response" | jq -r '.files | length // "unknown"' 2>/dev/null) files found"
else
    echo "❌ File list API failed"
    echo "   Response: $response"
fi

# Test 2: Read a file
echo ""
echo "Test 2: GET /api/files/read?path=package.json"
response=$(curl -s "http://localhost:3000/api/files/read?path=package.json")
if echo "$response" | grep -q '"content"'; then
    echo "✅ File read API works"
else
    echo "❌ File read API failed"
    echo "   Response: $response"
fi

# Test 3: Get metadata
echo ""
echo "Test 3: GET /api/files/metadata?path=package.json"
response=$(curl -s "http://localhost:3000/api/files/metadata?path=package.json")
if echo "$response" | grep -q '"metadata"'; then
    echo "✅ File metadata API works"
else
    echo "❌ File metadata API failed"
    echo "   Response: $response"
fi

echo ""
echo "=========================================="
echo "✅ All tests completed!"
echo ""
echo "💡 Note: These tests work because authentication is skipped in development mode (NODE_ENV=development)"
echo "   In production mode, you would need to be authenticated."
