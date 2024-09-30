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
def generate_two_gaussian(npts=None, mean=None, cov=None) -> tuple:
    '''
    function generate_two_gaussian

    args:
     npts (int): the number of points to generate
     mean (list): the mean values for the two gaussian distributions
     cov (list): the covariance matrices for the two gaussian distributions

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
def generate_four_gaussian(npts=None, mean=None, cov=None) -> tuple:
    '''
    function generate_four_gaussian

    args:
     npts (int): the number of points to generate
     mean (list): the mean values for the four overlapping gaussian distributions
     cov (list): the covariance matrices for the four overlapping gaussian distributions

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
def generate_ovlp_gaussian(npts=None, mean=None, cov=None) -> tuple:
    '''
    function generate_ovlp_gaussian

    args:
     npts (int): the number of points to generate
     mean (list): the mean values for the two gaussian distributions
     cov (list): the covariance matrices for the two gaussian distributions

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
def generate_two_ellipses(npts=None, mean=None, cov=None) -> tuple:
    '''
    function generate_two_ellipses

    args:
     npts (int): the number of points to generate
     mean (list): the mean values for the two ellipses distributions
     cov (list): the covariance matrices for the two ellipses distributions

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
def generate_four_ellipses(npts=None, mean=None, cov=None) -> tuple:
    '''
    function generate_four_ellipses

    args:
     npts (int): the number of points to generate
     mean (list): the mean values for the four ellipses distributions
     cov (list): the covariance matrices for the four ellipses distributions

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
def generate_rotated_ellipses(npts=None, mean=None, cov=None) -> tuple:
    '''
    function generate_rotated_ellipses

    args:
     npts (int): the number of points to generate
     mean (list): the mean values for the two rotated ellipses distributions
     cov (list): the covariance matrices for the two rotated ellipses distributions

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
def generate_toroidal(npts=None, mean=None, cov=None) -> tuple:
    '''
    function generate_toroidal

    args:
     npts (int): the number of points to generate
     mean (list): the mean values for the two toroidal distributions
     cov (list): the covariance matrices for the two toroidal distributions

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
def generate_yin_yang(npts=None, mean=None, cov=None) -> tuple:
    '''
    function generate_yin_yang

    args:
     npts (int): the number of points to generate
     mean (list): the mean values for the yin yang distributions
     cov (list): the covariance matrices for the yin yang distributions

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