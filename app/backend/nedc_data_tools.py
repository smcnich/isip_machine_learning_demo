import numpy as np
import math
import imld_constants_datagen as icd

# get the dependencies from the app directory
#
import nedc_data_tools as ndt

def generate_distribution(name:str, *, params:dict=None) -> tuple:
    '''
    function: generate_distribution

    args:
     name (str)  : the name of the distribution to generate
     params (dict): a dictionary containing the parameters for the
                    distribution. [optional]

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate a distribution of data points based on the name of the distribution
     given. the parameters for the distribution are given in a dictionary. the
     function will return a the X and y vectors for the data generated. this
     function makes it easier to select distributions to generate data from.
    '''

    # check if the distribution name is in the map
    #
    if name not in DIST_MAP:
        return None
    
    # generate the data based on the distribution name
    #
    return DIST_MAP[name](*params)
#
# end of method

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
                             'x_min' (int)     : the minimum x value for the data
                             'x_max' (int)     : the maximum x value for the data
                             'y_min' (int)     : the minimum y value for the data
                             'y_max' (int)     : the maximum y value for the data
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two gaussian masses, each of different labels.
    '''
    return
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
                             'x_min' (int)     : the minimum x value for the data
                             'x_max' (int)     : the maximum x value for the data
                             'y_min' (int)     : the minimum y value for the data
                             'y_max' (int)     : the maximum y value for the data
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate four gaussian masses, each of different labels.
    '''
    return
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
                             'x_min' (int)     : the minimum x value for the data
                             'x_max' (int)     : the maximum x value for the data
                             'y_min' (int)     : the minimum y value for the data
                             'y_max' (int)     : the maximum y value for the data
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two gaussian masses, overlapping each other.
    '''
    return
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
                             'x_min' (int)     : the minimum x value for the data
                             'x_max' (int)     : the maximum x value for the data
                             'y_min' (int)     : the minimum y value for the data
                             'y_max' (int)     : the maximum y value for the data
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two ellipses masses, each of different labels.
    '''
    return
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
                             'x_min' (int)     : the minimum x value for the data
                             'x_max' (int)     : the maximum x value for the data
                             'y_min' (int)     : the minimum y value for the data
                             'y_max' (int)     : the maximum y value for the data
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
                             'x_min' (int)     : the minimum x value for the data
                             'x_max' (int)     : the maximum x value for the data
                             'y_min' (int)     : the minimum y value for the data
                             'y_max' (int)     : the maximum y value for the data
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
    npts0 = params['npts0']
    mean0 = params['mean0']
    cov0 = params['cov0']

    npts1 = params['npts1']
    mean1 = params['mean1']
    cov1 = params['cov1']
    
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
                             'mean' (list)     : the mean values for the two toroidal distributions
                             'cov'  (2D list)  : the covariance matrices for the two toroidal distributions
                             'npts_mass' (int) : the number of points to generate
                             'npts_ring' (int) : the number of points to generate for the ring
                             'x_min' (int)     : the minimum x value for the data
                             'x_max' (int)     : the maximum x value for the data
                             'y_min' (int)     : the minimum y value for the data
                             'y_max' (int)     : the maximum y value for the data
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two toroidal masses, each of different labels.
    '''
    return
#
# end of method

'''
TODO (Shane): create a function that generates two masses that create the yin yang, 
              each of different labels. base this function on imld_data_gen.py line 661.
'''
def generate_yin_yang(params:dict) -> tuple:
    '''
    function generate_yin_yang

    args:
     params (dict): a dictionary containing the parameters for the distribution.
                    params = {
                                'npts_yin' (int) : the number of points to generate for the yin
                                'npts_yang' (int): the number of points to generate for the yang
                                'x_min' (int)    : the minimum x value for the data
                                'x_max' (int)    : the maximum x value for the data
                                'y_min' (int)    : the minimum y value for the data
                                'y_max' (int)    : the maximum y value for the data
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate two masses that create a yin yang, each of different labels.
    '''
    return
#
# end of method

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

