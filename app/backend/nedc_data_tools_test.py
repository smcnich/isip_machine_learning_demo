import sys
import nedc_data_tools as ndt
import numpy as np
import matplotlib.pyplot as plt

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
    
# Call the test function
#test_four_ellipses()

test_rotated_ellipses()
