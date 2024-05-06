from flask import Flask, request, jsonify
import pandas as pd
from joblib import load
from joblib import dump
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Load the original dataset
tracks = pd.read_csv('tracks.csv')

# Load the preprocessed dataset
scaled_df = pd.read_csv('scaled_df.csv')

# Load the trained models
scaler = load('scaler.joblib')
kmeans = load('revibe.joblib')

# Load the encoders
label_encoder_artists = load('label_encoder_artists.joblib')
label_encoder_genre = load('label_encoder_genre.joblib')
label_encoder_album = load('label_encoder_album.joblib')

# Re-save the models
dump(scaler, 'scaler.joblib')
dump(kmeans, 'revibe.joblib')
dump(label_encoder_artists, 'label_encoder_artists.joblib')
dump(label_encoder_genre, 'label_encoder_genre.joblib')
dump(label_encoder_album, 'label_encoder_album.joblib')

@app.route('/recommend', methods=['POST'])
def recommend():
    song_name = request.args.get('song')
    genre = request.args.get('genre')
    artist_name = request.args.get('artist')

    recommendations = get_recommendations(song_name, genre, artist_name, tracks, scaled_df, scaler, kmeans, label_encoder_artists, label_encoder_genre)

    return jsonify(recommendations)
def get_recommendations(song_name, genre, artist_name, tracks, scaled_df, scaler, kmeans, label_encoder_artists, label_encoder_genre):
    # Step 3: Query the database based on user input
    matching_songs = tracks
    if song_name:
        matching_songs = matching_songs[matching_songs['track_name'].str.contains(song_name, case=False)]
    if genre:
        matching_songs = matching_songs[matching_songs['track_genre'].str.contains(genre, case=False)]
    if artist_name:
        matching_songs = matching_songs[matching_songs['artists'].str.contains(artist_name, case=False)]

    # Check if at least one field is filled
    if not song_name and not (genre and artist_name):
        return "Error: You must fill at least one field."
    elif len(matching_songs) == 0:
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
            # If skipping, calculate average of selected features for the genre and artist
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