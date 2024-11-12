import os
from flask import Flask
from .routes import main

class Config:
    APP = os.path.abspath(os.path.dirname(__file__))
    BACKEND = os.path.join(APP, 'backend')

def IMLD():
    return app

app = Flask(__name__)
app.register_blueprint(main)
app.config.from_object(Config)





