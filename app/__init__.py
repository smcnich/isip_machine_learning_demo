import os
from flask import Flask, request
from werkzeug.middleware.proxy_fix import ProxyFix
from .routes import main

class Config:
    APP = os.path.abspath(os.path.dirname(__file__))
    BACKEND = os.path.join(APP, 'backend')

def IMLD():
    return app

app = Flask(__name__)
app.register_blueprint(main)
app.config.from_object(Config)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

@app.before_request
def log_request():
    print(f"Request path: {request.path}")





