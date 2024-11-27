import os
import json
from flask import Blueprint, render_template, request, jsonify, current_app

import nedc_ml_tools_data as mltd
import nedc_imld_tools as imld
import nedc_ml_tools as mlt
from collections import OrderedDict

# Create a Blueprint
#
main = Blueprint('main', __name__)

# create a global variable to hold the model
#
model = None

# Define a route within the Blueprint
@main.route('/')
def index():
    return render_template('index.shtml')

@main.route('/api/get_alg_params/', methods=['GET'])
def get_alg_params():

    # get the default parameter file. do not do this as a global variable
    # because the 'current_app.config' object only works in a route
    #
    pfile = os.path.join(current_app.config['BACKEND'], 'imld_alg_params.json')

    with open(pfile, 'r') as file:
        data = json.load(file)

    # Convert data to an OrderedDict to preserve the order of keys
    ordered_data = OrderedDict(data)

    # Manually serialize the ordered data and return it as JSON
    return current_app.response_class(
        json.dumps(ordered_data),  # Serialize ordered data to JSON
        mimetype='application/json'
    )

@main.route('/api/get_data_params/', methods=['GET'])
def get_data_params():

    # get the default parameter file. do not do this as a global variable
    # because the 'current_app.config' object only works in a route
    #
    pfile = os.path.join(current_app.config['BACKEND'], 'imld_data_params.json')

    with open(pfile, 'r') as file:
        data = json.load(file)

    # Convert data to an OrderedDict to preserve the order of keys
    ordered_data = OrderedDict(data)

    # Manually serialize the ordered data and return it as JSON
    return current_app.response_class(
        json.dumps(ordered_data),  # Serialize ordered data to JSON
        mimetype='application/json'
    )

@main.route('/api/train/', methods=['POST'])
def train():
    
    # get the data from the request
    #
    data = request.get_json()

    # get the data and algorithm parameters
    #
    params = data['params']
    algo = data['algo']
    x = data['plotData']['x']
    y = data['plotData']['y']
    labels = data['plotData']['labels']

    # create the model given the parameters
    #
    model = imld.create_model(algo, {"name": algo, "params": params})

    # create the data object
    #
    data = imld.create_data(x, y, labels)

    # train the model
    #
    model, _, _ = imld.train(model, data)

    # get the x y and z values from the decision surface
    # x and y will be 1D and z will be 2D
    #
    x, y, z = imld.generate_decision_surface(data, model)

    # format the response
    #
    response = {
        'xx': x.tolist(), 
        'yy': y.tolist(), 
        'z': z.tolist()
    }
    
    # return the jsonified response
    #
    return jsonify(response)
#
# end of function

@main.route('/api/data_gen/', methods=['POST'])
def data_gen():
    
    # Get the data sent in the POST request as JSON
    data = request.get_json()

    if data:
        # Process the received data (e.g., save to database, validate, etc.)
        key = data[0]
        paramsDict = data[1]

        print(paramsDict)

        # Send a response back to the frontend
        return jsonify({"status": "success", "message": "Parameters received", "data": data}), 200
    else:
        return jsonify({"status": "error", "message": "No data received"}), 400

    # TODO: get the data from the request and use it to generate the data

    # generate the data in the correct format
    #
    #data = imld.generate_data()

    # exit gracefully
    #
    #return jsonify(data)
#
# end of function
