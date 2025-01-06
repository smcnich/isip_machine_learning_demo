from flask_socketio import SocketIO

# initalize the socketio app
#
socketio = SocketIO()

def callback(destination, msg):
    """
    Emit real-time updates to the frontend using WebSockets.
    """
    socketio.emit(destination, msg)