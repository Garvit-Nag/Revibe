import pandas as pd
from app.models.ml_models import MLModels

class RecommendationService:
    def __init__(self):
        self.ml_models = MLModels()
        # Ensure data is loaded
        self.ml_models.load_models()
    
    def get_recommendations_by_song(self, song_input):
        tracks = self.ml_models.tracks
        scaled_df = self.ml_models.scaled_df
        
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
        
        recommendations = cluster_songs.sample(min(10, len(cluster_songs)))
        recommendations = recommendations.sample(min(5, len(recommendations)))
        
        return self._format_recommendations(recommendations)
    
    def get_recommendations_by_artist_and_genre(self, artist_name, genre):
        tracks = self.ml_models.tracks
        scaled_df = self.ml_models.scaled_df
        scaler = self.ml_models.scaler
        kmeans = self.ml_models.kmeans
        
        matching_songs = tracks[(tracks['track_genre'].str.lower().str.contains(genre.lower(), na=False)) |
                              (tracks['artists'].str.lower().str.contains(artist_name.lower(), na=False))]
        
        if len(matching_songs) == 0:
            return {'error': "No matching songs found for the given artist or genre."}
            
        avg_features = matching_songs.loc[:, ['tempo', 'loudness', 'danceability', 'energy', 'acousticness',
                                            'instrumentalness', 'speechiness', 'liveness', 'valence']].mean().values
        
        input_df = pd.DataFrame({
            'tempo': [avg_features[0]],
            'loudness': [avg_features[1]],
            'track_genre_encoded': [tracks['track_genre_encoded'].mean()],
            'artists_encoded': [tracks['artists_encoded'].mean()],
            'danceability': [avg_features[2]],
            'energy': [avg_features[3]],
            'acousticness': [avg_features[4]],
            'instrumentalness': [avg_features[5]],
            'speechiness': [avg_features[6]],
            'liveness': [avg_features[7]],
            'valence': [avg_features[8]]
        })
        
        input_features = scaler.transform(input_df)
        closest_cluster = kmeans.predict(input_features)[0]
        cluster_songs = scaled_df[scaled_df['cluster'] == closest_cluster]
        
        recommendations = cluster_songs.sample(min(10, len(cluster_songs)))
        recommendations = recommendations.sample(min(5, len(recommendations)))
        
        return self._format_recommendations(recommendations)
    
    def _format_recommendations(self, recommendations):
        tracks = self.ml_models.tracks
        recommended_song_names = tracks.loc[recommendations.index, 'track_name']
        recommended_artist_names = tracks.loc[recommendations.index, 'artists']
        
        return [{'song_name': song_name, 'artist': artist} 
                for song_name, artist in zip(recommended_song_names, recommended_artist_names)]