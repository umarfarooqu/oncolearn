"""
OncoLearn - Breast Cancer Education & Prediction Platform
Flask Backend Application
"""

import os
import json
import numpy as np
from flask import Flask, render_template, request, jsonify
import pickle
import io
import base64
from breast_cancer_model import get_predictor

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# ──────────────────────────────────────────────
# BREAST CANCER PREDICTOR INITIALIZATION
# ──────────────────────────────────────────────

def get_breast_predictor_instance():
    """Get the breast cancer predictor."""
    return get_predictor()




# ──────────────────────────────────────────────
# PAGE ROUTES
# ──────────────────────────────────────────────

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')


@app.route('/prediction/breast')
def prediction_breast():
    return render_template('breast_prediction.html')

@app.route('/awareness')
def awareness():
    return render_template('awareness.html')


# ──────────────────────────────────────────────
# API ENDPOINTS
# ──────────────────────────────────────────────

@app.route('/predict/breast', methods=['POST'])
def predict_breast():
    """
    Advanced Breast Cancer Risk Prediction - Ensemble Method
    8 models with majority voting + risk stratification
    Accepts all 30 features from Wisconsin dataset
    """
    try:
        data = request.get_json()
        
        # Field names for all 30 features
        field_names = [
            'radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean', 'smoothness_mean',
            'compactness_mean', 'concavity_mean', 'concave_points_mean', 'symmetry_mean', 'fractal_dimension_mean',
            'radius_se', 'texture_se', 'perimeter_se', 'area_se', 'smoothness_se',
            'compactness_se', 'concavity_se', 'concave_points_se', 'symmetry_se', 'fractal_dimension_se',
            'radius_worst', 'texture_worst', 'perimeter_worst', 'area_worst', 'smoothness_worst',
            'compactness_worst', 'concavity_worst', 'concave_points_worst', 'symmetry_worst', 'fractal_dimension_worst'
        ]
        
        # Validate all 30 fields are provided
        missing_fields = []
        features = []
        
        for field in field_names:
            if field not in data or data[field] == '' or data[field] is None:
                missing_fields.append(field)
            else:
                try:
                    features.append(float(data[field]))
                except (ValueError, TypeError):
                    missing_fields.append(field)
        
        if missing_fields:
            return jsonify({
                'success': False, 
                'error': f'Missing or invalid values for: {", ".join(missing_fields)}. All 30 fields are required.'
            }), 400
        
        if len(features) != 30:
            return jsonify({
                'success': False, 
                'error': f'Expected 30 features, got {len(features)}'
            }), 400

        # Get predictor and make ensemble prediction
        predictor = get_breast_predictor_instance()
        if predictor is None:
            return jsonify({'success': False, 'error': 'Predictor not initialized'}), 500
        
        result = predictor.predict(features)
        
        return jsonify({
            'success': True,
            'prediction': result['result_text'],
            'risk_level': result['risk_level'],
            'confidence': result['confidence'],
            'malignant_votes': result['malignant_votes'],
            'total_models': result['total_models'],
            'individual_predictions': result['individual_predictions'],
            'prediction_value': result['prediction'],
            'color': result['result_color'],
            'model_type': 'Ensemble (8 Models)',
            'features_used': 30,
            'accuracy': '95%+',
            'dataset': 'Wisconsin Breast Cancer'
        })
            
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'}), 500









# ──────────────────────────────────────────────
# HEALTH CHECK
# ──────────────────────────────────────────────

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'running',
        'mode': 'Breast Cancer Prediction',
        'models': {
            'breast_ensemble': os.path.exists('models/breast_model.pkl'),
        }
    })


if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    print("\n╔══════════════════════════════════════════════════════╗")
    print("║   OncoLearn - Breast Cancer Education Platform    ║")
    print(f"║          Starting Flask Server on :{port}           ║")
    print("╚══════════════════════════════════════════════════════╝\n")
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
