# get the dependencies from the app directory
#
import numpy as np
import math
import imld_constants_datagen as icd

'''
TODO (Kayla): create a function that generates two gaussian masses, each of different labels.
              base this function on imld_data_gen.py line 61.
'''
def generate_two_gaussian(params:dict) -> tuple:
    '''
    function generate_two_gaussian

    args:
     params (dict): a dictionary containing the parameters for the distribution.
                    params = {
                             'npts1'  (int)     : the number of points to generate
                             'mean1' (list)     : the mean values for the two toroidal distributions
                             'cov1'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts2'  (int)     : the number of points to generate
                             'mean2' (list)     : the mean values for the two toroidal distributions
                             'cov2'  (2D list)  : the covariance matrices for the two toroidal distributions
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two gaussian masses, each of different labels.
    '''
    # get parameters
    npts1, mean1, cov1 = params['npts1'], params['mean1'], params['cov1']
    npts2, mean2, cov2 = params['npts2'], params['mean2'], params['cov2']
    
    # gaussian distribution for class 0
    class_0_data = np.random.multivariate_normal(mean1, cov1, npts1)
    class_0_labels = [0] * npts1  # Label for class 0
    
    # gaussian distribution for class 1
    class_1_data = np.random.multivariate_normal(mean2, cov2, npts2)
    class_1_labels = [1] * npts2  # Label for class 1
    
    # concatenate data w labels
    X = np.vstack((class_0_data, class_1_data))
    y = class_0_labels + class_1_labels
    
    return X, y

#
# end of method


'''
TODO (Kayla): create a function that generates four gaussian masses, each of different labels.
              base this function on imld_data_gen.py line 133.
'''
def generate_four_gaussian(params:dict) -> tuple:
    '''
    function generate_four_gaussian

    args:
     params (dict): a dictionary containing the parameters for the distribution.
                    params = {
                             'npts1'  (int)     : the number of points to generate
                             'mean1' (list)     : the mean values for the two toroidal distributions
                             'cov1'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts2'  (int)     : the number of points to generate
                             'mean2' (list)     : the mean values for the two toroidal distributions
                             'cov2'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts3'  (int)     : the number of points to generate
                             'mean3' (list)     : the mean values for the two toroidal distributions
                             'cov3'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts4'  (int)     : the number of points to generate
                             'mean4' (list)     : the mean values for the two toroidal distributions
                             'cov4'  (2D list)  : the covariance matrices for the two toroidal distributions
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate four gaussian masses, each of different labels.
    '''
    # get parameters
    npts1, mean1, cov1 = params['npts1'], params['mean1'], params['cov1']
    npts2, mean2, cov2 = params['npts2'], params['mean2'], params['cov2']
    npts3, mean3, cov3 = params['npts3'], params['mean3'], params['cov3']
    npts4, mean4, cov4 = params['npts4'], params['mean4'], params['cov4']
    
    # gaussian distributions for each class
    class_0_data = np.random.multivariate_normal(mean1, cov1, npts1)
    class_0_labels = [0] * npts1  # Label for class 0
    
    class_1_data = np.random.multivariate_normal(mean2, cov2, npts2)
    class_1_labels = [1] * npts2  # Label for class 1
    
    class_2_data = np.random.multivariate_normal(mean3, cov3, npts3)
    class_2_labels = [2] * npts3  # Label for class 2
    
    class_3_data = np.random.multivariate_normal(mean4, cov4, npts4)
    class_3_labels = [3] * npts4  # Label for class 3
    
    # concatenate data w labels
    X = np.vstack((class_0_data, class_1_data, class_2_data, class_3_data))
    y = class_0_labels + class_1_labels + class_2_labels + class_3_labels
    
    return X, y
#
# end of method


'''
TODO (Kayla): create a function that generates two overlapping gaussian masses, each of 
              different labels. base this function on imld_data_gen.py line 238.
'''
def generate_ovlp_gaussian(params:dict) -> tuple:
    '''
    function generate_ovlp_gaussian

    args:
     params (dict): a dictionary containing the parameters for the distribution.
                    params = {
                             'npts1'  (int)     : the number of points to generate
                             'mean1' (list)     : the mean values for the two toroidal distributions
                             'cov1'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts2'  (int)     : the number of points to generate
                             'mean2' (list)     : the mean values for the two toroidal distributions
                             'cov2'  (2D list)  : the covariance matrices for the two toroidal distributions
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two gaussian masses, overlapping each other.
    '''
    # get parameters
    npts1, mean1, cov1 = params['npts1'], params['mean1'], params['cov1']
    npts2, mean2, cov2 = params['npts2'], params['mean2'], params['cov2']
    
    # gaussian distributions for each class
    class_0_data = np.random.multivariate_normal(mean1, cov1, npts1)
    class_0_labels = [0] * npts1  # Label for class 0
    
    class_1_data = np.random.multivariate_normal(mean2, cov2, npts2)
    class_1_labels = [1] * npts2  # Label for class 1
    
    # concatenate data w labels
    X = np.vstack((class_0_data, class_1_data))
    y = class_0_labels + class_1_labels
    
    return X, y
#
# end of method

'''
TODO (Kayla): create a function that generates two ellipses masses, each of 
              different labels. base this function on imld_data_gen.py line 308.
'''
def generate_two_ellipses(params:dict) -> tuple:
    '''
    function generate_two_ellipses

    args:
     params (dict): a dictionary containing the parameters for the distribution.
                    params = {
                             'npts1'  (int)     : the number of points to generate
                             'mean1' (list)     : the mean values for the two toroidal distributions
                             'cov1'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts2'  (int)     : the number of points to generate
                             'mean2' (list)     : the mean values for the two toroidal distributions
                             'cov2'  (2D list)  : the covariance matrices for the two toroidal distributions
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two ellipses masses, each of different labels.
    '''
    # get parameters
    npts1, mean1, cov1 = params['npts1'], params['mean1'], params['cov1']
    npts2, mean2, cov2 = params['npts2'], params['mean2'], params['cov2']
    
    # generate data for class 0
    class_0_data = np.random.multivariate_normal(mean1, cov1, npts1)
    class_0_labels = [0] * npts1  # Label for class 0
    
    # generate data for class 1
    class_1_data = np.random.multivariate_normal(mean2, cov2, npts2)
    class_1_labels = [1] * npts2  # Label for class 1
    
    # concatenate data w labels
    X = np.vstack((class_0_data, class_1_data))
    y = class_0_labels + class_1_labels
    
    return X, y
#
# end of method


'''
TODO (Ray): create a function that generates four ellipses masses, each of 
              different labels. base this function on imld_data_gen.py line 372.
'''
def generate_four_ellipses(params:dict) -> tuple:
    '''
    function generate_four_ellipses

    args:
     params (dict): a dictionary containing the parameters for the distribution.
                    params = {
                             'npts1'  (int)     : the number of points to generate
                             'mean1' (list)     : the mean values for the two toroidal distributions
                             'cov1'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts2'  (int)     : the number of points to generate
                             'mean2' (list)     : the mean values for the two toroidal distributions
                             'cov2'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts3'  (int)     : the number of points to generate
                             'mean3' (list)     : the mean values for the two toroidal distributions
                             'cov3'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts4'  (int)     : the number of points to generate
                             'mean4' (list)     : the mean values for the two toroidal distributions
                             'cov4'  (2D list)  : the covariance matrices for the two toroidal distributions
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate four ellipses masses, each of different labels.
    '''

    np.random.seed(1)

    # grab all parameters
    npts0 = params['npts0']
    mean0 = params['mean0']
    cov0 = params['cov0']

    npts1 = params['npts1']
    mean1 = params['mean1']
    cov1 = params['cov1']
    
    npts2 = params['npts2']
    mean2 = params['mean2']
    cov2 = params['cov2']
    
    npts3 = params['npts3']
    mean3 = params['mean3']
    cov3 = params['cov3']    

    # Generate multivariate normal distribution for the current ellipse
    class_0 = np.random.multivariate_normal(mean0, cov0, npts0)
    class_1 = np.random.multivariate_normal(mean1, cov1, npts1)
    class_2 = np.random.multivariate_normal(mean2, cov2, npts2)
    class_3 = np.random.multivariate_normal(mean3, cov3, npts3)       
    
    # Generate labels
    class_0_label = [0] * npts0  # Label for class 0
    class_1_label = [1] * npts1  # Label for class 0
    class_2_label = [2] * npts2  # Label for class 0
    class_3_label = [3] * npts3  # Label for class 0
    
    X = np.vstack((class_0, class_1, class_2, class_3))
    y = class_0_label + class_1_label + class_2_label + class_3_label
     
    return X, y
#
# end of method

'''
TODO (Ray): create a function that generates rotated ellipses masses, each of 
              different labels. base this function on imld_data_gen.py line 477.
'''
def generate_rotated_ellipses(params:dict) -> tuple:
    '''
    function generate_rotated_ellipses

    args:
     params (dict): a dictionary containing the parameters for the distribution.
                    params = {
                             'npts1'  (int)     : the number of points to generate
                             'mean1' (list)     : the mean values for the two toroidal distributions
                             'cov1'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts2'  (int)     : the number of points to generate
                             'mean2' (list)     : the mean values for the two toroidal distributions
                             'cov2'  (2D list)  : the covariance matrices for the two toroidal distributions
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two rotated ellipses masses, each of different labels.
    '''
    
    np.random.seed(1)

    # grab all parameters
    npts0 = params['npts1']
    mean0 = params['mean1']
    cov0 = params['cov1']

    npts1 = params['npts2']
    mean1 = params['mean2']
    cov1 = params['cov2']
    
    # Generate multivariate normal distribution for the current ellipse
    class_0 = np.random.multivariate_normal(mean0, cov0, npts0)
    class_1 = np.random.multivariate_normal(mean1, cov1, npts1)
    
    # Generate labels
    class_0_label = [0] * npts0  # Label for class 0
    class_1_label = [1] * npts1  # Label for class 0
    
    
    X = np.vstack((class_0, class_1))
    y = class_0_label + class_1_label
     
    return X, y
#
# end of method

'''
TODO (Kayla): create a function that generates two toroidal masses, each of 
              different labels. base this function on imld_data_gen.py line 545.
'''
def generate_toroidal(params:dict) -> tuple:
    '''
    function generate_toroidal

    args:
     params (dict): a dictionary containing the parameters for the distribution.
                    params = {
                             'mean' (list)      : the mean values for the two toroidal distributions
                             'cov'  (2D list)   : the covariance matrices for the two toroidal distributions
                             'npts_mass' (int)  : the number of points to generate
                             'npts_ring' (int)  : the number of points to generate for the ring
                             'inner_rad' (float): 
                             'outer_rad' (float):
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two toroidal masses, each of different labels.
    '''
    # get parameters
    mean = params['mean']
    cov = params['cov']
    npts_mass = params['npts_mass']
    npts_ring = params['npts_ring']
    inner_rad = params['inner_rad']
    outer_rad = params['outer_rad']

    # create data points for mass (class 1)
    class_1_data = np.random.multivariate_normal(mean, cov, npts_mass)
    class_1_labels = [1] * npts_mass

    # create data points for ring (class 0)
    ring_radius = np.random.uniform(inner_rad, outer_rad, npts_ring)
    angle = np.linspace(0,2 * np.pi, npts_ring)
    class_0_data = np.array([mean[0] + ring_radius * np.cos(angle),
                         mean[1] + ring_radius * np.sin(angle)]).T
    class_0_labels = [0] * npts_ring

    # concatenate data w labels
    X = np.vstack((class_0_data, class_1_data))
    y = class_0_labels + class_1_labels

    return X, y
#
# end of method

'''
TODO (Shane): create a function that generates two masses that create the yin yang, 
              each of different labels. base this function on imld_data_gen.py line 661.
'''


def generate_yin_yang(params: dict) -> tuple:
        radius = params['radius']
        n_yin = params['npts_yin']
        n_yang = params['npts_yang']
        overlap = params['ovlp']

        # Boundary, mean, and standard deviation of plot
        xmean = 0
        ymean = 0
        stddev_center = 1.5 * (radius) / 2

        # Calculate radii for yin-yang regions
        radius1 = radius / 2
        radius2 = radius / 4

        # Create empty lists for storing points
        yin = []
        yang = []

        # Counters to track generated points for each class
        n_yin_counter = 0
        n_yang_counter = 0

        # Generate points for yin and yang
        while n_yin_counter < n_yin or n_yang_counter < n_yang:
            xpt = np.random.normal(xmean, stddev_center)
            ypt = np.random.normal(ymean, stddev_center)

            # Calculate distances for each generated point
            distance1 = np.sqrt(xpt ** 2 + ypt ** 2)
            distance2 = np.sqrt(xpt ** 2 + (ypt + radius2) ** 2)
            distance3 = np.sqrt(xpt ** 2 + (ypt - radius2) ** 2)

            # Determine point class based on position and distances
            if distance1 <= radius1:
                if -radius1 <= xpt <= 0:
                    if ((distance1 <= radius1 or distance2 <= radius2) and distance3 > radius2):
                        if n_yin_counter < n_yin:
                            yin.append([xpt, ypt])
                            n_yin_counter += 1
                    elif n_yang_counter < n_yang:
                        yang.append([xpt, ypt])
                        n_yang_counter += 1
                elif 0 < xpt <= radius1:
                    if ((distance1 <= radius1 or distance3 <= radius2) and distance2 > radius2):
                        if n_yang_counter < n_yang:
                            yang.append([xpt, ypt])
                            n_yang_counter += 1
                    elif n_yin_counter < n_yin:
                        yin.append([xpt, ypt])
                        n_yin_counter += 1

        # Translate yin and yang points to center them on the plot
        yin = np.array(yin) + np.array([0, overlap * radius2])
        yang = np.array(yang) - np.array([0, overlap * radius2])

        # Return generated data as a dictionary
            # Combine the yin and yang classes and create the labels
        X = np.concatenate((yin, yang), axis=0)
        y = ['Class0'] * n_yin + ['Class1'] * n_yang

        # Return the generated data and labels
        return X, y

'''
def generate_yin_yang(params: dict) -> tuple:
    
    function generate_yin_yang

    args:
     params (dict): a dictionary containing the parameters for the distribution.
                    params = {
                                'npts_yin' (int) : the number of points to generate for the yin
                                'npts_yang' (int): the number of points to generate for the yang
                                'ovlp' (float)   : the overlap between the yin and yang
                                'radius' (float) : the radius for the yin-yang shape
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two masses that create a yin-yang, each of different labels.
    

    np.random.seed(1)

    # Parameters
    radius = params['radius']
    n_yin = params['npts_yin']
    n_yang = params['npts_yang']
    overlap = params['ovlp']

    # Calculate means for yin and yang based on the radius
    xmean_yin = -radius / 2
    xmean_yang = radius / 2
    ymean = 0  # Both classes centered on the x-axis

    # Standard deviation for generating points around the center
    stddev_center = 0.75 * radius

    # Create empty lists for yin and yang
    yin = []
    yang = []

    # Calculate inner and outer radii for yin-yang
    radius1 = 1.5 * radius
    radius2 = 0.75 * radius

    # Counters for generated points
    n_yin_counter = 0
    n_yang_counter = 0

    while n_yin_counter < n_yin or n_yang_counter < n_yang:

        # Generate points using Gaussian distribution around the respective center
        xpt = np.random.normal(xmean_yin if n_yin_counter < n_yin else xmean_yang, stddev_center)
        ypt = np.random.normal(ymean, stddev_center)

        # Calculate distances to determine the class for the point
        distance1 = np.sqrt(xpt ** 2 + ypt ** 2)
        distance2 = np.sqrt(xpt ** 2 + (ypt + radius2) ** 2)
        distance3 = np.sqrt(xpt ** 2 + (ypt - radius2) ** 2)

        # Separate conditions for classifying yin and yang
        if n_yin_counter < n_yin:
            if (xpt >= -radius1) and (xpt <= 0) and (((distance1 <= radius1) or (distance2 <= radius2)) and (distance3 > radius2)):
                yin.append([xpt, ypt])
                n_yin_counter += 1

        elif n_yang_counter < n_yang:
            if (xpt > 0.0) and (xpt <= radius1) and (((distance1 <= radius1) or (distance3 <= radius2)) and (distance2 > radius2)):
                yang.append([xpt, ypt])
                n_yang_counter += 1

    # Apply overlap by adjusting the translation
    yang = np.array(yang) + np.array([0, 0])
    yin = np.array(yin) + np.array([0, 0]) * (1 + overlap)

    # Combine the yin and yang classes and create the labels
    X = np.concatenate((yin, yang), axis=0)
    y = ['Class0'] * n_yin + ['Class1'] * n_yang

    # Return the generated data and labels
    return X, y
'''


DIST_MAP = {
            'two gaussian'       : generate_two_gaussian,
            'four gaussian'      : generate_four_gaussian,
            'overlaping gaussian': generate_ovlp_gaussian,
            'two ellipses'       : generate_two_ellipses,
            'four ellipses'      : generate_four_ellipses,
            'rotated ellipses'   : generate_rotated_ellipses,
            'toroidal'           : generate_toroidal,
            'yin yang'           : generate_yin_yang
           }

