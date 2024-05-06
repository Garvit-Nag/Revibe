from flask import Flask, request, jsonify
import pandas as pd
from joblib import load
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow CORS for all routes

# Load the original dataset
tracks = pd.read_csv('tracks.csv')

# Load the necessary data and models
tracks = pd.read_csv('tracks.csv')
scaled_df = pd.read_csv('scaled_df.csv')
scaler = load('scaler.joblib')
kmeans = load('revibe.joblib')
label_encoder_artists = load('label_encoder_artists.joblib')
label_encoder_genre = load('label_encoder_genre.joblib')

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        # Get the JSON data from the frontend
        data = request.get_json()

        # Extract song, artist, and genre from the JSON data
        song_name = data.get('song', '')
        artist_name = data.get('artist', '')
        genre_name = data.get('genre', '')

        # Call function to get recommendations based on received data
        recommendations = get_recommendations(song_name, genre_name, artist_name, tracks, scaled_df, scaler, kmeans, label_encoder_artists, label_encoder_genre)

        # Return recommendations as JSON response
        return jsonify(recommendations)

    except Exception as e:
        # Handle any exceptions and return an error message
        error_message = f"An error occurred: {str(e)}"
        return jsonify({'error': error_message}), 500

def get_recommendations(song_name, genre, artist_name, tracks, scaled_df, scaler, kmeans, label_encoder_artists, label_encoder_genre):
    # Check if either song_name is provided or both genre and artist_name are provided
    if song_name:
        # Step 3: Query the database based on song_name
        matching_songs = tracks[tracks['track_name'].str.contains(song_name, case=False)]
        if len(matching_songs) == 0:
            # Try matching with artist name as well
            song_name, artist_from_input = song_name.split(' - ', 1)
            matching_songs = tracks[(tracks['track_name'].str.contains(song_name, case=False)) &
                                    (tracks['artists'].str.contains(artist_from_input, case=False))]
    elif genre and artist_name:
            # Step 3: Query the database based on genre and artist_name
            genre_matching_songs = tracks[tracks['track_genre'].str.lower().str.contains(genre.lower())]
            artist_matching_songs = tracks[tracks['artists'].str.lower().str.contains(artist_name.lower())]
            matching_songs = pd.concat([genre_matching_songs, artist_matching_songs])    
    else:
            return "Error: You must provide either a song name or both genre and artist name."

    if len(matching_songs) == 0:
        return "No matching songs found."
    else:
        # Step 4: User Input for Song Selection
        selected_song_idx = matching_songs.index[0]  # Select the first matching song

        if song_name:
            # Extract selected features for the song
            selected_features = matching_songs.loc[selected_song_idx, ['tempo', 'loudness', 'track_genre_encoded', 'artists_encoded',
                                                                        'danceability', 'energy', 'acousticness', 'instrumentalness',
                                                                        'speechiness', 'liveness', 'valence']].values.reshape(1, -1)
        else:
            # Calculate average of selected features for the matching songs
            avg_features = matching_songs.loc[:, ['tempo', 'loudness', 'danceability', 'energy', 'acousticness',
                                                'instrumentalness', 'speechiness', 'liveness', 'valence']].mean().values

            # Create a new DataFrame with the required features
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
            # Normalize the input data using the same scaler as the training data
            input_features = scaler.transform(input_df)

            # Predict the closest cluster centroid to the input features
            closest_cluster = kmeans.predict(input_features)[0]
            # Get the songs from the closest cluster
            cluster_songs = scaled_df[scaled_df['cluster'] == closest_cluster].sample(5)

        # Recommendations based on selected song or genre/artist
        if song_name:
            selected_song_cluster = scaled_df.loc[selected_song_idx, 'cluster']
            recommendations = scaled_df[scaled_df['cluster'] == selected_song_cluster].sample(5)
            # Retrieve the song names and artist names for the recommended songs
            recommended_song_names = tracks.loc[recommendations.index, 'track_name']
            recommended_artist_names = tracks.loc[recommendations.index, 'artists']

            # Prepare the recommendations as a list of dictionaries
            recommendations_list = [{'song_name': song_name, 'artist': artist} for song_name, artist in
                                    zip(recommended_song_names, recommended_artist_names)]

            return recommendations_list
        else:
           # Retrieve the song names and artist names for the recommended songs
            recommended_song_names = tracks.loc[cluster_songs.index, 'track_name']
            recommended_artist_names = tracks.loc[cluster_songs.index, 'artists']
            # Prepare the recommendations as a list of dictionaries
            recommendations_list = [{'song_name': song_name, 'artist': artist} for song_name, artist in
                                    zip(recommended_song_names, recommended_artist_names)]

            return recommendations_list

if __name__ == '__main__':
    app.run(debug=True) 