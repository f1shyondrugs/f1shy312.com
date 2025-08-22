# future flask stuff
from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/projects')
def projects():
    return send_from_directory('.', 'projects.html')

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5500)