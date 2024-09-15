from flask import Flask, render_template
from .routes import main

app = Flask(__name__)
app.register_blueprint(main)

def IMLD():
    return app
