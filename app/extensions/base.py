import os
from flask import Flask, request
from werkzeug.middleware.proxy_fix import ProxyFix

class Config():
    def __init__(self, root) -> None:
        self.APP = os.path.abspath(os.path.dirname(root))
        self.BACKEND = os.path.join(self.APP, 'backend')
        self.TEMPLATES = os.path.join(self.APP, 'templates')
        self.STATIC = os.path.join(self.APP, 'static')

        self.LOG_FILE_PATH = os.path.join(self.BACKEND, 'IssueLog.txt')
        
        
        self.SCHEDULER_API_ENABLED = True

class App(Flask):

    def __init__(self):

        super().__init__(__name__)
        
        # add the proxy fix to the app
        #
        self.wsgi_app = ProxyFix(self.wsgi_app, x_proto=1, x_host=1)

    def set_root(self, root):

        # create the configuration
        #
        config = Config(root)

        # add the configuration to the app
        #
        self.config.from_object(config)

        # Set the templates folder
        self.template_folder = config.TEMPLATES

        self.static_folder = config.STATIC
    
app = App()