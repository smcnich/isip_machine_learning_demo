
# add the dependencies to the path
#
import sys
sys.path.append('../app/backend')

# get the dependencies from the app directory
#
import nedc_data_tools as ndt
import numpy as np
import matplotlib.pyplot as plt

def save_data(X:np.ndarray, y:list, fname:str):
    '''
    function: save_data

    args:
     X (np.ndarray): the data points to save. should be 2D
     y (list)      : the labels for the data points
     fname (str)   : the name of the file to save the data to

    return:
     None

    description:
     save the data points and labels to a file. The data points are saved as
     a CSV file with the labels as the first column and the data points as the
     remaining columns. The file is saved in the format required by the ML
     Tools library.
    '''
    
    # add the labels to the first column of the data
    #
    data = np.column_stack((y, X.astype(str)))

    # write the header based on the number of classes
    #
    if len(set(y)) == 2:
        header = \
'''filename:
classes: [Class0,Class1]
colors: [magenta,green]
limits: [-1.0,1.0,-1.0,1.0]'''
        
    elif len(set(y)) == 4:
        header = \
'''filename:
classes: [Class0,Class1,Class2,Class3]
colors: [magenta,green,blue,yellow]
limits: [-1.0,1.0,-1.0,1.0]'''

    # write the file
    #
    np.savetxt(fname, data, delimiter=',', fmt='%s', header=header)

    # exit gracefully
    #
    return
#
# end of function

def test_yin_yang():
    X, y = ndt.generate_yin_yang(params = {
                                'npts_yin' : 2000,
                                'npts_yang': 2000,
                                'ovlp'     : 0.1,
                                'x_min'    : -1.0,
                                'x_max'    : 1.0,
                                'y_min'    : -1.0,
                                'y_max'    : 1.0
                                 })

    plt.scatter(X[:,0], X[:,1])

    plt.show()

    save_data(X, y, 'yin_yang.csv')


test_yin_yang()
            