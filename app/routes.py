import os
import json
import sys
from flask import Blueprint, render_template, request, jsonify, current_app
sys.path.append('/backend/')

import nedc_ml_tools_data as mltd
import nedc_imld_tools as imld
import nedc_ml_tools as mlt
from collections import OrderedDict

# Create a Blueprint
#
main = Blueprint('main', __name__)

# create a global variable to hold the models
#
model_cache = {}

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
    userID = data['userID']
    params = data['params']
    algo = data['algo']
    x = data['plotData']['x']
    y = data['plotData']['y']
    labels = data['plotData']['labels']

    try:

        # create the model given the parameters
        #
        model = imld.create_model(algo, {"name": algo, "params": params})

        # create the data object
        #
        data = imld.create_data(x, y, labels)

        # train the model
        #
        model, metrics = imld.train(model, data)

        # get the x y and z values from the decision surface
        # x and y will be 1D and z will be 2D
        #
        x, y, z = imld.generate_decision_surface(data, model)

        # format the response
        #
        response = {
            'decision_surface': {
                'x': x.tolist(), 
                'y': y.tolist(), 
                'z': z.tolist()
            },
            'metrics': metrics
        }

        # save the model in the cache
        #
        model_cache[userID] = model
        
        # return the jsonified response
        #
        return jsonify(response)
    
    # Handle any exceptions and return an error message
    #          
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
#
# end of function
    
@main.route('/api/eval/', methods=['POST'])
def eval():

    # get the data from the request
    #
    data = request.get_json()

    # get the data and algorithm parameters
    #
    userID = data['userID']
    x = data['plotData']['x']
    y = data['plotData']['y']
    labels = data['plotData']['labels']

    try:

        # get the model from the cache
        #
        model = model_cache[userID]

        # create the data object
        #
        data = imld.create_data(x, y, labels)

        # evaluate the model
        #
        metrics = imld.predict(model, data)

        # return the jsonified response
        #
        return jsonify(metrics)
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
#
# end of function
    
@main.route('/api/data_gen/', methods=['POST'])
def data_gen():

    # Get the data sent in the POST request as JSON
    #
    data = request.get_json()

    # Extract the key and parameters from the received data
    #
    if data:
        key = data[0]
        paramsDict = data[1]

    try:

        # generate values for labels, x, y
        #
        labels, x, y = imld.generate_data(key, paramsDict)

        # Prepare the response data
        #
        response_data = {
            "labels": labels,
            "x": x,
            "y": y
        }

        # Return the response in JSON format
        #
        return jsonify(response_data)

    # Handle any exceptions and return an error message
    #    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
#
# end of function
