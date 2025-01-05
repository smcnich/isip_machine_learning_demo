import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app', 'backend'))

from app import IMLD

app, socketio = IMLD()

if __name__ == '__main__':

    # run the application as a web socket
    #
    socketio.run(app, debug=True)
