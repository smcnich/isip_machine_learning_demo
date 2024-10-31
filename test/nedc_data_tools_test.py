
# add the dependencies to the path
#
import sys
import os
sys.path.append(os.path.abspath('../IMLD/app/backend'))

# Now you can import the module

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
    plt.scatter(X[:,0], X[:,1])

    plt.show()

    save_data(X, y, 'two_gaussian.csv')

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
    plt.scatter(X[:,0], X[:,1])

    plt.show()

    save_data(X, y, 'four_gaussian.csv')   

def test_ovlp_gaussian():
    X, y = ndt.generate_ovlp_gaussian(params = {
                                    'npts1' : 10000,
                                    'mean1' : [-0.14, 0.14],
                                    'cov1'  : [[0.0250, 0], [0, 0.0250]],    
                                    'npts2' : 10000,
                                    'mean2' : [0.14, 0.14],
                                    'cov2'  : [[0.0250, 0], [0, 0.0250]]          
                                    })
    plt.scatter(X[:,0], X[:,1])

    plt.show()

    save_data(X, y, 'ovlp_gaussian.csv')

def test_two_ellipses():
    X, y = ndt.generate_two_gaussian(params = {
                                    'npts1' : 10000,
                                    'mean1' : [-0.5, 0.5],
                                    'cov1'  : [[0.0333, 0], [0, 0.0043]],    
                                    'npts2' : 10000,
                                    'mean2' : [0.5, -0.5],
                                    'cov2'  : [[0.0333, 0], [0, 0.0043]]           
                                    })
    plt.scatter(X[:,0], X[:,1])

    plt.show()

    save_data(X, y, 'two_ellipses.csv')

def test_four_ellipses1():
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
    plt.scatter(X[:,0], X[:,1])

    plt.show()

    save_data(X, y, 'four_ellipses.csv')  
    

def test_rotated_ellipses1():
    X, y = ndt.generate_rotated_ellipses(params = {
                                    'npts1' : 10000,
                                    'mean1' : [-0.5, 0.5],
                                    'cov1'  : [[0.0333, 0], [0, 0.0043]],    
                                    'npts2' : 10000,
                                    'mean2' : [0.5, -0.5],
                                    'cov2'  : [[0.0043, 0], [0, 0.0333]]           
                                    })
    plt.scatter(X[:,0], X[:,1])

    plt.show()

    save_data(X, y, 'rotated_ellipses.csv')

def test_toroidal():
    X, y = ndt.generate_toroidal(params = {
                                    'mean'      : [0.0, 0.0],
                                    'cov'       : [[0.0083, 0], [0, 0.0083]],
                                    'npts_mass' : 10000,
                                    'npts_ring' : 2000,
                                    'inner_rad' : 0.65,
                                    'outer_rad' : 0.85
                                    })

    plt.scatter(X[:,0], X[:,1])

    plt.show()

    save_data(X, y, 'toroidal.csv')

def test_yin_yang():
    X, y = ndt.generate_yin_yang(params = {
                                    'npts_yin' : 2000,
                                    'npts_yang': 2000,
                                    'ovlp'     : 0.1,
                                    'radius'    : 1.0
                                    })

    plt.scatter(X[:,0], X[:,1])
    plt.title('yin yang')
    plt.xlabel('x')
    plt.ylabel('y')
    plt.show()
    

    save_data(X, y, 'yin_yang.csv')

'''
def test_four_ellipses():
    # Define the parameters for the four ellipses
    params = {
        'npts0': 10000, 'mean0': [-0.5, 0.5], 'cov0': [[0.0333, 0], [0, 0.0043]],  # Narrower along y-axis
        'npts1': 10000, 'mean1': [0.5, 0.5], 'cov1': [[0.0333, 0], [0, 0.0043]],   # Narrower along y-axis
        'npts2': 10000, 'mean2': [-0.5, -0.5], 'cov2': [[0.0333, 0], [0, 0.0043]], # Same as ellipse 1
        'npts3': 10000, 'mean3': [0.5, -0.5], 'cov3': [[0.0333, 0], [0, 0.0043]],  # Same as ellipse 1
        'x_min': -1, 'x_max': 1, 'y_min': -1, 'y_max': 1
    }



    # Generate the data using your generate_four_ellipses function
    X, y = ndt.generate_four_ellipses(params)
                                
    # Create color map for each class
    colors = ['magenta', 'orange', 'purple', 'green']
    for i, color in enumerate(colors):
        plt.scatter(X[np.array(y) == i, 0], X[np.array(y) == i, 1], c=color, s=1, label=f'Class{i}')

    # Set plot limits to match the desired output
    plt.xlim([-1, 1])
    plt.ylim([-1, 1])
    plt.gca().set_aspect('equal', adjustable='box')

    # Display the plot
    plt.legend()
    plt.show()

def test_rotated_ellipses():
    # Define the parameters for the rotated ellipses
    params = {
        'npts0': 10000, 'mean0': [-0.5, 0.5], 'cov0': [[0.0333, 0], [0, 0.0043]],  # Narrower along y-axis for class 0
        'npts1': 10000, 'mean1': [0.5, -0.5], 'cov1': [[0.0043, 0], [0, 0.0333]],  # Narrower along x-axis for class 1
        'x_min': -1, 'x_max': 1, 'y_min': -1, 'y_max': 1
    }

    # Generate the data using your generate_rotated_ellipses function
    X, y = ndt.generate_rotated_ellipses(params)
                                
    # Create color map for each class
    colors = ['magenta', 'orange']
    for i, color in enumerate(colors):
        plt.scatter(X[np.array(y) == i, 0], X[np.array(y) == i, 1], c=color, s=1, label=f'Class{i}')

    # Set plot limits to match the desired output
    plt.xlim([-1, 1])
    plt.ylim([-1, 1])
    plt.gca().set_aspect('equal', adjustable='box')

    # Display the plot
    plt.legend()
    plt.show()    
'''

# run test below:
test_yin_yang()