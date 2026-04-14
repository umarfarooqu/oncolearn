#!/bin/bash
# OncoLearn - Railway/Heroku compatible startup script
# Simple shell wrapper for gunicorn PORT handling

set -e

# Get PORT from environment or use default
PORT=${PORT:-5000}
WEB_CONCURRENCY=${WEB_CONCURRENCY:-4}

echo ""
echo "✅ OncoLearn - Breast Cancer Education Platform"
echo "   Starting with:"
echo "   - PORT: $PORT"
echo "   - Workers: $WEB_CONCURRENCY"
echo ""

# Run gunicorn with proper port handling
exec gunicorn \
  -w "$WEB_CONCURRENCY" \
  -b "0.0.0.0:$PORT" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile - \
  app:app
