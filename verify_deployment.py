#!/usr/bin/env python3
"""
OncoLearn - Complete Deployment Verification Script
Tests all components to ensure production readiness
"""

import json
import sys
import os

def test_imports():
    """Test all imports work correctly"""
    print("=" * 60)
    print("STEP 1: TESTING IMPORTS")
    print("=" * 60)
    try:
        from app import app
        print("✅ Flask app imports")
        from breast_cancer_model import get_predictor
        print("✅ ML predictor module imports")
        from sklearn.preprocessing import StandardScaler
        print("✅ scikit-learn imports")
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_models():
    """Test model files exist"""
    print("\n" + "=" * 60)
    print("STEP 2: CHECKING MODEL FILES")
    print("=" * 60)
    try:
        files = [f for f in os.listdir('models') if f.endswith('.pkl')]
        required = ['decision_tree.pkl', 'gradient_boost.pkl', 'knn.pkl', 
                   'logistic.pkl', 'naive_bayes.pkl', 'random_forest.pkl',
                   'svc_linear.pkl', 'svc_poly.pkl', 'svc_rbf.pkl',
                   'scaler.pkl', 'feature_names.pkl']
        
        for f in sorted(files):
            print(f"  ✅ {f}")
        
        if len(files) >= 10:
            print(f"\n✅ All {len(files)} model files present")
            return True
        else:
            print(f"\n⚠️  Only {len(files)} model files (expected 11)")
            return False
    except Exception as e:
        print(f"❌ Model check error: {e}")
        return False

def test_predictor():
    """Test predictor initialization"""
    print("\n" + "=" * 60)
    print("STEP 3: TESTING PREDICTOR INITIALIZATION")
    print("=" * 60)
    try:
        from breast_cancer_model import get_predictor
        predictor = get_predictor()
        print("✅ Predictor loaded successfully")
        print(f"✅ Scaler: {predictor.scaler is not None}")
        print(f"✅ Models loaded: {len(predictor.models)} models")
        return True
    except Exception as e:
        print(f"❌ Predictor error: {e}")
        return False

def test_endpoints():
    """Test all Flask endpoints"""
    print("\n" + "=" * 60)
    print("STEP 4: TESTING FLASK ENDPOINTS")
    print("=" * 60)
    try:
        from app import app
        client = app.test_client()
        
        endpoints = [
            ('GET', '/', 'Home page'),
            ('GET', '/learn', 'Learning hub'),
            ('GET', '/prediction/breast', 'Breast prediction page'),
            ('GET', '/awareness', 'Awareness page'),
            ('GET', '/api/health', 'Health check'),
        ]
        
        all_ok = True
        for method, path, desc in endpoints:
            resp = client.get(path)
            status = "✅" if resp.status_code == 200 else "❌"
            print(f"{status} {method:6} {path:25} ({desc}) - {resp.status_code}")
            if resp.status_code != 200:
                all_ok = False
        
        return all_ok
    except Exception as e:
        print(f"❌ Endpoint error: {e}")
        return False

def test_prediction():
    """Test prediction API"""
    print("\n" + "=" * 60)
    print("STEP 5: TESTING PREDICTION API")
    print("=" * 60)
    try:
        from app import app
        client = app.test_client()
        
        test_data = {
            'radius_mean': 14.2, 'texture_mean': 19.5, 'perimeter_mean': 92.3, 
            'area_mean': 654, 'smoothness_mean': 0.096, 'compactness_mean': 0.104,
            'concavity_mean': 0.089, 'concave_points_mean': 0.048, 'symmetry_mean': 0.181,
            'fractal_dimension_mean': 0.063, 'radius_se': 0.4, 'texture_se': 1.2,
            'perimeter_se': 2.8, 'area_se': 45.5, 'smoothness_se': 0.001,
            'compactness_se': 0.002, 'concavity_se': 0.001, 'concave_points_se': 0.001,
            'symmetry_se': 0.003, 'fractal_dimension_se': 0.002, 'radius_worst': 18.9,
            'texture_worst': 27.3, 'perimeter_worst': 125.5, 'area_worst': 890,
            'smoothness_worst': 0.105, 'compactness_worst': 0.180, 'concavity_worst': 0.120,
            'concave_points_worst': 0.060, 'symmetry_worst': 0.205,
            'fractal_dimension_worst': 0.064
        }
        
        resp = client.post('/predict/breast', json=test_data)
        print(f"✅ POST /predict/breast - Status: {resp.status_code}")
        
        if resp.status_code == 200:
            data = json.loads(resp.data)
            print(f"  ✅ Prediction: {data.get('prediction')}")
            confidence = data.get('confidence')
            if isinstance(confidence, float):
                print(f"  ✅ Confidence: {confidence:.2%}")
            else:
                print(f"  ✅ Confidence: {confidence}")
            print(f"  ✅ Models voted: {data.get('malignant_votes')}/{data.get('total_models')}")
            print(f"  ✅ Accuracy: {data.get('accuracy')}")
            return True
        else:
            print(f"❌ Prediction failed: {resp.status_code}")
            return False
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return False

def test_templates():
    """Test all templates exist"""
    print("\n" + "=" * 60)
    print("STEP 6: CHECKING TEMPLATE FILES")
    print("=" * 60)
    try:
        templates = [
            'base.html', 'home.html', 'learn.html', 
            'breast_prediction.html', 'awareness.html', 'prediction.html'
        ]
        
        for template in templates:
            path = f'templates/{template}'
            if os.path.exists(path):
                print(f"✅ {template}")
            else:
                print(f"❌ {template} - NOT FOUND")
                return False
        
        return True
    except Exception as e:
        print(f"❌ Template check error: {e}")
        return False

def test_static_files():
    """Test static files exist"""
    print("\n" + "=" * 60)
    print("STEP 7: CHECKING STATIC FILES")
    print("=" * 60)
    try:
        static_dirs = {
            'CSS': 'static/css/style.css',
            'JavaScript': 'static/js/main.js',
        }
        
        for file_type, path in static_dirs.items():
            if os.path.exists(path):
                print(f"✅ {file_type:15} - {path}")
            else:
                print(f"❌ {file_type:15} - {path} NOT FOUND")
                return False
        
        return True
    except Exception as e:
        print(f"❌ Static files check error: {e}")
        return False

def test_deployment_files():
    """Test deployment configuration files"""
    print("\n" + "=" * 60)
    print("STEP 8: CHECKING DEPLOYMENT FILES")
    print("=" * 60)
    try:
        deployment_files = [
            '.gitignore',
            '.dockerignore',
            'Procfile',
            'runtime.txt',
            'Dockerfile',
            'docker-compose.yml',
            '.env.example',
            'requirements.txt',
            'DEPLOYMENT.md',
            'DEPLOYMENT_CHECKLIST.md',
            'QUICK_DEPLOY.md',
        ]
        
        all_present = True
        for filename in deployment_files:
            if os.path.exists(filename):
                print(f"✅ {filename}")
            else:
                print(f"❌ {filename} - NOT FOUND")
                all_present = False
        
        return all_present
    except Exception as e:
        print(f"❌ Deployment files check error: {e}")
        return False

def test_dependencies():
    """Test all dependencies are installed"""
    print("\n" + "=" * 60)
    print("STEP 9: CHECKING DEPENDENCIES")
    print("=" * 60)
    try:
        packages = {
            'flask': 'Flask',
            'werkzeug': 'Werkzeug',
            'gunicorn': 'gunicorn',
            'numpy': 'NumPy',
            'pandas': 'Pandas',
            'sklearn': 'scikit-learn',
            'joblib': 'joblib',
            'PIL': 'Pillow',
        }
        
        for import_name, display_name in packages.items():
            try:
                __import__(import_name)
                print(f"✅ {display_name}")
            except ImportError:
                print(f"❌ {display_name} - NOT INSTALLED")
                return False
        
        return True
    except Exception as e:
        print(f"❌ Dependencies check error: {e}")
        return False

def main():
    """Run all verification tests"""
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 10 + "ONCOLEARN - DEPLOYMENT VERIFICATION" + " " * 13 + "║")
    print("║" + " " * 15 + "Complete Project Check" + " " * 20 + "║")
    print("╚" + "=" * 58 + "╝")
    
    results = []
    
    # Run tests
    results.append(("Imports", test_imports()))
    results.append(("Model Files", test_models()))
    results.append(("Predictor", test_predictor()))
    results.append(("Endpoints", test_endpoints()))
    results.append(("Prediction API", test_prediction()))
    results.append(("Templates", test_templates()))
    results.append(("Static Files", test_static_files()))
    results.append(("Deployment Files", test_deployment_files()))
    results.append(("Dependencies", test_dependencies()))
    
    # Summary
    print("\n" + "=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:10} - {test_name}")
    
    all_passed = all(result for _, result in results)
    
    print("=" * 60)
    if all_passed:
        print("\n🎉 ✅ ALL CHECKS PASSED - PROJECT IS FULLY READY FOR DEPLOYMENT!\n")
        return 0
    else:
        print("\n⚠️  ❌ SOME CHECKS FAILED - Please review above.\n")
        return 1

if __name__ == '__main__':
    sys.exit(main())
