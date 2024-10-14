import numpy as np
import math
import imld_constants_datagen as icd

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

    self, npts=None, mean=None, cov=None
    # makes sure that the size valid
    #
    if npts is np.nan:
        # default to 10000
        #
        npts = icd.DEFAULT_NPTS_PER_CLASS
    # create four arrays with dim (1, npts) and fill
    #
    class_zero_gid = np.full((1, npts), icd.DEFAULT_CLASSES.index(icd.DEFAULT_CLASSES[0]))
    class_one_gid = np.full((1, npts), icd.DEFAULT_CLASSES.index(icd.DEFAULT_CLASSES[1]))
    class_two_gid = np.full((1, npts), icd.DEFAULT_CLASSES.index(icd.DEFAULT_CLASSES[2]))
    class_three_gid = np.full((1, npts), icd.DEFAULT_CLASSES.index(icd.DEFAULT_CLASSES[3]))

    # generate the bi-normal gaussian random deviates for class 0
    #
    if (True in np.isnan(mean)[0]) or (True in np.isnan(cov)[0]):
        mean[0] = icd.DEFAULT_FOURGAUSSIAN_MEAN[0]
        cov[0] = icd.DEFAULT_FOURGAUSSIAN_COV[0]

    data = np.random.multivariate_normal(mean[0], cov[0], npts)

    # create matplot metadata that holds scatter plot information
    #
    class_0 = self.display.canvas.axes.scatter(data[:, 0], data[:, 1],
                                        s=1, gid=class_zero_gid, color=self.display.class_info[icd.DEFAULT_CLASSES[0]][4])

    # save plot data, x and y coordinates, and color
    #
    self.display.class_info[icd.DEFAULT_CLASSES[0]] = [class_0, data[:, 0], data[:, 1],
                                         True, self.display.class_info[icd.DEFAULT_CLASSES[0]][4]]

    # generate the bi-normal gaussian random deviates for class 1
    #
    if (True in np.isnan(mean)[1]) or (True in np.isnan(cov)[1]):
        mean[1] = icd.DEFAULT_FOURGAUSSIAN_MEAN[1]
        cov[1] = icd.DEFAULT_FOURGAUSSIAN_COV[1]

    data = np.random.multivariate_normal(mean[1], cov[1], npts)
    #
    class_1 = self.display.canvas.axes.scatter(data[:, 0], data[:, 1], \
                                    s=1, gid=class_one_gid, color=self.display.class_info[icd.DEFAULT_CLASSES[1]][4])

    # save plot data, x and y coordinates, and color
    #
    self.display.class_info[icd.DEFAULT_CLASSES[1]] = [class_1, data[:, 0], data[:, 1], \
                                        True, self.display.class_info[icd.DEFAULT_CLASSES[1]][4]]

    # generate the bi-normal gaussian random deviates for class 2
    #
    if (True in np.isnan(mean)[2]) or (True in np.isnan(cov)[2]):
        mean[2] = icd.DEFAULT_FOURGAUSSIAN_MEAN[2]
        cov[2] = icd.DEFAULT_FOURGAUSSIAN_COV[2]

    data = np.random.multivariate_normal(mean[2], cov[2], npts)

    # create matplot metadata that holds scatter plot information
    #
    class_2 = self.display.canvas.axes.scatter(data[:, 0], data[:, 1],
                                    s=1, gid=class_two_gid, color=self.display.class_info[icd.DEFAULT_CLASSES[2]][4])

    # save plot data, x and y coordinates, and color
    #
    self.display.class_info[icd.DEFAULT_CLASSES[2]] = [class_2, data[:, 0], data[:, 1],
                                        True, self.display.class_info[icd.DEFAULT_CLASSES[2]][4]]

    # generate the bi-normal gaussian random deviates for class 3
    #
    if (True in np.isnan(mean)[3]) or (True in np.isnan(cov)[3]):
        mean[3] = icd.DEFAULT_FOURGAUSSIAN_MEAN[3]
        cov[3] = icd.DEFAULT_FOURGAUSSIAN_COV[3]

    data = np.random.multivariate_normal(mean[3], cov[3], npts)

    # create matplot metadata that holds scatter plot information
    #
    class_3 = self.display.canvas.axes.scatter(data[:, 0], data[:, 1],
                                    s=1, gid=class_three_gid, color=self.display.class_info[icd.DEFAULT_CLASSES[3]][4])

    # save plot data, x and y coordinates, and color
    #
    self.display.class_info[icd.DEFAULT_CLASSES[3]] = [class_3, data[:, 0], data[:, 1],
                                          True, self.display.class_info[icd.DEFAULT_CLASSES[3]][4]]

    # draw on canvas and wait for next command
    #
    self.display.canvas.draw_idle()



    return

# end of function


def test_generate_four_ellipses():

    X, y = 
    
    plt.scatter(X[:,0], X[:,1])

    plt.show()

def main():
    test_generate_four_ellipses()

if __name__ == '__main__':
    main()