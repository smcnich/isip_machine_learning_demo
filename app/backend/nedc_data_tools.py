import numpy as np
import math
import imld_constants_datagen as icd

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
                             }

    return:
     X (np.ndarray): a 2D array containing all of the data points generated.
                     should contain the data for both classes.
     y (list): a list containing the labels for each data point in X

    description:
     generate four ellipses masses, each of different labels.
    '''
    return
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
    return
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