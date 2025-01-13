from os.path import abspath

from .extensions.base import app
from .extensions.blueprint import main
from .extensions.socketio import socketio
from .extensions.scheduler import scheduler


class IMLD():
    def __init__(self):

        # add the root path to the app
        #
        app.set_root(abspath(__file__))

        # add the blueprint to the app
        #
        app.register_blueprint(main)

        # create a socketio instance that will be used to emit real-time updates
        # through the app
        #
        socketio.init_app(app)

        # Initialize and start the scheduler
        #
        scheduler.init_app(app)
        scheduler.start()

    def run(self):
        socketio.run(app, debug=True, log_output=False)
