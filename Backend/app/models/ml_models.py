import pandas as pd
from joblib import load
import os
import logging
from config import Config

logger = logging.getLogger(__name__)

class MLModels:
    _instance = None
    _is_loaded = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MLModels, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        self.tracks = None
        self.scaled_df = None
        self.scaler = None
        self.kmeans = None
        self.label_encoder_artists = None
        self.label_encoder_genre = None
        self._initialized = True
    
    def load_models(self):
        """Load all required models and data if not already loaded"""
        if not self._is_loaded:
            try:
                logger.info("Loading data and models...")
                
                # Use Config paths
                self.tracks = pd.read_csv(os.path.join(Config.DATA_DIR, 'tracks.csv'))
                self.scaled_df = pd.read_csv(os.path.join(Config.DATA_DIR, 'scaled_df.csv'))
                self.scaler = load(os.path.join(Config.MODEL_DIR, 'scaler.joblib'))
                self.kmeans = load(os.path.join(Config.MODEL_DIR, 'revibe.joblib'))
                self.label_encoder_artists = load(os.path.join(Config.MODEL_DIR, 'label_encoder_artists.joblib'))
                self.label_encoder_genre = load(os.path.join(Config.MODEL_DIR, 'label_encoder_genre.joblib'))
                
                self._is_loaded = True
                logger.info("Data and models loaded successfully")
            except Exception as e:
                logger.error(f"Error loading models: {str(e)}")
                raise
    
    @property
    def is_loaded(self):
        return self._is_loaded