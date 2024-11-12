
# add the dependencies to the path
#
import sys
import os
sys.path.append(os.path.abspath('../IMLD/app/backend'))

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

def test_two_gaussian():
    X, y = ndt.generate_two_gaussian(params = {
                                    'npts1' : 10000,
                                    'mean1' : [-0.5, 0.5],
                                    'cov1'  : [[0.0333, 0], [0, 0.0333]],    
                                    'npts2' : 10000,
                                    'mean2' : [0.5, -0.5],
                                    'cov2'  : [[0.0333, 0], [0, 0.0333]]           
                                    })
    # assign colors: first 'npts1' points are blue, the rest are red
    colors = ['blue' if i < 10000 else 'red' for i in range(len(y))]

    plt.scatter(X[:,0], X[:,1],c=colors)

    plt.title('two gaussian')

    plt.show()

    save_data(X, y, 'test/test_data/two_gaussian.csv')

def test_four_gaussian():
    X, y = ndt.generate_four_gaussian(params = {
                                    'npts1' : 10000,
                                    'mean1' : [-0.5, 0.5],
                                    'cov1'  : [[0.0250, 0], [0, 0.0250]],    
                                    'npts2' : 10000,
                                    'mean2' : [0.5, -0.5],
                                    'cov2'  : [[0.0250, 0], [0, 0.0250]],
                                    'npts3' : 10000,
                                    'mean3' : [-0.5, -0.5],
                                    'cov3'  : [[0.0250, 0], [0, 0.0250]],    
                                    'npts4' : 10000,
                                    'mean4' : [0.5, 0.5],
                                    'cov4'  : [[0.0250, 0], [0, 0.0250]]                                              
                                    })
    # assign colors: first 'npts1' points are blue, next 'npts2' points are red, next 'npts3' points are green, remaining are yellow
    colors = ['blue' if i < 10000 else 'red' if i < 20000 else 'green' if i < 30000 else 'yellow' for i in range(len(y))]

    plt.scatter(X[:,0], X[:,1],c=colors)

    plt.title('four gaussian')

    plt.show()

    save_data(X, y, 'test/test_data/four_gaussian.csv')   

def test_ovlp_gaussian():
    X, y = ndt.generate_ovlp_gaussian(params = {
                                    'npts1' : 10000,
                                    'mean1' : [-0.14, 0.14],
                                    'cov1'  : [[0.0250, 0], [0, 0.0250]],    
                                    'npts2' : 10000,
                                    'mean2' : [0.14, 0.14],
                                    'cov2'  : [[0.0250, 0], [0, 0.0250]]          
                                    })
    # assign colors: first 'npts1' points are blue, the rest are red
    colors = ['blue' if i < 10000 else 'red' for i in range(len(y))]

    plt.scatter(X[:,0], X[:,1],c=colors)

    plt.title('overlapping gaussian')

    plt.show()

    save_data(X, y, 'test/test_data/ovlp_gaussian.csv')

def test_two_ellipses():
    X, y = ndt.generate_two_gaussian(params = {
                                    'npts1' : 10000,
                                    'mean1' : [-0.5, 0.5],
                                    'cov1'  : [[0.0333, 0], [0, 0.0043]],    
                                    'npts2' : 10000,
                                    'mean2' : [0.5, -0.5],
                                    'cov2'  : [[0.0333, 0], [0, 0.0043]]           
                                    })
    # assign colors: first 'npts1' points are blue, the rest are red
    colors = ['blue' if i < 10000 else 'red' for i in range(len(y))]

    plt.scatter(X[:,0], X[:,1],c=colors)

    plt.title('two ellipses')

    plt.show()

    save_data(X, y, 'test/test_data/two_ellipses.csv')

def test_four_ellipses():
    X, y = ndt.generate_four_gaussian(params = {
                                    'npts1' : 10000,
                                    'mean1' : [-0.5, 0.5],
                                    'cov1'  : [[0.0250, 0], [0, 0.0032]],    
                                    'npts2' : 10000,
                                    'mean2' : [0.5, -0.5],
                                    'cov2'  : [[0.0250, 0], [0, 0.0032]],
                                    'npts3' : 10000,
                                    'mean3' : [-0.5, -0.5],
                                    'cov3'  : [[0.0250, 0], [0, 0.0032]],    
                                    'npts4' : 10000,
                                    'mean4' : [0.5, 0.5],
                                    'cov4'  : [[0.0250, 0], [0, 0.0032]]                                              
                                    })
    # assign colors: first 'npts1' points are blue, next 'npts2' points are red, next 'npts3' points are green, remaining are yellow
    colors = ['blue' if i < 10000 else 'red' if i < 20000 else 'green' if i < 30000 else 'yellow' for i in range(len(y))]

    plt.scatter(X[:,0], X[:,1],c=colors)

    plt.title('four ellipses')

    plt.show()

    save_data(X, y, 'test/test_data/four_ellipses.csv')  
    
def test_rotated_ellipses():
    X, y = ndt.generate_rotated_ellipses(params = {
                                    'npts1' : 10000,
                                    'mean1' : [-0.5, 0.5],
                                    'cov1'  : [[0.0333, 0], [0, 0.0043]],    
                                    'npts2' : 10000,
                                    'mean2' : [0.5, -0.5],
                                    'cov2'  : [[0.0043, 0], [0, 0.0333]]           
                                    })
    # assign colors: first 'npts1' points are blue, the rest are red
    colors = ['blue' if i < 10000 else 'red' for i in range(len(y))]

    plt.scatter(X[:,0], X[:,1],c=colors)

    plt.title('rotated ellipses')

    plt.show()

    save_data(X, y, 'test/test_data/rotated_ellipses.csv')

def test_toroidal():
    X, y = ndt.generate_toroidal(params = {
                                    'mean'      : [0.0, 0.0],
                                    'cov'       : [[0.0083, 0], [0, 0.0083]],
                                    'npts_mass' : 10000,
                                    'npts_ring' : 2000,
                                    'inner_rad' : 0.65,
                                    'outer_rad' : 0.85
                                    })
    # assign colors: first 'npts_ring' points are blue, the rest are red
    colors = ['blue' if i < 2000 else 'red' for i in range(len(y))]

    plt.scatter(X[:,0], X[:,1],c=colors)

    plt.title('toroidal')

    plt.show()

    save_data(X, y, 'test/test_data/toroidal.csv')

def test_yin_yang():
    X, y = ndt.generate_yin_yang(params = {
                                    'npts_yin' : 2000,
                                    'npts_yang': 2000,
                                    'ovlp'     : 0.0,
                                    'radius'   : 2.0
                                    })
    
    # assign colors: first 'npts_yin' points are blue, the rest are red
    colors = ['blue' if i < 2000 else 'red' for i in range(len(y))]
  
    plt.scatter(X[:, 0], X[:, 1], c=colors)

    plt.title('yin yang')

    plt.show()
    
    save_data(X, y, 'test/test_data/yin_yang.csv')


# uncomment desired test:

#test_two_gaussian()
#test_four_gaussian()
#test_ovlp_gaussian()
#test_two_ellipses()
#test_four_ellipses()
#test_rotated_ellipses()
#test_toroidal()
#test_yin_yang()