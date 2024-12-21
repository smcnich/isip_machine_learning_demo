import sys
import os

# Get the parent directory of the current file
parent_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
sys.path.append(parent_directory)

from app.socketio import socketio

def callback(destination, msg):
    """
    Emit real-time updates to the frontend using WebSockets.
    """
    socketio.emit(destination, msg)