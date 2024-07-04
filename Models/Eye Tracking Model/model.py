

from flask import Flask
from flask_socketio import SocketIO
from function import detect_cheating_realtime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

@socketio.on('get_detection_results')
def get_detection_results():
    detect_cheating_realtime(socketio)  # Pass socketio to detect_cheating function

if __name__ == "__main__":
    socketio.run(app, debug=True)
