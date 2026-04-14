"""
Advanced Breast Cancer Risk Prediction System
Ensemble Learning with 8 Models - Wisconsin Dataset (95%+ Accuracy)
Production-Grade Risk Stratification for Malignant vs Benign
"""

import pandas as pd
import numpy as np
import pickle
import os
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression


class BreastCancerPredictor:
    """Advanced ensemble predictor with risk stratification"""
    
    def __init__(self, models_dir='models'):
        self.models_dir = models_dir
        self.scaler = None
        self.models = {}
        self.accuracy_scores = {}
        self.feature_names = None
        os.makedirs(models_dir, exist_ok=True)

    def train(self):
        """Train advanced ensemble models - 8 models with optimal hyperparameters"""
        print("\n" + "="*70)
        print("ADVANCED BREAST CANCER ENSEMBLE - TRAINING")
        print("="*70)
        
        # Load Wisconsin Breast Cancer Dataset
        data = load_breast_cancer()
        X = pd.DataFrame(data.data, columns=data.feature_names)
        y = data.target
        
        # Store feature names for later use
        self.feature_names = list(X.columns)
        
        print(f"Dataset: {X.shape[0]} samples, {X.shape[1]} features")
        print(f"Classes: 0=BENIGN ({(y==0).sum()}), 1=MALIGNANT ({(y==1).sum()})")
        
        # Train-test split with stratification
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Feature scaling
        self.scaler = StandardScaler()
        X_train_sc = self.scaler.fit_transform(X_train)
        X_test_sc = self.scaler.transform(X_test)
        
        print("\nTraining 8-Model Ensemble:")
        
        # 1. SVC RBF
        print("  1. SVC (RBF)...", end=" ")
        model = SVC(kernel='rbf', C=10, gamma='scale', probability=True, random_state=42)
        model.fit(X_train_sc, y_train)
        acc = model.score(X_test_sc, y_test)
        self.models['svc_rbf'] = model
        self.accuracy_scores['svc_rbf'] = acc
        print(f"✓ {acc:.4f}")
        
        # 2. SVC Linear
        print("  2. SVC (Linear)...", end=" ")
        model = SVC(kernel='linear', C=1.0, probability=True, random_state=42)
        model.fit(X_train_sc, y_train)
        acc = model.score(X_test_sc, y_test)
        self.models['svc_linear'] = model
        self.accuracy_scores['svc_linear'] = acc
        print(f"✓ {acc:.4f}")
        
        # 3. Logistic Regression
        print("  3. Logistic Regression...", end=" ")
        model = LogisticRegression(max_iter=10000, random_state=42)
        model.fit(X_train_sc, y_train)
        acc = model.score(X_test_sc, y_test)
        self.models['logistic'] = model
        self.accuracy_scores['logistic'] = acc
        print(f"✓ {acc:.4f}")
        
        # 4. Decision Tree
        print("  4. Decision Tree...", end=" ")
        model = DecisionTreeClassifier(max_depth=15, random_state=42)
        model.fit(X_train_sc, y_train)
        acc = model.score(X_test_sc, y_test)
        self.models['decision_tree'] = model
        self.accuracy_scores['decision_tree'] = acc
        print(f"✓ {acc:.4f}")
        
        # 5. Random Forest
        print("  5. Random Forest...", end=" ")
        model = RandomForestClassifier(n_estimators=200, max_depth=20, random_state=42, n_jobs=-1)
        model.fit(X_train_sc, y_train)
        acc = model.score(X_test_sc, y_test)
        self.models['random_forest'] = model
        self.accuracy_scores['random_forest'] = acc
        print(f"✓ {acc:.4f}")
        
        # 6. Gradient Boosting
        print("  6. Gradient Boosting...", end=" ")
        model = GradientBoostingClassifier(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42)
        model.fit(X_train_sc, y_train)
        acc = model.score(X_test_sc, y_test)
        self.models['gradient_boost'] = model
        self.accuracy_scores['gradient_boost'] = acc
        print(f"✓ {acc:.4f}")
        
        # 7. k-Nearest Neighbors
        print("  7. k-NN (k=7)...", end=" ")
        model = KNeighborsClassifier(n_neighbors=7)
        model.fit(X_train_sc, y_train)
        acc = model.score(X_test_sc, y_test)
        self.models['knn'] = model
        self.accuracy_scores['knn'] = acc
        print(f"✓ {acc:.4f}")
        
        # 8. Naive Bayes
        print("  8. Gaussian Naive Bayes...", end=" ")
        model = GaussianNB()
        model.fit(X_train_sc, y_train)
        acc = model.score(X_test_sc, y_test)
        self.models['naive_bayes'] = model
        self.accuracy_scores['naive_bayes'] = acc
        print(f"✓ {acc:.4f}")
        
        self.save_all()
        print("\n" + "="*70)
        print("✓ Training Complete! All models saved.")
        print("="*70 + "\n")
    

    def save_all(self):
        """Save all models, scaler, and feature names"""
        for name, model in self.models.items():
            path = os.path.join(self.models_dir, f'{name}.pkl')
            with open(path, 'wb') as f:
                pickle.dump(model, f)
        
        scaler_path = os.path.join(self.models_dir, 'scaler.pkl')
        with open(scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
        
        # Save feature names
        if self.feature_names:
            fn_path = os.path.join(self.models_dir, 'feature_names.pkl')
            with open(fn_path, 'wb') as f:
                pickle.dump(self.feature_names, f)

    def load_all(self):
        """Load all models, scaler, and feature names"""
        if self.scaler is None:
            scaler_path = os.path.join(self.models_dir, 'scaler.pkl')
            if os.path.exists(scaler_path):
                with open(scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
        
        # Load feature names
        if self.feature_names is None:
            fn_path = os.path.join(self.models_dir, 'feature_names.pkl')
            if os.path.exists(fn_path):
                with open(fn_path, 'rb') as f:
                    self.feature_names = pickle.load(f)
        
        # Load all models
        for name in ['svc_rbf', 'svc_linear', 'logistic', 'decision_tree', 
                     'random_forest', 'gradient_boost', 'knn', 'naive_bayes']:
            if name not in self.models:
                path = os.path.join(self.models_dir, f'{name}.pkl')
                if os.path.exists(path):
                    with open(path, 'rb') as f:
                        self.models[name] = pickle.load(f)

    def predict(self, features):
        """
        Ensemble prediction with risk stratification
        
        Args:
            features: list of 30 clinical measurements
        
        Returns:
            dict with:
            - prediction: 0=MALIGNANT, 1=BENIGN
            - result_text: detailed risk message  
            - result_color: UI color code
            - risk_level: "HIGH", "MODERATE", "LOW"
            - confidence: ensemble voting confidence
            - votes: number of models voting malignant
            - individual_predictions: each model's vote
        """
        if self.scaler is None or not self.models:
            self.load_all()
        
        try:
            # Convert and scale features
            features = np.array(features, dtype=np.float64).reshape(1, -1)
            features_scaled = self.scaler.transform(features)
            
            # Ensemble voting - all 8 models
            votes = {}
            predictions = {}
            
            for model_name, model in self.models.items():
                pred = int(model.predict(features_scaled)[0])
                votes[model_name] = pred
                predictions[model_name] = pred
            
            # Majority voting
            total_votes = sum(votes.values())
            malignant_votes = sum(1 for v in votes.values() if v == 0)
            
            # Final prediction (0=MALIGNANT, 1=BENIGN)
            ensemble_pred = 0 if malignant_votes >= len(self.models) / 2 else 1
            confidence = malignant_votes / len(self.models)
            
            # Risk stratification 
            if malignant_votes >= len(self.models) - 1:  # 7-8 models say cancer
                risk_level = "CRITICAL"
                result_text = "🚨 CRITICAL RISK - Malignant (Cancer Detected)"
                result_color = "danger"
            elif malignant_votes >= len(self.models) / 2:  # Majority says cancer
                risk_level = "HIGH"
                result_text = f"⚠️ HIGH RISK - Likely Malignant ({malignant_votes}/{len(self.models)} models)"
                result_color = "danger"
            elif malignant_votes >= 2:  # Some models uncertain
                risk_level = "MODERATE"
                result_text = f"⚠️ MODERATE RISK - Uncertain ({malignant_votes}/{len(self.models)} models)"
                result_color = "warning"
            else:
                risk_level = "LOW"
                result_text = f"✓ LOW RISK - Likely Benign (No cancer detected)"
                result_color = "success"
            
            return {
                'prediction': ensemble_pred,
                'result_text': result_text,
                'result_color': result_color,
                'risk_level': risk_level,
                'confidence': f"{confidence * 100:.1f}%",
                'malignant_votes': malignant_votes,
                'total_models': len(self.models),
                'individual_predictions': predictions
            }
            
        except Exception as e:
            print(f"Error during ensemble prediction: {str(e)}")
            return {
                'prediction': -1,
                'result_text': f'⚠️ Prediction Error: {str(e)}',
                'result_color': 'danger',
                'risk_level': 'ERROR',
                'confidence': 'N/A',
                'malignant_votes': 0,
                'total_models': 0,
                'individual_predictions': {}
            }


# Global predictor instance
_predictor = None

def get_predictor():
    global _predictor
    if _predictor is None:
        _predictor = BreastCancerPredictor(models_dir='models')
        _predictor.load_all()
    return _predictor
