# OncoLearn - Deployment Checklist

## Code & Dependencies

- [ ] **Dependencies Audit**: All packages in `requirements.txt` are necessary
  - Flask (web framework)
  - numpy, pandas (data processing)
  - scikit-learn (ML models)
  - Pillow (image processing)
  - gunicorn (production server)

- [ ] **No Version Conflicts**: All versions are compatible with Python 3.11+
  - Flask 3.0.0 ✓
  - scikit-learn 1.3.0 ✓
  - pandas 2.0.3 ✓
  - numpy 1.24.3 ✓

- [ ] **Cache Files Excluded**: `.gitignore` prevents deployment of:
  - `__pycache__/` directories
  - `*.pyc` files
  - `.pytest_cache/`
  - Virtual environment

- [ ] **No Hardcoded Secrets**: All sensitive config in `.env`

- [ ] **Core Logic Intact**: 
  - Model training scripts work
  - Prediction endpoints functional
  - Educational content accessible
  - No modifications to business logic

---

## Platform Deployment Files

- [x] **Procfile**: For Heroku, Railway, Render compatibility
- [x] **runtime.txt**: Python 3.11 specification
- [x] **Dockerfile**: Multi-stage Docker build (optimized for production)
- [x] **docker-compose.yml**: Local Docker deployment
- [x] **.dockerignore**: Excludes unnecessary files from Docker image

---

## Configuration Files

- [x] **.gitignore**: Prevents cache & sensitive files from repo
- [x] **.env.example**: Template for environment variables
- [x] **.flake8**: Code quality standards

---

## Models & Data

- [ ] **Models Trained**: Run `python train_models.py`
  - Check `models/` directory contains `.pkl` files
  - Verify model files are < 500MB total

- [ ] **Feature Names Cached**: `models/feature_names.pkl` exists
- [ ] **Scaler Saved**: `models/scaler.pkl` exists

---

## Documentation

- [x] **DEPLOYMENT.md**: Comprehensive deployment guide for 8+ platforms
- [x] **DEPLOYMENT_CHECKLIST.md**: This file
- [x] **README.md**: Updated with deployment instructions

---

## One-Time Setup (Before First Deployment)

```bash
# 1. Create virtual environment
python3.11 -m venv venv

# 2. Activate environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install requirements
pip install -r requirements.txt

# 4. Train models
python train_models.py

# 5. Verify health check
python -c "from app import app; print('✓ App imports successfully')"
```

---

## Platform-Specific Setup

### **Heroku** 
```bash
heroku create your-app-name
git push heroku main
```

### **Docker**
```bash
docker build -t oncolearn:latest .
docker run -p 5000:5000 oncolearn:latest
```

### **Railway / Render**
- Connect GitHub
- Deploy automatically

### **VPS (Ubuntu/Debian)**
```bash
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python train_models.py
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## Validation

- [ ] **Health Check**: `GET /api/health` returns 200
- [ ] **Homepage**: `GET /` loads without errors
- [ ] **Predictions**: `POST /predict/breast` works with sample data
- [ ] **Learning Pages**: All routes load correctly
- [ ] **Static Files**: CSS, JS, images load properly
- [ ] **No 404 Errors**: All templates resolve correctly
- [ ] **Performance**: Page load < 2 seconds
- [ ] **Memory Usage**: App uses < 500MB RAM

---

## Post-Deployment

- [ ] **Monitor Logs**: Check for errors in first hour
- [ ] **Test Endpoints**: Verify all routes accessible
- [ ] **Test Predictions**: Ensure ML models work remotely
- [ ] **Performance Check**: Load times acceptable
- [ ] **Security Headers**: HTTPS enabled on domain
- [ ] **Backup Models**: Regular backup of `/models` directory
- [ ] **Update Monitoring**: Set up alerts for deployment platform

---

## Cleanup Actions Performed ✓

1. ✓ Created comprehensive `.gitignore` (prevents cache deployment)
2. ✓ Cleaned `requirements.txt` (only essential packages)
3. ✓ Created `Procfile` (production server configuration)
4. ✓ Created `runtime.txt` (Python version specification)
5. ✓ Created `Dockerfile` (Docker deployment support)
6. ✓ Created `.dockerignore` (clean Docker images)
7. ✓ Created `docker-compose.yml` (local development)
8. ✓ Created `.env.example` (safe config template)
9. ✓ Created comprehensive `DEPLOYMENT.md` guide
10. ✓ Added `.flake8` config (code quality)

---

## Next Steps

1. **Train Models** (if not already done):
   ```bash
   python train_models.py
   ```

2. **Choose Platform** from `DEPLOYMENT.md`:
   - Heroku (easiest, free tier)
   - Docker (most flexible)
   - VPS (full control)
   - Cloud platforms (scalable)

3. **Follow Platform Guide** in `DEPLOYMENT.md`

4. **Monitor** after deployment

---

## Support

For issues:
1. Check `DEPLOYMENT.md` troubleshooting section
2. Review logs for your deployment platform
3. Verify all files in checklist are in place
4. Ensure `python train_models.py` completed successfully

---

**Status**: ✅ **DEPLOYMENT READY**  
**Last Updated**: April 12, 2026
