# future flask stuff
from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('.', 'logo.jpg', mimetype='image/jpeg')

@app.route('/projects')
def projects():
    return send_from_directory('.', 'projects.html')

@app.route('/software')
def software():
    return send_from_directory('.', 'software.html')

@app.route('/hardware')
def hardware():
    return send_from_directory('.', 'hardware.html')

@app.route('/cybersecurity')
def cybersecurity():
    return send_from_directory('.', 'cybersecurity.html')
    
@app.route('/outside')
def outside():
    return send_from_directory('.', 'outside.html')

@app.route('/graphic-design')
def graphic_design():
    return send_from_directory('.', 'graphic-design.html')

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5500)