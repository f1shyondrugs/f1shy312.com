from flask import Flask, render_template, jsonify, request, redirect, session
import json
import os
import spotipy
import time
from spotipy.oauth2 import SpotifyOAuth

app = Flask(__name__)
app.secret_key = os.urandom(24)

def setvars():
    global SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET, SPOTIPY_REDIRECT_URI, SCOPE
    SPOTIPY_CLIENT_ID = "SPOTIPY_CLIENT_ID"
    SPOTIPY_CLIENT_SECRET = "SPOTIPY_CLIENT_SECRET"
    SPOTIPY_REDIRECT_URI = 'SPOTIPY_REDIRECT_URI'

    SCOPE = 'SCOPES'
setvars()

sp_oauth = SpotifyOAuth(
    client_id=SPOTIPY_CLIENT_ID,
    client_secret=SPOTIPY_CLIENT_SECRET,
    redirect_uri=SPOTIPY_REDIRECT_URI,
    scope=SCOPE,
    cache_path='.spotipyoauthcache',
    show_dialog=True
)


@app.route('/spotify-search', methods=['POST'])
def spotify_search():
    token_info = sp_oauth.get_cached_token()
    
    if not token_info:
        return jsonify({"status": "not_authenticated"})
    
    sp = spotipy.Spotify(auth=token_info['access_token'])
    query = request.json.get('query', '')
    
    try:
        results = sp.search(query, limit=5, type='track')
        tracks = []
        
        for track in results['tracks']['items']:
            tracks.append({
                'id': track['id'],
                'name': track['name'],
                'artist': track['artists'][0]['name'],
                'album': track['album']['name'],
                'uri': track['uri']
            })
        
        return jsonify({
            "status": "success",
            "tracks": tracks
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/spotify-play', methods=['POST'])
def spotify_play():
    token_info = sp_oauth.get_cached_token()
    
    if not token_info:
        return jsonify({"status": "error", "message": "Not authenticated with Spotify"})
    
    sp = spotipy.Spotify(auth=token_info['access_token'])
    uri = request.json.get('uri', '')
    
    if not uri:
        return jsonify({"status": "error", "message": "No track URI provided"})
    
    try:
        devices = sp.devices()
        
        if not devices['devices']:
            return jsonify({"status": "error", "message": "No active Spotify devices found. Please open Spotify on a device."})
        
        active_device = None
        for device in devices['devices']:
            if device['is_active']:
                active_device = device
                break
        
        if not active_device:
            active_device = devices['devices'][0]
        
        device_id = active_device['id']
        
        current_playback = sp.current_playback()
        
        try:
            if not current_playback:
                sp.start_playback(device_id=device_id, uris=[uri])
            else:
                sp.start_playback(device_id=device_id, uris=[uri])
            
            return jsonify({
                "status": "success",
                "message": "Playback started",
                "device": active_device['name']
            })
            
        except spotipy.exceptions.SpotifyException as e:
            error_message = str(e)
            if "Player command failed" in error_message:
                sp.transfer_playback(device_id=device_id, force_play=False)
                time.sleep(1)
                sp.start_playback(device_id=device_id, uris=[uri])
                return jsonify({
                    "status": "success",
                    "message": "Playback started after device transfer",
                    "device": active_device['name']
                })
            else:
                raise e
                
    except spotipy.exceptions.SpotifyException as e:
        return jsonify({
            "status": "error",
            "message": f"Spotify error: {str(e)}",
            "error_details": str(e)
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Unexpected error: {str(e)}",
            "error_details": str(e)
        })

@app.route('/spotify-skip', methods=['POST'])
def spotify_skip():
    token_info = sp_oauth.get_cached_token()

    if not token_info:
        return jsonify({"status": "not_authenticated"})

    sp = spotipy.Spotify(auth=token_info['access_token'])

    try:
        sp.next_track()
        return jsonify({"status": "success", "message": "Track skipped"})
    except spotipy.exceptions.SpotifyException as e:
        return jsonify({"status": "error", "message": str(e)})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/spotify-previous', methods=['POST'])
def spotify_previous():
    token_info = sp_oauth.get_cached_token()

    if not token_info:
        return jsonify({"status": "not_authenticated"})

    sp = spotipy.Spotify(auth=token_info['access_token'])

    try:
        sp.previous_track()
        return jsonify({"status": "success", "message": "Track moved to previous"})
    except spotipy.exceptions.SpotifyException as e:
        return jsonify({"status": "error", "message": str(e)})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/spotify-pause-play', methods=['POST'])
def spotify_pause_play():
    token_info = sp_oauth.get_cached_token()

    if not token_info:
        return jsonify({"status": "not_authenticated"})

    sp = spotipy.Spotify(auth=token_info['access_token'])

    try:
        playback_state = sp.current_playback()
        if playback_state and playback_state['is_playing']:
            sp.pause_playback()
            return jsonify({"status": "success", "message": "Playback paused"})
        else:
            sp.start_playback()
            return jsonify({"status": "success", "message": "Playback started"})
    except spotipy.exceptions.SpotifyException as e:
        return jsonify({"status": "error", "message": str(e)})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


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
