from flask import Blueprint, render_template

# Create a Blueprint
main = Blueprint('main', __name__)

# Define a route within the Blueprint
@main.route('/')
def index():
    return render_template('index.shtml')