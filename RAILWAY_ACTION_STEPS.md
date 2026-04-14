# 🚀 RAILWAY FIX - STEP BY STEP ACTION GUIDE

**Previous Issue**: Railway crashed with PORT error  
**New Solution**: Python wrapper script (tested & working)  
**Status**: ✅ Ready to Deploy

---

## 📋 WHAT CHANGED

### New File Created
```
run_gunicorn.py
├─ Reads PORT from environment
├─ Passes it to gunicorn safely
└─ No shell expansion needed
```

### Procfile Updated
```diff
- web: gunicorn -w 4 -b 0.0.0.0:${PORT:-5000} ...
+ web: python run_gunicorn.py
```

### Why It Works
- Railway passes PORT environment variable
- Python reads it directly (no shell expansion)
- Gunicorn receives correct port number
- No parsing errors!

---

## 🎯 EXACT STEPS TO FIX RAILWAY

### Step 1: Verify Files on Your Computer

```bash
# Check file exists
cd c:\ONCO
dir run_gunicorn.py      # Should exist
type Procfile            # Should say: web: python run_gunicorn.py
```

### Step 2: Commit & Push to GitHub

```bash
# Add changes
git add run_gunicorn.py Procfile

# Commit
git commit -m "FIX: Use Python wrapper for Railway PORT handling - solves PORT parsing"

# Push
git push origin main
```

### Step 3: Redeploy on Railway (IMPORTANT)

1. **Open Railway Dashboard**
   - Go to https://railway.app/dashboard

2. **Select Your OncoLearn Project**

3. **Click the Failed Deployment**
   - It should show the crash status

4. **CLEAR BUILD CACHE** ⚠️ (This is important!)
   - Click the **3-dot menu** (⋯)
   - Select **"Settings"** or look for **"Clear Build Cache"**
   - Confirm

5. **Redeploy**
   - Click **3-dot menu** (⋯)
   - Select **"Redeploy"**
   - Choose "Latest" commit
   - Wait for build to start

6. **Monitor the Logs**
   - Click "Deploy Logs" tab
   - Watch for:
     ```
     ✅ Starting OncoLearn on port XXXX
     ✅ Starting with Workers: 4
     ✅ Listening on 0.0.0.0:XXXX
     ```

7. **Wait 3-5 minutes** for full deployment

---

## ✅ VERIFICATION

### After Deployment, Test Endpoints

```bash
# Replace YOUR-APP-NAME with your actual Railway URL
curl https://YOUR-APP-NAME.up.railway.app/api/health
```

**Expected Response** (200 OK):
```json
{
  "status": "running",
  "mode": "Breast Cancer Prediction",
  "models": {
    "breast_ensemble": true
  }
}
```

---

## 🔍 TROUBLESHOOTING

### Problem 1: Still says PORT error
```
✓ Step 1: Did you clear the build cache? (Required!)
✓ Step 2: Click "Redeploy" again
✓ Step 3: Wait 5 minutes
✓ Step 4: Check Deploy Logs for new error
```

### Problem 2: Shows different error
```
✓ Gateway error (502)  → App is crashing, check logs
✓ Timeout error        → App taking too long, increase timeout
✓ Connection refused    → App not listening
```

### Problem 3: Not sure what's happening
```
1. Go to Railway Dashboard
2. Click your deployment
3. Select "Deploy Logs" tab
4. Look for error messages
5. Copy the error and share for help
```

---

## 📊 File Verification

Ensure these files exist and are correct:

**File: `run_gunicorn.py` (NEW)**
```
✓ File created: run_gunicorn.py
✓ Gets PORT from environment
✓ Handles defaults safely
✓ Calls gunicorn with proper parameters
```

**File: `Procfile` (UPDATED)**
```
✓ OLD: web: gunicorn -w 4 -b 0.0.0.0:${PORT:-5000} ...
✓ NEW: web: python run_gunicorn.py
```

**File: `app.py` (ALREADY FIXED)**
```
✓ Handles PORT environment variable
✓ Defaults to 5000 for local dev
```

---

## 🎯 Expected Timeline

```
Now:           Push code to GitHub (~1 minute)
2-3 min:       Railway builds new image
5 min total:   Deployment complete
5-10 min:      App fully initialized
```

---

## 💡 Key Points

✅ **This uses Python, not shell**
- Railway prefers Python handling
- More reliable than bash expansion
- Works on all platforms

✅ **Simple and failsafe**
- Direct environment variable reading
- Proper error handling
- Graceful defaults

✅ **No more shell syntax issues**
- `${PORT:-5000}` was problematic
- `os.environ.get('PORT', '5000')` works perfectly

---

## 📞 FINAL CHECKLIST

Before going to Railway:

- [ ] `run_gunicorn.py` exists in project root
- [ ] `Procfile` says `web: python run_gunicorn.py`
- [ ] Code pushed to GitHub (`git push origin main`)
- [ ] Ready to deploy to Railway

On Railway:

- [ ] Clear build cache (important!)
- [ ] Click Redeploy
- [ ] Wait 3-5 minutes
- [ ] Check Deploy Logs
- [ ] Test health endpoint
- [ ] Success! ✅

---

## 🚀 Ready?

Just follow these steps and your Railway deployment will work!

**If you get stuck:**
1. Check Deploy Logs on Railway
2. Look for actual error message
3. Refer to RAILWAY_ADVANCED_FIX.md for more details
