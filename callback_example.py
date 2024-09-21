from app.backend.nedc_imld_tools import imld_callback
from sklearn.datasets import make_classification
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import f1_score
import numpy as np
from typing import Callable

def callback_example(callback: Callable = None):
    '''
    function: callback_example

    args:
     none

    returns:
     none

    description:
     this function is an example of how to use the imld_callback function. this function will
     call the imld_callback function multiple times to show how the function can be used to
     update the IMLD client on the progress of a function.
    '''

    if callback:
        callback(name="start", msg="Starting the function...", status=0)

    # Create a binary classification dataset.
    train = make_classification(n_samples=100, 
                               n_features=2, 
                               n_informative=2, 
                               n_redundant=0, 
                               n_classes=2, 
                               random_state=1)

    # get train labels and samples
    train_x = np.array(train[0])
    train_y = np.array(train[1])

    if callback:
        callback(name="data_creation", msg="Created the training data", status=0.1, data={'samples':train_x, 'labels':train_y})

    # fit the model
    #
    model = KNeighborsClassifier(n_neighbors = 10).fit(train_x, train_y)

    if callback: 
        callback(name="model_fit", msg="Model has been fit", status=0.5, data={'model': model})

    # Create a binary classification dataset.
    eval = make_classification(n_samples=100, 
                               n_features=2, 
                               n_informative=2, 
                               n_redundant=0, 
                               n_classes=2, 
                               random_state=5)
    
    # get eval labels and samples
    eval_x = np.array(eval[0])
    eval_y = np.array(eval[1])

    # predict the eval data
    preds = model.predict(eval_x)

    if callback:
        callback(name="model_predict", msg="Model has been evaluated", status=0.9, data={'predictions':preds})

    # score calculation using auc ( f1 score )
    score = f1_score(eval_y, preds, average="macro")

    if callback:
        callback(name="complete", data={'f1_score':score}, msg='Complete', status=1)

    # exit gracefully
    #
    return True
#
# end of function

callback_example(imld_callback)