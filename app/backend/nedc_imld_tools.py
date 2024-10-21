import nedc_ml_tools as mlt
import nedc_ml_tools_data as mltd

def imld_callback(name:str, *, status:float=None, data:dict=None, msg:str=None) -> bool:
    '''
    function: imld_callback

    args:
     name (str)     : the name of the callback so the client can identify the return.
     data (dict)    : a dictionary containing any pieces of data to be returned to the client.
                      the client should know what to do with this data. the object will not be
                      modified before reaching the client.
     msg (str)      : a descriptive message that will be returned to the client. should key the
                      client in on the status of the function.
     status (float) : a float value representing the percentage of the function that has been
                      completed. this value should be between 0 and 1.

    returns:
     bool: True if the function succeeds, False if it fails.

    description:
     this function is a callback from ML Tools into IMLD. this function will be used to send
     data to the IMLD client as the function progresses. messages, data, and a status percentage
     should be included to be sent to IMLD. these callbacks will be helpful in updating the
     progress bar in the IMLD client. this function should be called stategically throughout the
     ML Tools functions. 
    '''

    # the function logic will be improved in the future
    print(f"Status Update: [{name}] {msg} ({status*100}%)")

    return True

#
# end of function
    
def create_model(alg_name:str, *, params=None) -> mlt.Alg:
    '''
    function: create_model

    args:
     alg_name (str): the name of the algorithm to use in the model
     params (dict): a dictionary containing the parameters for the
                    algorithm. see ML Tools line 135 for an example.
                    [optional]

    return:
     mlt.Alg: the ML Tools object that was created
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

# TODO: create the wrapper to train an algorithm, given data. make sure to
#       include error checking. see nedc_ml_tools.py line 1478.
def train(model:mlt.Alg, data:mltd.MLToolsData):
    '''
    function: train

    args:
     model (mlt.Alg): the ML Tools algorithm to train
     data (mltd.MLToolsData): the data to train the model on

    return:
     model (dict): a dictionary containing the model (data dependent)
     score (float): a float value containing a measure of the goodness of fit
     train_labels (np.ndarray): the predicted labels created during training
                                evaluation

     description:
      train a ML Tools model on a given set of data. The data must be in the
      MLToolData class. Return the trained model, a goodness of fit score, a
      the labels generated while calculating the goodness of fit score.    
    '''
    return
#
# end of function

# TODO: create the wrapper to predict the labels of data from a given model.
#       make sure to include error checking. see nedc_ml_tools.py line 1547
def predict(model:mlt.Alg, data:mltd.MLToolsData):
    '''
    function: predict

    args:
     model (mlt.Alg): the ML Tools trained model to use for predictions
     data (mltd.MLToolsData): the data to predict

    return:
     labels (list): a list of the predicted labels.
     posteriors (np.ndarray): a float numpy vector with the posterior 
                              probability for each class assignment.

    description:
     use a ML Tools trained model to predict unseen data. return vectors
     of the labels given to each index of the unseen data, and posterior
     probabilities of each class assignment for each index of the array
    '''
    return
#
# end of function

'''
TODO: create the wrapper to score the predicted labels compared to the
      actual labels of a dataset. see nedc_ml_tools.py line 1730.
'''
def score(num_classes:int, data:mltd.MLToolsData, hyp_labels:list):
    '''
    function: score

    args:
     num_classes (int): the number of classes
     data (mltd.MLToolsData): the input data including reference labels
     hyp_labels (list): the hypothesis labels

    return:
     conf matrix (np.ndarray): the confusion matrix
     sens (float): the sensitivity
     spec (float): the specificity
     prec (float): the precision
     acc (float): the accuracy
     err (float): the error rate
     f1 (float): the F1 score

    description:
     calculate various metrics to that show how well a model performed on unseen data.
     pass it unseen data with the proper labels, the hypothesis labels, and the number 
     of classes. return the performance metrics of the model
    '''
    return
#
# end of function

# TODO: [Optional for Sprint 3] create a function that generates the decision surface
#       for a model. Base it on the prep_decision_surface, predict_decision_surface, and
#       plot_decision_surface functions in imld_model.py
def generate_decision_surface():
    return
#
# end of function