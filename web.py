from flask import Flask, render_template, jsonify, request, redirect, session
import json
import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth

app = Flask(__name__)
app.secret_key = os.urandom(24)

def setvars():
    global SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET, SPOTIPY_REDIRECT_URI, SCOPE
    SPOTIPY_CLIENT_ID = "YOUR-CLIENT-ID"
    SPOTIPY_CLIENT_SECRET = "YOUR-CLIENT-SECRET"
    SPOTIPY_REDIRECT_URI = 'YOUR-REDIRECT-URI'
    SCOPE = 'CURRENTLY-PLAYING-USER'
setvars()

sp_oauth = SpotifyOAuth(
    client_id=SPOTIPY_CLIENT_ID,
    client_secret=SPOTIPY_CLIENT_SECRET,
    redirect_uri=SPOTIPY_REDIRECT_URI,
    scope=SCOPE,
    cache_path='.spotipyoauthcache',
    show_dialog=True
)

@app.route('/spotify-login')
def spotify_login():
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session['token_info'] = token_info
    return redirect('/')

@app.route('/now-playing')
def now_playing():
    token_info = sp_oauth.get_cached_token()
    
    if not token_info:
        return jsonify({"status": "not_authenticated"})
    
    sp = spotipy.Spotify(auth=token_info['access_token'])
    
    try:
        current_track = sp.current_user_playing_track()
        
        if current_track is None:
            return jsonify({"status": "not_playing"})
        
        track_info = {
            "status": "playing",
            "track_name": current_track['item']['name'],
            "artist": current_track['item']['artists'][0]['name'],
            "album_art": current_track['item']['album']['images'][0]['url'],
            "spotify_link": current_track['item']['external_urls']['spotify']
        }
        
        return jsonify(track_info)
    
    except spotipy.exceptions.SpotifyException:
        return jsonify({"status": "not_authenticated"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/aboutme')
def aboutme():
    return render_template('aboutme.html')

if __name__ == '__main__':
    app.run(port=5500, debug=True)