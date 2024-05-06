from flask import Flask, request, jsonify
import pandas as pd
from joblib import load
from joblib import dump
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
    elif genre and artist_name:
        # Step 3: Query the database based on genre and artist_name
        matching_songs = tracks[tracks['track_genre'].str.contains(genre, case=False) & tracks['artists'].str.contains(artist_name, case=False)]
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
            # Calculate average of selected features for the genre and artist
            avg_features = matching_songs.loc[:, ['tempo', 'loudness', 'danceability', 'energy', 'acousticness',
                                                   'instrumentalness', 'speechiness', 'liveness', 'valence']].mean().values
            # Use genre and artist to get their encoded values
            selected_genre_encoded = matching_songs.at[selected_song_idx, 'track_genre_encoded']
            selected_artist_encoded = matching_songs.at[selected_song_idx, 'artists_encoded']
            # Concatenate the encoded genre and artist with average features
            selected_features = np.concatenate(([selected_genre_encoded, selected_artist_encoded], avg_features)).reshape(1, -1)

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
            genre_encoded = label_encoder_genre.transform([genre])[0]
            artist_encoded = label_encoder_artists.transform([artist_name])[0]
            centroid_features = np.array([genre_encoded, artist_encoded] +
                                         matching_songs[['tempo', 'loudness', 'danceability', 'energy', 'acousticness',
                                                        'instrumentalness', 'speechiness', 'liveness', 'valence']].mean().tolist()).reshape(1, -1)
            closest_songs = kmeans.predict(centroid_features)
            cluster_songs = scaled_df[scaled_df['cluster'] == closest_songs[0]]
            # Retrieve the song names for the recommended songs
            recommended_song_names = tracks.loc[cluster_songs.index, 'track_name']
            recommended_artist_names = tracks.loc[cluster_songs.index, 'artists']
            # Prepare the recommendations as a list of dictionaries
            recommendations_list = [{'song_name': song_name, 'artist': artist} for song_name, artist in
                                    zip(recommended_song_names, recommended_artist_names)]

            return recommendations_list

if __name__ == '__main__':
    app.run(debug=True)