#!/usr/bin/env python
"""Train breast cancer models"""

from breast_cancer_model import BreastCancerPredictor

if __name__ == '__main__':
    predictor = BreastCancerPredictor(models_dir='models')
    predictor.train()
