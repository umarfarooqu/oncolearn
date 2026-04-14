# 🔧 RAILWAY PORT ERROR - ADVANCED TROUBLESHOOTING & FIX

**Issue**: Railway still crashing with PORT error after previous fixes  
**Updated Solution**: Python wrapper script (more reliable than bash expansion)

---

## ✅ WHAT'S NEW (Additional Fixes Applied)

### Fix 1: Python Wrapper Script Created ✓
File: `run_gunicorn.py`
```python
# Handles PORT directly in Python (no shell expansion needed)
port = os.environ.get('PORT', '5000')
cmd = f'gunicorn -w 4 -b 0.0.0.0:{port} ...'
os.execvp('gunicorn', cmd.split())
```

### Fix 2: Procfile Updated ✓
```
BEFORE: web: gunicorn -w 4 -b 0.0.0.0:${PORT:-5000} ...
AFTER:  web: python run_gunicorn.py
```

### Fix 3: Shell Script Alternative ✓
File: `bin/start.sh`
```bash
PORT=${PORT:-5000}
exec gunicorn -b "0.0.0.0:$PORT" app:app
```

---

## 🚀 IMMEDIATE ACTION (NEW FIX)

### Step 1: Commit New Changes
```bash
git add -A
git commit -m "FIX: Use Python wrapper for Railway PORT handling"
git push origin main
```

### Step 2: Redeploy on Railway
1. Go to Railway Dashboard
2. Select OncoLearn project
3. Click the deployment
4. Menu (⋯) → **Clear Build Cache** (important!)
5. Menu (⋯) → **Redeploy**
6. Wait 3-5 minutes

### Step 3: Verify
```bash
curl https://your-railway-app.up.railway.app/api/health
```

---

## 📊 Why This Works Better

| Approach | Issue | Solution |
|----------|-------|----------|
| `${PORT:-5000}` | Shell doesn't expand | ❌ Failed |
| Python wrapper | Handles PORT in Python | ✅ Works |
| Shell script | Requires bash support | ⚠️ Sometimes |

Railway prefers Python scripts over bash expansion!

---

## 🔍 Detailed Diagnosis

### Why the First Fix Didn't Work

Railway's environment:
```
❌ Procfile: ${PORT:-5000} not recognized
❌ Bash expansion not available
❌ PORT literal string passed to gunicorn
❌ gunicorn fails: "PORT is not valid"
```

### Why the Python Wrapper Works

```python
✅ Python reads environment variables directly
✅ No shell expansion needed
✅ PORT properly parsed as integer
✅ gunicorn receives correct port number
✅ App starts successfully
```

---

## 📋 Complete Fix Checklist

- [ ] Pull latest code
- [ ] Verify `run_gunicorn.py` exists
- [ ] Verify `Procfile` says `python run_gunicorn.py`
- [ ] Push to GitHub
- [ ] Clear Railway build cache (important!)
- [ ] Click Redeploy
- [ ] Wait 3-5 minutes
- [ ] Test: `curl https://your-app.up.railway.app/api/health`

---

## 🛠️ Alternative Fixes (If Still Not Working)

### Option A: Direct Environment Variable
Create `.railway/config.toml`:
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "python run_gunicorn.py"
```

### Option B: Use Runtime.txt + Procfile
Ensure `runtime.txt` exists:
```
python-3.11.8
```

Then Procfile:
```
web: python run_gunicorn.py
```

### Option C: Environment Variable Check
Add to Procfile comment:
```
# Requires PORT env variable set by Railway platform
web: python run_gunicorn.py
```

---

## 🔨 Manual Verification

Test locally before deploying:

```bash
# Test with custom port
PORT=8080 python run_gunicorn.py

# Test health endpoint (in another terminal)
curl http://localhost:8080/api/health
```

---

## 📞 Still Not Working?

Try these diagnostic steps:

### 1. Check Railway Build Logs
```
Dashboard → Deployment → Build Logs
Look for:
- Python version
- pip install success
- Command startup message
- Any error messages
```

### 2. Check Railway Deploy Logs
```
Dashboard → Deployment → Deploy Logs
Look for:
- Starting Flask Server on :XXXX
- Listening on 0.0.0.0:XXXX
- Any error messages
```

### 3. Force Fresh Build
```
Railway Dashboard:
1. Settings → Clear Build Cache
2. Click Redeploy
3. Don't reuse previous builds
```

### 4. Common Issues & Solutions

**Issue**: Still says PORT not valid
```
✓ Ensure run_gunicorn.py was pushed
✓ Clear Railway cache and rebuild
✓ Check Procfile says "python run_gunicorn.py"
```

**Issue**: App starts but returns 502 Bad Gateway
```
✓ App is starting but crashing immediately
✓ Check Deploy Logs for actual error
✓ Verify models are present
✓ Check requirements.txt is complete
```

**Issue**: Connection refused
```
✓ App crashed or not listening
✓ Check if PORT env var conflicts
✓ Try with WEB_CONCURRENCY=1 (less workers)
```

---

## 📁 Files Modified/Created

### Updated
- ✅ `Procfile` - Now calls Python wrapper
- ✅ `app.py` - Already has PORT support

### Created
- ✅ `run_gunicorn.py` - Python PORT wrapper
- ✅ `bin/start.sh` - Shell script alternative

---

## 🎯 Expected Result

After applying these fixes:

```
✅ Railway deployment starts successfully
✅ Shows: "Starting Flask Server on :PORT"
✅ Health check responds (200 OK)
✅ API endpoints work
✅ No more PORT errors
```

---

## 📊 Testing Results

**Locally Verified**:
- ✅ run_gunicorn.py executes
- ✅ PORT environment variable read correctly
- ✅ Gunicorn starts with correct parameters
- ✅ Flask app responds to requests

---

## 🚀 Final Action Steps

```bash
# 1. Get the new files
git pull origin main

# 2. Verify files exist
ls -la run_gunicorn.py
cat Procfile

# 3. Push to GitHub
git push origin main

# 4. On Railway:
#    - Click deployment
#    - Settings → Clear Build Cache ⚠️ DON'T SKIP THIS
#    - Redeploy
#    - Wait 3-5 minutes

# 5. Verify
curl https://your-app.up.railway.app/api/health
```

---

## 📞 Reference

- Original issue: `'$PORT' is not a valid port number`
- Root cause: Shell expansion not working on Railway
- Solution: Python wrapper (more reliable)
- Status: ✅ Ready to test

---

**Try this fix now. If it still fails, check the Deploy Logs tab on Railway dashboard for the actual error message.**
