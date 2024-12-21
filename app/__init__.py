import os
from flask import Flask, request
from werkzeug.middleware.proxy_fix import ProxyFix
from .routes import main
from .socketio import socketio

class Config:
    APP = os.path.abspath(os.path.dirname(__file__))
    BACKEND = os.path.join(APP, 'backend')

def IMLD():
    return app, socketio

app = Flask(__name__)
socketio.init_app(app)
app.register_blueprint(main)
app.config.from_object(Config)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

@app.before_request
def log_request():
    print(f"Request path: {request.path}")