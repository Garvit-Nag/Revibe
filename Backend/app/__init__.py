from flask import Flask
from flask_cors import CORS
from config import Config
import logging

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Register blueprints
    from app.routes.recommendation import bp as recommendation_bp
    app.register_blueprint(recommendation_bp)
    
    return app