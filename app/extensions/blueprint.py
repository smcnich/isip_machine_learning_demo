import os
import json
import io
import pickle
from collections import OrderedDict
from datetime import datetime
from flask import Blueprint, render_template, request, jsonify, current_app, send_file

import nedc_ml_tools_data as mltd
import nedc_imld_tools as imld
import nedc_ml_tools as mlt

from .socketio import callback

# Create a Blueprint
#
main = Blueprint('main', __name__)

# create a global variable to hold the models
#
model_cache = {}


def clean_cache():

    # get the current time
    #
    now = datetime.now()

    # iterate through the model cache and remove any models that are older than 5 minutes
    #
    for key in list(model_cache.keys()):
        if (now - model_cache[key]['timestamp']).seconds > 300:
            del model_cache[key]
#
# end of function

# Define a route within the Blueprint
#
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
    #
    ordered_data = OrderedDict(data)

    # Manually serialize the ordered data and return it as JSON
    #
    return current_app.response_class(
        json.dumps(ordered_data),  # Serialize ordered data to JSON
        mimetype='application/json'
    )

@main.route('/api/save_model/', methods=['POST'])
def save_model():

    # get the data from the request
    #
    data = request.get_json()

    # get the user id
    #
    userID = data['userID']

    # retrieve model with corresponding user id key
    #
    model = model_cache[userID]['model']

    model.mapping_label = data['label_mappings']

    # Serialize the model using pickle and store it in a BytesIO stream
    #
    model_bytes = io.BytesIO()
    pickle.dump(model, model_bytes)
    model_bytes.seek(0)  # Reset the pointer to the beginning of the stream
    
    # Send the pickled model as a response, without writing to a file
    #
    return send_file(model_bytes, as_attachment=True, download_name=f'model.pkl', mimetype='application/octet-stream')

@main.route('/api/load_model/', methods=['POST'])
def load_model():

    # get the file, userID, and plot bounds from the request
    #
    file = request.files['model']
    user_ID = request.form.get('userID')
    x = json.loads(request.form.get('x'))
    y = json.loads(request.form.get('y'))
    xrange = json.loads(request.form.get('xrange'))
    yrange = json.loads(request.form.get('yrange'))

    # read the model file
    #
    model_bytes = file.read()

    # unpickle the model as BytesIO stream
    #
    model = pickle.loads(model_bytes)

    # save the model to the corresponding userID
    #
    model_cache[user_ID] = {
        'model': model,
        'timestamp': datetime.now()
    }

    # create the data object
    # this should only have a single x and y value
    # representing the bounds of the plot
    # no labels are needed
    #
    data = imld.create_data(x, y, [])

    # set the mapping label
    # make sure to flip the mapping label so it is {numeric : name}
    #
    data.mapping_label = {value: key for key, value in model.mapping_label.items()}

    # get the x y and z values from the decision surface
    # x and y will be 1D and z will be 2D
    #
    x, y, z = imld.generate_decision_surface(data, model, xrange=xrange,
                                             yrange=yrange)

    # format the response
    #
    response = {
        'decision_surface': {
            'x': x.tolist(), 
            'y': y.tolist(), 
            'z': z.tolist()
        },
        'mapping_label': model.mapping_label
    }

    # return the jsonified response
    #
    return jsonify(response)

    # try: 

    
    # except Exception as e:
    #     # return error message if model did not load
    #     #
    #     return f'Failed to load model: {e}', 500

@main.route('/api/issue_log/', methods=['POST'])
def write_issue():

    try:
        # Get JSON data from the request
        #
        data = request.get_json()

        # Extract title and message from the data
        #
        title = data.get('title', 'No Title')
        message = data.get('message', 'No Message')

        # Get the current date in the format month/day/year
        #
        current_date = datetime.now().strftime('%m/%d/%Y')

        # Format the log entry
        #
        log_entry = f"Date: {current_date}\nTitle: {title}\nIssue: {message}\n\n"

        # Debug line to check if the file exists in the target folder
        #
        if os.path.exists(current_app.config['LOG_FILE_PATH']):
            print(f"{current_app.config['LOG_FILE_PATH']} exists.")
        else:
            print(f"{current_app.config['LOG_FILE_PATH']} does not exist, creating a new file.")

        # Write to the file
        #
        with open(current_app.config['LOG_FILE_PATH'], 'a') as file:
            file.write(log_entry)

        # Return a success response
        #
        return {'status': 'success', 'message': 'Issue logged successfully'}, 200

    except Exception as e:
        # Handle any errors and return a failure response
        #
        return {'status': 'error', 'message': str(e)}, 500
    
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
    xrange = data['xrange']
    yrange = data['yrange']


    try:

        # create the model given the parameters
        #
        model = imld.create_model(algo, {"name": algo, "params": params})

        # create the data object
        #
        data = imld.create_data(x, y, labels)
        callback('trainProgressBar', {'trainProgress': 5})

        # train the model
        #
        model, metrics = imld.train(model, data)
        callback('trainProgressBar', {'trainProgress': 20})

        # get the x y and z values from the decision surface
        # x and y will be 1D and z will be 2D
        #
        x, y, z = imld.generate_decision_surface(data, model, xrange=xrange,
                                                 yrange=yrange)
        callback('trainProgressBar', {'trainProgress': 80})

        # format the response
        #
        response = {
            'decision_surface': {
                'x': x.tolist(), 
                'y': y.tolist(), 
                'z': z.tolist()
            },
            # flip the mapping label to it is {label name : numeric value} as 
            # opposed to {numeric value : label name} because that is easier
            # to work with on the front end
            'mapping_label': {value: key for key, value in data.mapping_label.items()},
            'metrics': metrics
        }

        # save the model in the cache
        #
        model_cache[userID] = {
            'model': model,
            'timestamp': datetime.now()
        }
        
        callback('trainProgressBar', {'trainProgress': 100})
        
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
        model = model_cache[userID]['model']

        # create the data object
        #
        data = imld.create_data(x, y, labels)

        callback('evalProgressBar', {'evalProgress': 30})

        # evaluate the model
        #
        metrics = imld.predict(model, data)

        callback('evalProgressBar', {'evalProgress': 100})

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
        key = data['key']
        paramsDict = data['params']

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
