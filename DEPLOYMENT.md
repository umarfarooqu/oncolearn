# OncoLearn - Deployment Guide

## Overview
This guide covers deployment-ready configurations for OncoLearn across different platforms.

---

## Pre-Deployment Checklist

- [ ] All models trained: Run `python train_models.py`
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] `.env` file created from `.env.example` (production only)
- [ ] Cache files removed (automated with `.gitignore`)
- [ ] No sensitive data in code
- [ ] HTTPS configured (recommended for production)
- [ ] Medical disclaimer displayed (included in app)

---

## Platform-Specific Deployments

### 1. **Heroku**

```bash
# Prerequisites
heroku login
heroku create your-app-name

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Scale dynos
heroku ps:scale web=1
```

**Files used**: `Procfile`, `runtime.txt`, `requirements.txt`

---

### 2. **Railway**

1. Connect GitHub repository to Railway
2. Railway auto-deploys on every push to `main`
3. Environment variables are automatically set

**Important**: The PORT issue has been fixed in the latest Procfile. If you previously had a crash with `"$PORT" is not a valid port number`:

```bash
# 1. Ensure you have the latest code:
git pull origin main

# 2. Push to trigger new deployment:
git push origin main

# 3. Railway will automatically redeploy with the fix
```

**Verify deployment**:
```bash
# Test health endpoint
curl https://your-railway-app.up.railway.app/api/health

# Test prediction
curl -X POST https://your-railway-app.up.railway.app/predict/breast \
  -H "Content-Type: application/json" \
  -d '{"radius_mean": 14.2, ...}'
```

**Files used**: `Procfile`, `requirements.txt`, `runtime.txt`

**Access**: `https://your-railway-app.up.railway.app`

---

### 3. **Render**

1. Create new Web Service
2. Connect GitHub repository
3. Environment: Python 3
4. Build command: `pip install -r requirements.txt && python train_models.py`
5. Start command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`

**Files used**: `requirements.txt`

---

### 4. **Docker (Local or Any Docker-Enabled Platform)**

```bash
# Build image
docker build -t oncolearn:latest .

# Run container
docker run -p 5000:5000 \
  -e FLASK_ENV=production \
  -v $(pwd)/models:/app/models \
  oncolearn:latest

# Using docker-compose
docker-compose up -d

# View logs
docker logs -f oncolearn

# Stop container
docker stop oncolearn
```

**Files used**: `Dockerfile`, `docker-compose.yml`, `.dockerignore`

---

### 5. **PythonAnywhere**

1. Upload files via Web interface or Git
2. Create virtual environment
3. Install requirements: `pip install -r requirements.txt`
4. Train models: `python train_models.py`
5. Configure WSGI file to point to `app:app`
6. Set Python version to 3.11

---

### 6. **AWS Elastic Beanstalk**

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p python-3.11 oncolearn

# Create environment
eb create oncolearn-env

# Deploy
eb deploy

# View logs
eb logs
```

**Files used**: `requirements.txt`, `Procfile` (optional)

---

### 7. **Google Cloud Run**

```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/oncolearn

# Deploy
gcloud run deploy oncolearn \
  --image gcr.io/PROJECT_ID/oncolearn \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars FLASK_ENV=production
```

**Files used**: `Dockerfile`, `requirements.txt`

---

### 8. **Traditional VPS (Ubuntu/Debian)**

```bash
# 1. SSH into server
ssh root@your_server_ip

# 2. Install Python and dependencies
sudo apt-get update
sudo apt-get install python3.11 python3.11-venv python3-pip

# 3. Clone project
git clone your_repo_url /var/www/oncolearn
cd /var/www/oncolearn

# 4. Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# 5. Install dependencies
pip install -r requirements.txt

# 6. Train models
python train_models.py

# 7. Install and configure Nginx
sudo apt-get install nginx

# 8. Install Supervisor for process management
sudo apt-get install supervisor

# 9. Create supervisor config
sudo nano /etc/supervisor/conf.d/oncolearn.conf
```

**Supervisor config** (`/etc/supervisor/conf.d/oncolearn.conf`):
```ini
[program:oncolearn]
directory=/var/www/oncolearn
command=/var/www/oncolearn/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/oncolearn.log
```

**Nginx config** (`/etc/nginx/sites-available/oncolearn`):
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static/ {
        alias /var/www/oncolearn/static/;
    }
}
```

---

## Environment Variables

Create `.env` file (use `.env.example` as template):

```env
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=generate-strong-key-here
PORT=5000
```

---

## Performance Optimization

### Gunicorn Workers
- Small deployments (< 100 users): 2-4 workers
- Medium deployments (100-1000 users): 4-8 workers
- Large deployments: (workers = CPU_cores * 2) + 1

```bash
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 app:app
```

### Database/Caching (Future Enhancement)
- Add Redis for caching educational content
- Implement session management if user accounts added
- Consider PostgreSQL if patient data logging required

---

## Security Considerations

✅ **Already Implemented:**
- Input validation on predictions
- No sensitive data storage
- Parameterized inputs

⚠️ **Recommended for Production:**
- [ ] Enable HTTPS/SSL (Let's Encrypt free certificates)
- [ ] Add rate limiting (Flask-Limiter)
- [ ] Implement CORS properly
- [ ] Add authentication for admin features (if added)
- [ ] Regular dependency updates: `pip list --outdated`
- [ ] Monitor logs for suspicious activity

---

## Troubleshooting Deployment

### Issue: "No models found"
```bash
# Solution: Train models after deployment
python train_models.py
```

### Issue: Out of memory
```bash
# Reduce gunicorn workers
gunicorn -w 2 -b 0.0.0.0:5000 app:app
```

### Issue: Slow predictions
```bash
# Models loaded on first use - use warming request:
curl http://localhost:5000/api/health
```

### Issue: Port already in use
```bash
# Find process
lsof -i :5000
# Kill it
kill -9 <PID>
```

---

## Monitoring & Maintenance

### Health Check Endpoint
```bash
curl http://localhost:5000/api/health
```

### Log Monitoring
```bash
# Docker
docker logs -f oncolearn

# Heroku
heroku logs --tail

# VPS
tail -f /var/log/oncolearn.log
```

### Regular Updates
```bash
# Check for outdated packages
pip list --outdated

# Update safely
pip install --upgrade package_name
```

---

## Scaling Considerations

1. **Horizontal Scaling**: Deploy multiple instances behind load balancer
2. **Model Caching**: Consider caching predictions for identical inputs
3. **Async Tasks**: Use Celery for long-running processes (future enhancement)
4. **CDN**: Serve static files via CDN for faster delivery

---

## Support & Documentation

- Framework: [Flask Docs](https://flask.palletsprojects.com/)
- ML: [scikit-learn Docs](https://scikit-learn.org/)
- Deployment: [Gunicorn Docs](https://gunicorn.org/)
