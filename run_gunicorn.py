#!/usr/bin/env python
"""
OncoLearn - Railway/Heroku compatible startup script
Handles PORT environment variable directly without shell expansion
"""

import os
import sys

# Get port from environment variable (Railway/Heroku sets this)
port = os.environ.get('PORT', '5000')

# Defense: ensure port is a string and valid
try:
    port = str(int(port))
except (ValueError, TypeError):
    port = '5000'

# Get number of workers (default 4)
workers = os.environ.get('WEB_CONCURRENCY', '4')

# Build command
cmd = f'gunicorn -w {workers} -b 0.0.0.0:{port} --timeout 120 --access-logfile - --error-logfile - app:app'

print(f"\n✅ Starting OncoLearn on port {port}")
print(f"   Command: {cmd}\n")

# Execute gunicorn directly
os.execvp('gunicorn', cmd.split())
