import numpy as np
from math import floor, ceil

import nedc_ml_tools as mlt
import nedc_ml_tools_data as mltd
from nedc_file_tools import load_parameters

def create_model(alg_name:str, params=None) -> mlt.Alg:
    '''
    function: create_model

    args:
     alg_name (str): the name of the algorithm to use in the model
     params (dict) : a dictionary containing the parameters for the
                      algorithm. see ML Tools line 135 for an example.
                      [optional]

    return:
     mlt.Alg       : the ML Tools object that was created
    '''

    # create an instance of a ML Tools algorithm
    #
    model = mlt.Alg()

    # set the type of algorithm to use based on the name given
    #
    if model.set(alg_name) is False:
        return None

    # if algorithm parameters are given
    #
    if params is not None:

        # set the algorithm's parameters
        #
        if model.set_parameters(params) is False:
            return None
        
    # exit gracefully
    #
    return model
#
# end of function

def create_data(x:list, y:list, labels:list) -> mltd.MLToolsData:
    '''
    function: create_data

    args:
     x (np.ndarray) : the data to use in the ML Tools data object
     y (np.ndarray) : the labels to use in the ML Tools data object
     labels (np.ndarray): the labels to use in the ML Tools data object

    return:
     mltd.MLToolsData: the ML Tools data object created
    '''

    # create a numpy array from the data
    # make sure to stack the x and y data into a single array
    # ex: x = [1,2,3]
    #     y = [4,5,6]
    #     X = [[1,4],
    #          [2,5],
    #          [3,6]]
    #
    X = np.column_stack((x, y))

    # set the data and labels in the ML Tools data object
    #
    data = mltd.MLToolsData.from_data(X, labels)

    # exit gracefully
    #
    return data

def generate_data(dist_name:str, params:dict):
    '''
    function: generate_data

    arguments:
     dist_name (str) : name of the distribution to generate data from
     params (dict)   : the parameters for the distribution

    return:
     mltd.MLToolsData: a MLToolsData object populated with the data from the distribution
     X (list)        : the data generated from the distribution
     y (list)        : the labels generated from the distribution
    
    description:
     generate a MLToolsData object given a distribution name and the parameters
    '''

    # create a ML Tools data object using the class method
    #
    X, y = mltd.MLToolsData.generate_data(dist_name, params)

    # get the labels from the data
    #
    '''
    labels = set(data.labels)
    
    # get the indexes of each class
    #
    class_idxs = []
    for label in labels:
        class_idxs.append(np.where(data.labels == label))

    # format the data into a list of lists. each entry into the list
    # will be the data for a single class
    #
    X, y = [], []
    for idx in class_idxs:
        X.append(data.data[idx])
        y.append(data.labels[idx])
    '''
        
    labels = y.tolist()
    x = X[:,0].tolist()
    y = X[:,1].tolist()

    # exit gracefully
    #
    return labels, x, y
#
# end of function

# TODO: create the wrapper to train an algorithm, given data. make sure to
#       include error checking. see nedc_ml_tools.py line 1478.
def train(model:mlt.Alg, data:mltd.MLToolsData):
    '''
    function: train

    args:
     model (mlt.Alg)        : the ML Tools algorithm to train
     data (mltd.MLToolsData): the data to train the model on

    return:
     model (mlt.Alg)        : the trained model
     stats (dict)           : a dictionary of covariance, means and priors
     score (float)          : f1 score

     description:
      train a ML Tools model on a given set of data. The data must be in the
      MLToolData class. Return the trained model, a goodness of fit score, a
      the labels generated while calculating the goodness of fit score.    
    '''

    # train the model
    #
    model.train(data)

    # get the performance metrics of the model on the test data
    #
    metrics = predict(model, data)

    # return the trained model and the performance metrics
    #
    return model, metrics
#
# end of function

def predict(model:mlt.Alg, data:mltd.MLToolsData):
    '''
    function: predict

    args:
     model (mlt.Alg)        : the ML Tools trained model to use for predictions
     data (mltd.MLToolsData): the data to predict

    return:
     metrics (dict): a dictionary of the performance metrics of the model, including:
                        - confusion matrix
                        - sensitivity
                        - specificity
                        - precision
                        - accuracy
                        - error rate
                        - F1 score

    description:
     use a ML Tools trained model to predict unseen data. return vectors
     of the labels given to each index of the unseen data, and posterior
     probabilities of each class assignment for each index of the array
    '''

    # predict the labels of the data
    #
    hyp_labels, _ = model.predict(data)

    # get the performance metrics of the model
    #
    metrics = score(model, data, hyp_labels)

    # exit gracefully
    #
    return metrics
#
# end of function

'''
TODO: create the wrapper to score the predicted labels compared to the
      actual labels of a dataset. see nedc_ml_tools.py line 1730.
'''
def score(model:mlt.Alg, data:mltd.MLToolsData, hyp_labels:list):
    '''
    function: score

    args:
     num_classes (int): the number of classes
     data (mltd.MLToolsData): the input data including reference labels
     hyp_labels (list): the hypothesis labels

    return: (dict) a dictionary containing the following metrics:{
        conf_matrix (list): the confusion matrix
        sens (float): the sensitivity
        spec (float): the specificity
        prec (float): the precision
        acc (float): the accuracy
        err (float): the error rate
        f1 (float): the F1 score
    }

    description:
     calculate various metrics to that show how well a model performed on unseen data.
     pass it unseen data with the proper labels, the hypothesis labels, and the number 
     of classes. return the performance metrics of the model
    '''

    # get the number of classes from the data
    # the number of classes is always the greatest amount of
    # labels in the hyp or ref data. this is done to ensure
    # that there are no issues when scoring
    #
    if (data.num_of_classes > len(set(hyp_labels))): 
        num_classes = data.num_of_classes
    else:
        num_classes = len(set(hyp_labels))

    # convert the hypothesis labels to a numpy array of ints
    #
    hyp_labels = np.array(hyp_labels, dtype=int)

    # map the labels to the proper format
    #
    hyp_labels = data.map_label(hyp_labels)

    # score the model
    #
    conf_matrix, sens, spec, prec, acc, err, f1 = model.score(num_classes, data, hyp_labels)

    # return all the metrics as a dict
    #
    return {
        'Confusion Matrix': conf_matrix.tolist(),
        'Sensitivity': sens * 100,
        'Specificity': spec * 100,
        'Precision': prec * 100,
        'Accuracy': acc * 100,
        'Error Rate': err,
        'F1 Score': f1 * 100
    }
#
# end of function

def load_alg_params(pfile:str) -> dict:
    '''
    function: load_alg_params

    args:
     pfile (str): the file to load the algorithm parameters from
     algo (str) : the name of the algorithm to load the parameters

    return:
     params (dict): a dictionary of the algorithm parameters

    description:
     load the algorithm parameters from a file and return them as a dictionary
    '''

    # load the algorithm parameters from the file
    #
    algs = load_parameters(pfile, "ALGS")["ALGS"]

    # get the parameters for each algorithm
    #
    params = {}
    for alg in algs:
        params[alg] = load_parameters(pfile, alg) 

    # exit gracefully
    #
    return params

def generate_decision_surface(data:mltd.MLToolsData, model:mlt.Alg, *,
                              xrange:list=None, yrange:list=None):
    '''
    function: generate_decision_surface

    args:
     data (mltd.MLToolsData): the data to generate the decision surface from
     model (mlt.Alg)        : the trained model to use to generate the decision surface

    return:
     x (list) : the x values of the decision surface
     y (list) : the y values of the decision surface
     z (list) : the z values of the decision surface

    description:
     generate the decision surface of a model given a set of data. 
     generate the decision surface by finding the x and y bounds of the data,
     then create a meshgrid of the data (a grid of points within the bounds).
     then use the model to predict the classification at each point in the
     meshgrid. return the x, y, and z (class) values of the decision surface
    '''

    # get the raw data from the ML Tools data object
    #
    X = data.data

    # get the x and y bounds of the data. if the x and y ranges are given,
    # use them. otherwise, get the min and max of the x and y values
    #
    if (xrange): x_min, x_max = xrange
    else: x_min, x_max = floor(X[:, 0].min()), ceil(X[:, 0].max())

    if (yrange): y_min, y_max = yrange
    else: y_min, y_max = floor(X[:, 1].min()), ceil(X[:, 1].max())

    # create a meshgrid of the data. use this meshgrid to predict the labels
    # at each point in the grid. this will allow us to plot the decision surface
    # xx and yy will be the x and y values of the grid in the form of 2D arrays.
    # xx acts as the rows of the grid, and yy acts as the columns of the grid
    #
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 500), 
                         np.linspace(y_min, y_max, 500))
    
    # combine the xx and yy arrays to create a 3D array of the grid. this will effectively
    # create a list of all the points in the grid. the shape of the array will be (n, 2)
    #
    XX = np.c_[xx.ravel(), yy.ravel()]

    # create an MLToolsData object from the grid. since MLTools.predict needs MLToolsData
    # as an input, we need to create a MLToolsData object from the grid. we don't need labels
    # for the grid because that is unnecessary for prediction, so we can pass an empty 
    # array for the labels
    #
    meshgrid = mltd.MLToolsData.from_data(XX, np.array([]))

    # get the predictions of the model on each point of the meshgrid 
    # get the labels for each point in the meshgrid. the labels will be
    # flattened for each sample in the meshgrid
    #
    labels, _ = model.predict(meshgrid)

    # get the x and y values. x and y values should be 1D arrays
    # acting as the axis values of the grid. take a row from the xx
    # and a column from the yy arrays to get the x and y values. then 
    # flatten them to ensure 1D
    #
    x = xx[0].ravel()
    y = yy[:, 0].ravel()

    # reshape the labels to be the same shape as the xx and yy arrays
    #
    z = np.asarray(labels).reshape(xx.shape)

    # if there are strings in the z array, convert them to numbers
    # as the contour plot in Plotly.js will not work with strings
    #
    if np.issubdtype(z.dtype, np.integer):

        # vectorize the lambda function to convert the labels to numbers
        # based on the reversed mapping labels
        #
        z = np.vectorize(lambda val: data.mapping_label[val])(z)

    # return the x, y, and z values of the decision surface. 
    # x and y should be a 1D array, so get a row from the xx array and
    # a column from the yy array.
    #
    return x, y, z
#
# end of function