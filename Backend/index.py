from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from joblib import load
import numpy as np
import logging
import os
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for data and models
tracks = None
scaled_df = None
scaler = None
kmeans = None
label_encoder_artists = None
label_encoder_genre = None

def load_data():
    global tracks, scaled_df, scaler, kmeans, label_encoder_artists, label_encoder_genre
    if tracks is None:
        logger.info("Loading data and models...")
        tracks = pd.read_csv('tracks.csv')
        scaled_df = pd.read_csv('scaled_df.csv')
        scaler = load('scaler.joblib')
        kmeans = load('revibe.joblib')
        label_encoder_artists = load('label_encoder_artists.joblib')
        label_encoder_genre = load('label_encoder_genre.joblib')
        logger.info("Data and models loaded successfully")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        load_data()  # Ensure data is loaded
        data = request.get_json()
        song_input = data.get('song', '').strip()
        artist_input = data.get('artist', '').strip()
        genre_input = data.get('genre', '').strip()

        if song_input:
            # Option 1: Song and Artist
            recommendations = get_recommendations_by_song(song_input)
        elif artist_input and genre_input:
            # Option 2: Artist and Genre
            recommendations = get_recommendations_by_artist_and_genre(artist_input, genre_input)
        else:
            return jsonify({'error': 'Invalid input. Please provide either a song or both artist and genre.'}), 400

        if isinstance(recommendations, dict) and 'error' in recommendations:
            return jsonify(recommendations), 400

        return jsonify(recommendations)

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

def get_recommendations_by_song(song_input):
    global tracks, scaled_df

    parts = song_input.rsplit(' - ', 1)
    if len(parts) != 2:
        return {'error': "Invalid song input format. Please use 'Song Name - Artist Name'."}
    
    song_name, artist_from_input = parts
    matching_songs = tracks[(tracks['track_name'].str.contains(song_name, case=False, na=False)) &
                            (tracks['artists'].str.contains(artist_from_input, case=False, na=False))]

    if len(matching_songs) == 0:
        return {'error': "No matching songs found."}

    selected_song_idx = matching_songs.index[0]
    selected_song_cluster = scaled_df.loc[selected_song_idx, 'cluster']
    cluster_songs = scaled_df[scaled_df['cluster'] == selected_song_cluster]
    
    # Get more recommendations than needed and randomly select from them
    recommendations = cluster_songs.sample(min(10, len(cluster_songs)))
    recommendations = recommendations.sample(min(5, len(recommendations)))

    return format_recommendations(recommendations)

def get_recommendations_by_artist_and_genre(artist_name, genre):
    global tracks, scaled_df, scaler, kmeans

    matching_songs = tracks[(tracks['track_genre'].str.lower().str.contains(genre.lower(), na=False)) |
                            (tracks['artists'].str.lower().str.contains(artist_name.lower(), na=False))]

    if len(matching_songs) == 0:
        return {'error': "No matching songs found for the given artist or genre."}

    avg_features = matching_songs.loc[:, ['tempo', 'loudness', 'danceability', 'energy', 'acousticness',
                                          'instrumentalness', 'speechiness', 'liveness', 'valence']].mean().values

    input_df = pd.DataFrame({'tempo': [avg_features[0]],
                             'loudness': [avg_features[1]],
                             'track_genre_encoded': [tracks['track_genre_encoded'].mean()],
                             'artists_encoded': [tracks['artists_encoded'].mean()],
                             'danceability': [avg_features[2]],
                             'energy': [avg_features[3]],
                             'acousticness': [avg_features[4]],
                             'instrumentalness': [avg_features[5]],
                             'speechiness': [avg_features[6]],
                             'liveness': [avg_features[7]],
                             'valence': [avg_features[8]]})
    input_features = scaler.transform(input_df)
    closest_cluster = kmeans.predict(input_features)[0]
    cluster_songs = scaled_df[scaled_df['cluster'] == closest_cluster]
    
    # Get more recommendations than needed and randomly select from them
    recommendations = cluster_songs.sample(min(10, len(cluster_songs)))
    recommendations = recommendations.sample(min(5, len(recommendations)))

    return format_recommendations(recommendations)

def format_recommendations(recommendations):
    recommended_song_names = tracks.loc[recommendations.index, 'track_name']
    recommended_artist_names = tracks.loc[recommendations.index, 'artists']

    return [{'song_name': song_name, 'artist': artist} for song_name, artist in
            zip(recommended_song_names, recommended_artist_names)]

if __name__ == '__main__':
    # Call load_data manually before running the app
    load_data()
    app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))