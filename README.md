# OncoLearn

### Intelligent Breast Cancer Education & Prediction Platform

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Flask](https://img.shields.io/badge/Framework-Flask%203.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

**OncoLearn** is a comprehensive, modern web platform designed to empower patients, caregivers, and medical professionals with evidence-based breast cancer education and AI-powered risk prediction capabilities. The platform combines interactive learning modules with predictive analytics to provide a complete breast cancer information and assessment solution.

### Key Objectives

- 🎓 **Comprehensive Education**: Provider accessible, scientifically-accurate breast cancer information
- 🔬 **Intelligent Prediction**: Advanced ensemble ML models for breast cancer risk assessment
- 👥 **Patient Empowerment**: Interactive tools for informed decision-making
- 🏥 **Professional Resources**: Support for healthcare providers in patient education

---

## Features

### 📚 Learning Modules

- **Comprehensive Educational Hub** with 9 interconnected learning modules:
  - Overview & Introduction
  - Symptoms & Detection
  - Breast Cancer Causes & Risk Factors
  - Diagnosis & Staging  
  - Treatment Options
  - Survival & Prognosis
  - Prevention & Lifestyle Factors
  - Frequently Asked Questions (19+ topics)
  - Self-Assessment Tools

- **Interactive FAQ System** with hover-triggered expansion
- **SVG-based Medical Illustrations** for complex concepts
- **Responsive Design** for mobile, tablet, and desktop viewing

### 🔮 Prediction Engine

- **8-Model Ensemble System** for robust risk prediction
  - Logistic Regression
  - Random Forest
  - Gradient Boosting
  - K-Nearest Neighbors
  - Support Vector Machines (Linear, Polynomial, RBF kernels)
  - Naive Bayes
  - Decision Tree

- **Wisconsin Breast Cancer Dataset**: 30 clinical features from 569 samples
- **95%+ Accuracy** on validated test sets
- **Majority Voting System** for consensus predictions
- **Risk Stratification** with confidence scores
- **Individual Model Predictions** for transparency

### 🎨 Modern UI/UX

- **Soft Blue Glass Morphism** aesthetic with blur effects
- **Smooth Animations** and transitions
- **Interactive Cards** with hover effects
- **Professional Medical Design** with color psychology
- **Accessibility-First** approach

### 👁️ Awareness & Support

- **Breast Cancer Awareness Section** with evidence-based information
- **Links to Educational Content** from home and awareness pages
- **Medical Disclaimer** with appropriate healthcare guidance
- **Internal Navigation** system for seamless user journey

---

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Installation & Setup

```bash
# 1. Clone or extract the project
cd oncolearn

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the virtual environment
# On Windows:
.\venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Train the breast cancer ensemble models
python train_models.py

# 6. Start the development server
python app.py

# 7. Open your browser
# Navigate to http://localhost:5000
```

The application will be available at `http://localhost:5000`

---

## 🚀 Production Deployment

**Status**: ✅ **DEPLOYMENT READY**

OncoLearn includes production-optimized deployment configurations for multiple platforms:

### Quick Deployment

**See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive platform-specific guides:**

- **Heroku** (Easiest): `git push heroku main`
- **Docker** (Flexible): `docker build -t oncolearn . && docker run -p 5000:5000 oncolearn`
- **Railway** (Git-based): Connect GitHub → Deploy
- **Render** (Free tier): Connect GitHub → Auto-deploy
- **VPS/Ubuntu**: Manual installation with Nginx + Supervisor
- **AWS Elastic Beanstalk**, **Google Cloud Run**, **PythonAnywhere**: See DEPLOYMENT.md

### Deployment Checklist

```bash
✓ Clean requirements.txt (no bloat)
✓ Production-grade .gitignore (prevents cache files)
✓ Procfile for platform compatibility
✓ Docker support (Dockerfile + docker-compose.yml)
✓ Environment variable template (.env.example)
✓ No version conflicts
✓ Core app logic untouched
```

### Pre-Deployment Steps

```bash
# 1. Ensure models are trained
python train_models.py

# 2. Verify all dependencies
pip install -r requirements.txt

# 3. Check health endpoint works locally
curl http://localhost:5000/api/health

# 4. Choose your platform from DEPLOYMENT.md
```

### File Structure for Deployment

```
oncolearn/
├── .gitignore           ✓ Prevents cache deployment
├── .dockerignore        ✓ Clean Docker images
├── requirements.txt     ✓ Optimized, production-only
├── Procfile             ✓ Platform compatibility
├── runtime.txt          ✓ Python version spec
├── Dockerfile           ✓ Multi-stage build
├── docker-compose.yml   ✓ Local Docker dev
├── .env.example         ✓ Safe config template
├── DEPLOYMENT.md        ✓ 8+ platform guides
└── [other files...]
```

**Result**: Smaller package, no unnecessary files, version conflicts resolved, ready for production.

---

## Project Structure

```
oncolearn/
│
├── app.py                          # Flask application & API endpoints
├── breast_cancer_model.py          # Ensemble ML predictor class
├── train_models.py                 # Model training script
├── train_breast_models.py          # Alternative training script
├── requirements.txt                # Project dependencies
├── README.md                       # This file
│
├── models/                         # Trained model artifacts
│   ├── decision_tree.pkl           # Decision Tree classifier
│   ├── gradient_boost.pkl          # Gradient Boosting classifier
│   ├── knn.pkl                     # K-Nearest Neighbors classifier
│   ├── logistic.pkl                # Logistic Regression model
│   ├── naive_bayes.pkl             # Naive Bayes classifier
│   ├── random_forest.pkl           # Random Forest classifier
│   ├── svc_linear.pkl              # SVM Linear kernel
│   ├── svc_poly.pkl                # SVM Polynomial kernel
│   ├── svc_rbf.pkl                 # SVM RBF kernel
│   ├── feature_names.pkl           # Feature name mapping
│   └── scaler.pkl                  # StandardScaler for preprocessing
│
├── static/                         # Static assets
│   ├── css/
│   │   └── style.css              # All application styles
│   ├── js/
│   │   └── main.js                # Client-side JavaScript
│   ├── images/                    # SVG illustrations & icons
│   └── videos/                    # Background video banner
│
└── templates/                     # HTML templates
    ├── base.html                  # Base layout & navigation
    ├── home.html                  # Landing page with learning cards
    ├── learn.html                 # Educational hub (9 tabs)
    ├── breast_prediction.html     # Prediction tool
    ├── awareness.html             # Breast cancer awareness section
    └── prediction.html            # Legacy prediction page

```

---

## Breast Cancer Prediction System

### Overview

OncoLearn uses a sophisticated **8-model ensemble** approach to provide robust breast cancer risk predictions. Each model is trained on the Wisconsin Breast Cancer Dataset and validated for accuracy.

### Input Features (30 Clinical Measurements)

The prediction system accepts 30 standardized features derived from cell nucleus measurements:

| Category | Features | Count |
|----------|----------|-------|
| **Mean** | radius, texture, perimeter, area, smoothness, compactness, concavity, concave_points, symmetry, fractal_dimension | 10 |
| **Standard Error** | radius, texture, perimeter, area, smoothness, compactness, concavity, concave_points, symmetry, fractal_dimension | 10 |
| **Worst** | radius, texture, perimeter, area, smoothness, compactness, concavity, concave_points, symmetry, fractal_dimension | 10 |

### ML Models in Ensemble

1. **Logistic Regression** - Probabilistic linear classifier
2. **Random Forest** - Ensemble of decision trees
3. **Gradient Boosting** - Sequentially boosted trees
4. **K-Nearest Neighbors** - Instance-based learner
5. **Support Vector Machine (Linear)** - Linear kernel SVM
6. **Support Vector Machine (Polynomial)** - Polynomial kernel SVM
7. **Support Vector Machine (RBF)** - Radial basis function kernel SVM
8. **Naive Bayes** - Probabilistic classifier
9. **Decision Tree** - Single tree classifier

### Prediction Process

1. **Data Validation**: All 30 features are validated and normalized
2. **Preprocessing**: StandardScaler applies the same transformation used during training
3. **Individual Predictions**: Each model makes its prediction
4. **Ensemble Voting**: Majority voting determines the consensus prediction
5. **Confidence Calculation**: Confidence score based on voting distribution
6. **Risk Stratification**: Prediction mapped to risk level (Low/Medium/High)

### Output Format

```json
{
  "success": true,
  "prediction": "High Risk",  // Risk level
  "risk_level": "high",        // Risk category
  "confidence": 0.96,          // Ensemble confidence (0-1)
  "malignant_votes": 8,        // Models voting malignant
  "total_models": 8,           // Total models in ensemble
  "individual_predictions": {
    "logistic_regression": "Malignant",
    "random_forest": "Malignant",
    // ... other models
  },
  "color": "#e11d7f",          // Visual indicator color
  "model_type": "Ensemble (8 Models)",
  "features_used": 30,
  "accuracy": "95%+",
  "dataset": "Wisconsin Breast Cancer"
}
```

---

## API Endpoints

### Breast Cancer Prediction

**Endpoint**: `POST /predict/breast`

**Request Format**:
```json
{
  "radius_mean": 14.2,
  "texture_mean": 19.5,
  "perimeter_mean": 92.3,
  "area_mean": 654,
  "smoothness_mean": 0.096,
  "compactness_mean": 0.104,
  "concavity_mean": 0.089,
  "concave_points_mean": 0.048,
  "symmetry_mean": 0.181,
  "fractal_dimension_mean": 0.063,
  "radius_se": 0.4,
  "texture_se": 1.2,
  "perimeter_se": 2.8,
  "area_se": 45.5,
  "smoothness_se": 0.001,
  "compactness_se": 0.002,
  "concavity_se": 0.001,
  "concave_points_se": 0.001,
  "symmetry_se": 0.003,
  "fractal_dimension_se": 0.002,
  "radius_worst": 18.9,
  "texture_worst": 27.3,
  "perimeter_worst": 125.5,
  "area_worst": 890,
  "smoothness_worst": 0.105,
  "compactness_worst": 0.180,
  "concavity_worst": 0.120,
  "concave_points_worst": 0.060,
  "symmetry_worst": 0.205,
  "fractal_dimension_worst": 0.064
}
```

**Response Format**:
```json
{
  "success": true,
  "prediction": "High Risk",
  "risk_level": "high",
  "confidence": 0.96,
  "malignant_votes": 8,
  "total_models": 8,
  "individual_predictions": {
    "logistic_regression": "Malignant",
    "random_forest": "Malignant",
    "gradient_boosting": "Malignant",
    "knn": "Malignant",
    "svm_linear": "Malignant",
    "svm_poly": "Malignant",
    "svm_rbf": "Malignant",
    "naive_bayes": "Benign"
  },
  "prediction_value": 0,
  "color": "#e11d7f",
  "model_type": "Ensemble (8 Models)",
  "features_used": 30,
  "accuracy": "95%+",
  "dataset": "Wisconsin Breast Cancer"
}
```

### Health Check

**Endpoint**: `GET /api/health`

**Response Format**:
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

## Page Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `home.html` | Landing page with learning topic cards |
| `/learn` | `learn.html` | Educational hub with 9 learning tabs |
| `/awareness` | `awareness.html` | Breast cancer awareness information |
| `/prediction/breast` | `breast_prediction.html` | Breast cancer risk prediction tool |

---

## Data & Models

### Dataset

**Wisconsin Breast Cancer Dataset (UCI)**
- **Samples**: 569 patients
- **Classes**: Benign (357) vs. Malignant (212)
- **Features**: 30 computed cell nucleus measurements
- **Accuracy on Test Set**: 95%+

### Training the Models

To train or retrain the breast cancer prediction ensemble:

```bash
python train_models.py
```

This will:
1. Load the Wisconsin Breast Cancer Dataset
2. Preprocess and normalize the data
3. Train all 8 ensemble models
4. Save trained models to `models/` directory
5. Display sample predictions

### Model Files

All trained models are saved in `.pkl` format using Python's `pickle` module:
- Individual classifiers in `models/` (e.g., `random_forest.pkl`)
- Preprocessing artifacts (`scaler.pkl`, `feature_names.pkl`)

---

## Development & Customization

### Virtual Environment Setup

```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
.\venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running in Development Mode

```bash
python app.py
```

The server will start with Flask's development server (debug mode enabled).

### Running in Production

```bash
# Using gunicorn (production WSGI server)
gunicorn -w 4 -b 127.0.0.1:5000 app:app

# Or with custom settings
gunicorn -w 4 --timeout 120 -b 0.0.0.0:5000 app:app
```

### Frontend Customization

- **CSS**: Modify `static/css/style.css`
- **JavaScript**: Modify `static/js/main.js`
- **HTML Templates**: Modify files in `templates/`

### Adding Educational Content

Edit `templates/learn.html` to add or modify learning modules. The platform supports:
- Tabbed interface
- Markdown-style formatting
- SVG illustrations
- Interactive elements

---

## Educational Content

### Learning Modules (9 Tabs)

1. **Overview** - General introduction to breast cancer
2. **Symptoms & Detection** - Warning signs, self-examination, screening timeline
3. **Causes & Risk Factors** - Genetic, hormonal, lifestyle factors
4. **Diagnosis & Staging** - Diagnostic procedures, staging systems (TNM)
5. **Treatment Options** - Surgery, radiation, chemotherapy, immunotherapy
6. **Survival & Prognosis** - Survival rates, recurrence risks, prognostic factors
7. **Prevention & Lifestyle** - Risk reduction strategies, wellness practices
8. **FAQ** - 19+ comprehensive frequently asked questions
9. **Self-Assessment** - Interactive assessment tools

### FAQ Coverage

The FAQ section includes 19+ questions organized by topics:
- Symptoms and Detection
- Genetic Factors
- Screening Practices
- Treatment Modalities

---

## Deployment

### Requirements

- Python 3.8+
- Web server (nginx, Apache) - optional for production
- WSGI server (gunicorn, uWSGI)
- SSL/TLS certificate for HTTPS (recommended)

### Deployment Steps

1. **Clone the repository** on your server
2. **Set up virtual environment** with dependencies
3. **Train models** using `python train_models.py`
4. **Configure WSGI server** (gunicorn)
5. **Set up reverse proxy** (nginx, Apache)
6. **Enable HTTPS** with SSL certificate
7. **Configure firewall** and security settings

### Environment Variables

(Optional - currently not required, but can be added):
```bash
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secret-key-here
```

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## Performance Considerations

- **Model Loading**: Models are loaded on first prediction request
- **Caching**: Consider implementing caching for frequently accessed educational content
- **Scalability**: For high-traffic deployments, use load balancing with multiple gunicorn workers

---

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Backend Framework** | Flask | 3.0.0 |
| **ML Framework** | scikit-learn | 1.3.0 |
| **Data Processing** | pandas, numpy | 2.0.3, 1.24.3 |
| **Frontend** | HTML5, CSS3, JavaScript | - |
| **Image Processing** | Pillow | 10.0.0 |
| **Production Server** | gunicorn | 21.2.0 |
| **Python** | 3.8+ | - |

---

## Security Considerations

- ✅ Input validation on all prediction requests
- ✅ No sensitive patient data storage
- ✅ CORS headers can be configured as needed
- ⚠️ For HIPAA compliance, implement:
  - User authentication
  - Audit logging
  - Encrypted data transmission (HTTPS)
  - Data privacy compliance measures

---

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance with WCAG 2.1 AA
- Semantic HTML structure
- Available educational content in multiple formats

---

## Troubleshooting

### Common Issues

**Issue**: Models not found error
```
[!] No model file found for 'breast_ensemble' – running in DEMO mode
```
**Solution**: Run `python train_models.py` to train and save models

**Issue**: Port 5000 already in use
```
OSError: [Errno 48] Address already in use
```
**Solution**: 
```bash
# Find and kill the process
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>

# Or specify a different port
# Modify app.py: app.run(port=5001)
```

**Issue**: Missing dependencies
```
ModuleNotFoundError: No module named 'flask'
```
**Solution**: 
```bash
# Ensure virtual environment is activated
pip install -r requirements.txt
```

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## Medical Disclaimer

**IMPORTANT**: OncoLearn is designed for **educational and informational purposes only**. The content and prediction tools are not intended to:

- Replace professional medical advice, diagnosis, or treatment
- Be used for clinical decision-making without physician consultation
- Diagnose or treat any medical condition
- Provide medical recommendations

**Always consult with qualified healthcare professionals** for:
- Medical diagnosis
- Treatment recommendations
- Risk assessment and management
- Any health-related concerns

The predictive models are trained on historical data and should only be used to support, not replace, professional medical judgment. Users assume all responsibility for decisions made based on this platform's information.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Citation

If you use this project in academic or research work, please cite as:

```bibtex
@software{oncolearn2024,
  title={OncoLearn: Intelligent Breast Cancer Education & Prediction Platform},
  author={OncoLearn Contributors},
  year={2024},
  url={https://github.com/yourusername/oncolearn}
}
```

---

## Contact & Support

For questions, suggestions, or issues:

- 📧 Email: support@oncolearn.edu
- 🐛 Bug Reports: Create an issue on GitHub
- 💡 Feature Requests: Open a discussion

---

## Acknowledgments

- **Wisconsin Breast Cancer Dataset** (UCI ML Repository)
- Flask framework and its amazing community
- scikit-learn for machine learning models
- Medical and educational consultants

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: Active Development

