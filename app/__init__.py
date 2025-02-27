from os.path import abspath

from .extensions.base import app
from .extensions.blueprint import main
from .extensions.scheduler import scheduler


class IMLD():
    def __init__(self):

        # add the root path to the app
        #
        app.set_root(abspath(__file__))

        # add the blueprint to the app
        #
        app.register_blueprint(main)

        # Initialize and start the scheduler
        #
        scheduler.init_app(app)
        scheduler.start()

    def run(self):
        app.run(debug=True)
