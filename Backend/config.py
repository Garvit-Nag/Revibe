import os

class Config:
    DEBUG = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    PORT = int(os.environ.get('PORT', 5000))
    DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ml_models')