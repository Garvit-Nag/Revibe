from flask import Blueprint, jsonify, request
from app.services.recommendation import RecommendationService
import logging

bp = Blueprint('recommendation', __name__)
logger = logging.getLogger(__name__)

@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@bp.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        song_input = data.get('song', '').strip()
        artist_input = data.get('artist', '').strip()
        genre_input = data.get('genre', '').strip()
        
        recommendation_service = RecommendationService()
        
        if song_input:
            recommendations = recommendation_service.get_recommendations_by_song(song_input)
        elif artist_input and genre_input:
            recommendations = recommendation_service.get_recommendations_by_artist_and_genre(artist_input, genre_input)
        else:
            return jsonify({'error': 'Invalid input. Please provide either a song or both artist and genre.'}), 400
            
        if isinstance(recommendations, dict) and 'error' in recommendations:
            return jsonify(recommendations), 400
            
        return jsonify(recommendations)
        
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
