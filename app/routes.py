from flask import Blueprint, render_template, request, jsonify

import nedc_ml_tools_data as mltd
import nedc_imld_tools as nit
import nedc_ml_tools as mlt

# Create a Blueprint
main = Blueprint('main', __name__)

model = None

# Define a route within the Blueprint
@main.route('/')
def index():
    return render_template('index.shtml')

@main.route('/api/data_gen/', methods=['POST'])
def data_gen():
    return "hello"

