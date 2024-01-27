import time
from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello Flask'

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/filters')
def get_filters_from_firebase():
    print("Filter")
    print(request.data)

@app.route('/sync')
def sync_filters_with_gmail():
    print("Sync")
    print(request.data)
