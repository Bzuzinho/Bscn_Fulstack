#!/bin/bash

# Script to test CORS configuration on a storage bucket
# Usage: ./scripts/test-cors.sh <bucket-url>

set -e

BUCKET_URL="${1:-}"

if [ -z "$BUCKET_URL" ]; then
  echo "Usage: $0 <bucket-url>"
  echo "Example: $0 https://storage.googleapis.com/my-bucket/test"
  exit 1
fi

echo "Testing CORS configuration for: $BUCKET_URL"
echo "================================================"
echo ""

# Test 1: Preflight request (OPTIONS)
echo "Test 1: Checking preflight (OPTIONS) request..."
PREFLIGHT_RESPONSE=$(curl -s -i -X OPTIONS "$BUCKET_URL" \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: Content-Type" \
  2>&1 || true)

echo "$PREFLIGHT_RESPONSE" | grep -i "access-control" || echo "❌ No CORS headers found in preflight response"
echo ""

# Test 2: Check if ETag header is exposed
if echo "$PREFLIGHT_RESPONSE" | grep -i "access-control-expose-headers" | grep -i "etag" > /dev/null; then
  echo "✓ ETag header is properly exposed"
else
  echo "❌ ETag header is NOT exposed - this will cause upload failures!"
  echo "   Add 'ETag' to Access-Control-Expose-Headers in your CORS configuration"
fi
echo ""

# Test 3: Check allowed methods
if echo "$PREFLIGHT_RESPONSE" | grep -i "access-control-allow-methods" | grep -i "PUT" > /dev/null; then
  echo "✓ PUT method is allowed"
else
  echo "❌ PUT method is NOT allowed"
fi
echo ""

# Test 4: Check allowed origins
if echo "$PREFLIGHT_RESPONSE" | grep -i "access-control-allow-origin" > /dev/null; then
  ALLOWED_ORIGIN=$(echo "$PREFLIGHT_RESPONSE" | grep -i "access-control-allow-origin" | cut -d' ' -f2 | tr -d '\r')
  echo "✓ CORS is configured"
  echo "  Allowed origin: $ALLOWED_ORIGIN"
else
  echo "❌ No Access-Control-Allow-Origin header found"
  echo "   CORS is not configured on this bucket!"
fi
echo ""

echo "================================================"
echo "Summary:"
echo ""
echo "For profile image uploads to work, ensure:"
echo "1. PUT method is allowed"
echo "2. ETag header is exposed"
echo "3. Your application's origin is in the allowed origins list"
echo ""
echo "See docs/S3_CORS_SETUP.md for configuration instructions."
