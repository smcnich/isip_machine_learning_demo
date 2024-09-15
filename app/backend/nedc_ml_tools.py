#!/usr/bin/env python
#
# file: $NEDC_NFC/class/python/nedc_ml_tools/nedc_ml_tools.py
#
# revision history:
# 20240821 (DB): fixed an interface issue with scoring
# 20240120 (SM): added/fixed confusion matrix and accuracy scores
# 20240105 (PM): added new MLToolData class and Euclidean Alg
# 20230623 (AB): code refactored to new comment style
# 20230515 (PM): reviewed and refactored
# 20230316 (JP): reviewed again
# 20230115 (JP): reviewed and refactored (again)
# 20230114 (PM): completed the implementation
# 20230110 (JP): reviewed and refactored
# 20221220 (PM): initial version
#
#
# This class contains a collection of classes and methods that consolidate
# some of our most common machine learning algorithms. Currently, we support:
#
#  Principle Component Analysis (PCA)
#  Quadratic Discriminant Analysis (QDA)
#  Linear Discriminate Analysis class independent (LDA)
#  Linear Discriminate Analysis class dependent (QLDA)
#
# in this class. These are accessed through a wrapper class called Algorithm.
#
# The implementations that are included here are a mixture of things found
# in the statistical package JMP, the Python machine learning library
# scikit-learn and the ISIP machine learning demo, IMLD.
#------------------------------------------------------------------------------

# import required system modules
#
from collections import defaultdict
import datetime as dt
import numpy as np
import pandas as pd
import pickle
import os
import sys
import copy

from imblearn.metrics import sensitivity_score, specificity_score
from sklearn.naive_bayes import GaussianNB

from sklearn.metrics import (silhouette_score,
                            classification_report,
                            precision_score,
                            accuracy_score, f1_score)
from sklearn.metrics import confusion_matrix as sklearn_confusion_matrix
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.cluster import KMeans
from sklearn.neural_network import MLPClassifier, BernoulliRBM
from sklearn.metrics import f1_score
from sklearn.neural_network import BernoulliRBM
from sklearn.pipeline import Pipeline
from sklearn import linear_model

# import required NEDC modules
#
import nedc_debug_tools as ndt
import nedc_file_tools as nft
import nedc_cov_tools as nct

#---------------------------- Example -----------------------------------------
# alg = Alg()
# alg.set(LDA_NAME)
# alg.load_parameters("params_00.txt")
#
# data = MLToolData("data.csv")
#
# score, model = alg.train(data)
# labels, post = alg.predict(data)
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
#
# global variables are listed here
#
#------------------------------------------------------------------------------

# set the filename using basename
#
__FILE__ = os.path.basename(__file__)

DATA_LABELS = "labels"
DATA_DATA = "data"

DEF_TRAIN_LABELS_FNAME = "train_labels.csv"

# define the names of keys in dictionaries that are used to access parameters:
#  these are common across all algorithms. a parameter dictionary has
#  two keys (name and param). a model dictionary has two keys (name and model).
#
ALG_PRIORS_ML = "ml"
ALG_PRIORS_MAP = "map"

ALG_PRM_KEY_NAME = "name"
ALG_PRM_KEY_PARAM = "params"
ALG_PRM_KEY_PRIOR = "prior"
ALG_PRM_KEY_WEIGHTS = "weights"


ALG_MDL_KEY_NAME = ALG_PRM_KEY_NAME
ALG_MDL_KEY_MODEL = "model"
ALG_MDL_KEY_MEANS = "means"
ALG_MDL_KEY_COV = "covariance"
ALG_MDL_KEY_PRIOR = "prior"
ALG_MDL_KEY_TRANS = "transform"
ALG_MDL_KEY_EVAL = "eigen_value"
ALG_MDL_KEY_MAPPING_LABEL = "mapping_label"

# define formats for generating a scoring report
#
ALG_SCL_PCT = float(100.0)

ALG_FMT_DTE = "Date: %s%s"
ALG_FMT_LBL = "%06d"
ALG_FMT_ERR = "%012s %10.2f%%"
ALG_FMT_WLB = "%10s"
ALG_FMT_WCL = "%6d"
ALG_FMT_WPC = "%6.2f"
ALG_FMT_WST = "%6d (%6.2f%%)"

#------------------------------------------------------------------------------
# Alg = PCA: define dictionary keys for parameters
#
# define the algorithm name
#
PCA_NAME = "PCA"

# the parameter block for PCA looks like this:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'PCA',
#   'params': {
#     'name': 'PCA',
#     'prior': 'ml',
#     'ctype': 'full',
#    'center': 'None',
#     'scale': 'biased'
#   }
#  })
#
# Define the keys for these parameters. The keys ("name" and "params") are
# the same across all algorithms. The actual parameters are contained
# in a sub-dictionary that has keys specific to that algorithm.
#
PCA_PRM_KEY_NAME = ALG_PRM_KEY_NAME
PCA_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
PCA_PRM_KEY_PRIOR = ALG_PRM_KEY_PRIOR
PCA_PRM_KEY_CTYPE = nct.PRM_CTYPE
PCA_PRM_KEY_CENTER = nct.PRM_CENTER
PCA_PRM_KEY_SCALE = nct.PRM_SCALE
PCA_PRM_KEY_COMP ='n_components'

# The model for PCA contains:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'PCA',
#   'model': {
#         'prior': numpy array,
#         'means': list,
#    'covariance': matrix
#   }
#  })
#
# Define the keys for these model parameters. The first key, name, is the same
# across all algorithms. The actual parameters are contained in
# a sub-dictionary that has keys specific to that algorithm.
#
PCA_MDL_KEY_NAME = ALG_MDL_KEY_NAME
PCA_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
PCA_MDL_KEY_PRIOR = ALG_MDL_KEY_PRIOR
PCA_MDL_KEY_MEANS = ALG_MDL_KEY_MEANS
PCA_MDL_KEY_TRANS = ALG_MDL_KEY_TRANS
PCA_MDL_KEY_COV = ALG_MDL_KEY_COV
PCA_MDL_KEY_EVAL = ALG_MDL_KEY_EVAL

#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = QDA: define dictionary keys for parameters
#

# define the algorithm name
#
QDA_NAME = "QDA"

# the parameter block for QDA looks like this:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'QDA',
#     'params': {
#       'name': 'QDA',
#      'prior': 'ml',
#      'ctype': 'full',
#     'center': 'None',
#      'scale': 'biased'
#    }
#   })
#
# Define the keys for these parameters.
#
QDA_PRM_KEY_NAME = ALG_PRM_KEY_NAME
QDA_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
QDA_PRM_KEY_PRIOR = ALG_PRM_KEY_PRIOR
QDA_PRM_KEY_CTYPE = nct.PRM_CTYPE
QDA_PRM_KEY_CENTER = nct.PRM_CENTER
QDA_PRM_KEY_SCALE = nct.PRM_SCALE
QDA_PRM_KEY_COMP ='n_components'

# The model for QDA contains:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'QDA',
#    'model': {
#          'prior': numpy array,
#          'means': list,
#    'covariance': matrix
#   }
#  })
#
# Define the keys for these model parameters.
#
QDA_MDL_KEY_NAME = ALG_MDL_KEY_NAME
QDA_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
QDA_MDL_KEY_PRIOR = ALG_MDL_KEY_PRIOR
QDA_MDL_KEY_MEANS = ALG_MDL_KEY_MEANS
QDA_MDL_KEY_COV = ALG_MDL_KEY_COV
QDA_MDL_KEY_TRANS = ALG_MDL_KEY_TRANS
QDA_MDL_KEY_EVAL = ALG_MDL_KEY_EVAL
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = LDA: define dictionary keys for parameters
#

# define the algorithm name
#
LDA_NAME = "LDA"

# the parameter block for LDA looks like this:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'LDA',
#   'params': {
#      'name': 'LDA',
#     'prior': 'ml',
#     'ctype': 'full',
#    'center': 'None',
#     'scale': 'None'
#    }
#  })
#
#
# Define the keys for these parameters.
#
LDA_PRM_KEY_NAME = ALG_PRM_KEY_NAME
LDA_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
LDA_PRM_KEY_PRIOR = ALG_PRM_KEY_PRIOR
LDA_PRM_KEY_CTYPE = nct.PRM_CTYPE
LDA_PRM_KEY_CENTER = nct.PRM_CENTER
LDA_PRM_KEY_SCALE = nct.PRM_SCALE

# The model for LDA contains:
#
#   defaultdict(<class 'dict'>, {
#   'name': 'LDA',
#   'model': {
#        'prior': numpy array,
#        'means': list,
#    'transform': matrix
#   }
#  })
#
# Define the keys for these model parameters.
#
LDA_MDL_KEY_NAME = ALG_MDL_KEY_NAME
LDA_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
LDA_MDL_KEY_PRIOR = ALG_MDL_KEY_PRIOR
LDA_MDL_KEY_MEANS = ALG_MDL_KEY_MEANS
LDA_MDL_KEY_TRANS = ALG_MDL_KEY_TRANS
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = QLDA: define dictionary keys for parameters
#

# define the algorithm name
#
QLDA_NAME = "QLDA"

# the parameter block for QLDA contains:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'QLDA',
#   'params': {
#      'name': 'QLDA',
#     'prior': 'ml',
#     'ctype': 'full',
#    'center': 'None',
#     'scale': 'None'
#   }
#  })
#
# define the keys for these parameters. the keys ("name" and "params"), are
# the same across all algorithms. the actual parameters are contained
# in a sub-dictionary that has keys specific to that algorithm.
#
QLDA_PRM_KEY_NAME = ALG_PRM_KEY_NAME
QLDA_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
QLDA_PRM_KEY_PRIOR = ALG_PRM_KEY_PRIOR
QLDA_PRM_KEY_CTYPE = nct.PRM_CTYPE
QLDA_PRM_KEY_CENTER = nct.PRM_CENTER
QLDA_PRM_KEY_SCALE = nct.PRM_SCALE

# The model for QLDA contains:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'QLDA',
#    'model': {
#         'prior': numpy array,
#         'means': list,
#     'transform': matrix
#   }
#  })
#
# Define the keys for these model parameters.
#
QLDA_MDL_KEY_NAME = ALG_MDL_KEY_NAME
QLDA_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
QLDA_MDL_KEY_PRIOR = ALG_MDL_KEY_PRIOR
QLDA_MDL_KEY_MEANS = ALG_MDL_KEY_MEANS
QLDA_MDL_KEY_TRANS = ALG_MDL_KEY_TRANS
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = NB: define dictionary keys for parameters
#

# define the algorithm name
#
NB_NAME = "NB"

# the parameter block for NB looks like this:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'NB',
#   'params': {
#      'name': 'NB',
#     'prior': 'ml'
#     'average': 'None'
#      'multi_class': 'ovr'
#    }
#  })
NB_PRM_KEY_NAME = ALG_PRM_KEY_NAME
NB_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
NB_PRM_KEY_PRIOR = ALG_PRM_KEY_PRIOR

# The model for NB contains:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'NB',
#    'model': Sklearn.NB.Model
#  })
#
# Define the keys for these parameters.
#
NB_MDL_KEY_NAME = ALG_MDL_KEY_NAME
NB_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = EUCLIDEAN: define dictionary keys for parameters
#
# define the algorithm name
#
EUCLIDEAN_NAME = "EUCLIDEAN"

# the parameter block for EUCLIDEAN looks like this:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'EUCLIDEAN',
#   'params': {
#      'name': 'EUCLIDEAN',
#   'weights': list
#    }
#  })
EUCLIDEAN_PRM_KEY_NAME = ALG_PRM_KEY_NAME
EUCLIDEAN_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
EUCLIDEAN_PRM_KEY_WEIGHTS = ALG_PRM_KEY_WEIGHTS

# The model for EUCLIDEAN contains:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'EUCLIDEAN',
#    'model' {
#      'means': list,
#    }
#  })
#
# Define the keys for these parameters.
#
EUCLIDEAN_MDL_KEY_NAME = ALG_MDL_KEY_NAME
EUCLIDEAN_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
EUCLIDEAN_MDL_KEY_MEANS = ALG_MDL_KEY_MEANS

#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = KNN: define dictionary keys for parameters
#

# define the algorithm name
#
KNN_NAME = "KNN"

# the parameter block for NB looks like this:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'KNN',
#   'params': {
#      'name': 'KNN',
#     'neighbor': 1
#    }
#  })

KNN_PRM_KEY_NAME = ALG_PRM_KEY_NAME
KNN_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
KNN_PRM_KEY_NEIGHB = "neighbor"

# The model for KNN contains:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'KNN',
#    'model': Sklearn KNN Model
#  })
#
KNN_MDL_KEY_NAME = ALG_MDL_KEY_NAME
KNN_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = RNF: define dictionary keys for parameters
#

# define the algorithm name
#
RNF_NAME = "RNF"

# the parameter block for NB looks like this:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'RNF',
#   'params': {
#       'name': 'RNF',
#'n_estimator': 1,
#  'max_depth': 5,
#  'criterion': 'gini'
#    }
#  })

RNF_PRM_KEY_NAME = ALG_PRM_KEY_NAME
RNF_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
RNF_PRM_KEY_ESTIMATOR = "estimator"
RNF_PRM_KEY_CRITERION = "criterion"
RNF_PRM_KEY_MAXDEPTH  = 'max_depth'
RNF_PRM_KEY_RANDOM = 'random_state'

# The model for RNF contains:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'RNF',
#    'model': Sklearn RNF Model
#  })
#
RNF_MDL_KEY_NAME = ALG_MDL_KEY_NAME
RNF_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = SVM: define dictionary keys for parameters
#

# define the algorithm name
#
SVM_NAME = "SVM"

# the parameter block for SVMlooks like this:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'SVM ,
#   'params': {
#      'name': 'SVM',
#         'C': 1,
#     'gamma': 0.1,
#    'kernel': 'linear'
#    }
#  })

SVM_PRM_KEY_NAME = ALG_PRM_KEY_NAME
SVM_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
SVM_PRM_KEY_C = "c"
SVM_PRM_KEY_GAMMA = "gamma"
SVM_PRM_KEY_KERNEL = 'kernel'

# The model for SVM contains:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'SVM',
#    'model': Sklearn SVM Model
#  })
#
SVM_MDL_KEY_NAME = ALG_MDL_KEY_NAME
SVM_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = SVM: define dictionary keys for parameters
#

# define the algorithm name
#
MLP_NAME = "MLP"

# the parameter block for SVMlooks like this:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'MLP ,
#   'params': {
#                 'name': 'MLP',
#          'hidden_size': 3,
#           'activation': 'relu',
#               'solver': 'adam',
#            'batch_size: 'auto',
#         'learning_rate: 'constant',
#         'random_state': 0,
#    'learning_rate_init: 0.001,
#        'early_stopping: False,
#               'shuffle: True,
#   'validation_fraction: 0.1,
#             'momentum': 0.9
#             'max_iter': 200
#    }
#  })

MLP_PRM_KEY_NAME = ALG_PRM_KEY_NAME
MLP_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
MLP_PRM_KEY_HSIZE = "hidden_size"
MLP_PRM_KEY_ACT = "activation"
MLP_PRM_KEY_SOLVER = "solver"
MLP_PRM_KEY_BSIZE = "batch_size"
MLP_PRM_KEY_LR = "learning_rate"
MLP_PRM_KEY_RANDOM = "random_state"
MLP_PRM_KEY_LRINIT = "learning_rate_init"
MLP_PRM_KEY_STOP = "early_stopping"
MLP_PRM_KEY_SHUFFLE = "shuffle"
MLP_PRM_KEY_VAL = "validation_fraction"
MLP_PRM_KEY_MOMENTUM = "momentum"
MLP_PRM_KEY_MITER = "max_iter"

# The model for MLP contains:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'MLP',
#    'model': Sklearn MLP Model
#  })
#
MLP_MDL_KEY_NAME = ALG_MDL_KEY_NAME
MLP_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = KMEANS: define dictionary keys for parameters
#

# define the algorithm name
#
KMEANS_NAME = "KMEANS"

# the parameter block for KMEANS looks like this:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'KMEANS"
#   'params': {
#               'name': 'KMEANS',
#          'n_cluster': 2,
#             'n_init': 3,
#       'random_state': 0,
#           'max_iter': 100
#    }
#  })

KMEANS_PRM_KEY_NAME = ALG_PRM_KEY_NAME
KMEANS_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
KMEANS_PRM_KEY_NCLUSTER = "n_cluster"
KMEANS_PRM_KEY_NINIT = "n_init"
KMEANS_PRM_KEY_RANDOM = "random_state"
KMEANS_PRM_KEY_MITER = "max_iter"

# The model for KMEANS contains:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'KMEANS',
#    'model': Sklearn KMEANS Model
#  })
#
KMEANS_MDL_KEY_NAME = ALG_MDL_KEY_NAME
KMEANS_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# Alg = RBM: define dictionary keys for parameters
#
# define the algorithm name
#
RBM_NAME = "RBM"

# the parameter block for RBM looks like this:
#
#  defaultdict(<class 'dict'>, {
#   'name': 'RBM"
#   'params': {
#               'name': 'RBM',
#          'n_components': 2,
#             'learning_rate': 3,
#       'batch_size': 0,
#           'n_iter': 100,
#           'verbose': 0,
#            'random_state:None
#    }
#  })

RBM_PRM_KEY_NAME = ALG_PRM_KEY_NAME
RBM_PRM_KEY_PARAM = ALG_PRM_KEY_PARAM
RBM_PRM_KEY_COMP = "n_components"
RBM_PRM_KEY_NITER = "n_iter"
RBM_PRM_KEY_RANDOM = "random_state"
RBM_PRM_KEY_LR = "learning_rate"
RBM_PRM_KEY_BSIZE = "batch_size"
RBM_PRM_KEY_VERBOSE = "verbose"
RBM_PRM_KEY_CLASSIF ="classifier"

# The model for RBM contains:
#
#   defaultdict(<class 'dict'>, {
#    'name': 'RBM',
#    'model': Sklearn RBM Model
#  })
#
RBM_MDL_KEY_NAME = ALG_MDL_KEY_NAME
RBM_MDL_KEY_MODEL = ALG_MDL_KEY_MODEL


# declare global debug and verbosity objects so we can use them
# in both functions and classes
#
dbgl_g = ndt.Dbgl()
vrbl_g = ndt.Vrbl()

#------------------------------------------------------------------------------
#
# functions listed here
#
#------------------------------------------------------------------------------

class MLToolData:
    """
    Dataclass for MLToolData
    """

    def __init__(self, dir_path = "", lndx = 0, nfeats = -1):
        """
        method: constructor

        arguments:
         dir_path: directory path to the file ("")
         lndx: the label index (0)
         nfeats: number of features (-1)

        return:
         none

        description:
         none

        note:
         for nfeats, -1 means that we choose all of the features.
        """
        self.dir_path = dir_path
        self.lndx = lndx
        self.nfeats = nfeats

        self.data = []
        self.labels = []
        self.num_of_classes = 0
        self.mapping_label = {}

        self.load()

    def __repr__(self) -> str:
        return (f"MLToolData({self.dir_path}, label index = {self.lndx}, "
                f"# of features = {self.nfeats if self.nfeats != -1 else 'all'})")

    @classmethod
    def from_imld(cls, imld_data):
        """
        function: from_imld

        argument:
         imld_data: data that is generated by IMLD

        return:
         a MLToolData object

        description:
         this function is a classmethod that creates a new MLToolData object
         from IMLD's data structure
        """
        self = cls.__new__(cls)
        self.dir_path = ""
        self.lndx = 0
        self.nfeats = -1
        self.num_of_classes = len(imld_data)

        labels = []
        data = []
        mapping_label = {}

        # converting the data into our new format
        #
        for i, lists in enumerate(imld_data):
            mapping_label[i] = i
            labels.extend([i] * len(lists))
            for item in lists:
                data.append(item)

        labels = np.asarray(labels)
        data = np.asarray(data)

        self.labels = labels
        self.data = data
        self.mapping_label = mapping_label

        return self

    @staticmethod
    def is_excel(fname):
        """
        function: is_excel

        arguments:
        fname: filename of the data

        return:
        a boolean value indicating status

        description:
        this function checks if file is an excel spreadsheet.
        """

        # use Pandas to open and parse the file. if this errors,
        # we assume it is a csv file.
        #
        try:
            pd.read_excel(fname)
        except ValueError:
            return False

        # exit gracefully
        #
        return True

    def map_label(self):# -> type[list[_T]] | ndarray | NDArray:

        labels = np.array(self.labels)
        unique_labels = np.unique(labels)

        labels = self.labels

        for i in range(len(unique_labels)):
            for j in range(len(labels)):
                if labels[j] == unique_labels[i]:
                    labels[j]=i

        return labels

    def load(self):
        """
        function: load_data

        arguments:
        None

        return:
        a list of numpy arrays or None if it fails

        description:
        this function reads data from either an excel sheet or csv file
        and converts it to a dictionary representing the labels and the data.

        Ex: data: {
            "labels": numpy.ndarray[0, 0, 0, 1, 1, 1, 1],
            "data"  : [np.ndarray[01,02,03],
                    [04,05,06],
                    [07,08,09],
                    [60,61,62],
                    [70,71,72],
                    [80,81,82],
                    [90,91,92]]
        }

        The example data above has 2 classes and 3 features.The labels ordering
        and data ordering are the same. The first three vectors are in class "0" and
        the last four are in class "1".

        for nfeats, it will use all the feature from the start to the specified value
        Not counting the label column.

        Ex: if nfeats = 3, then we assume column [0,1,2].

        Ex: If we have [0,1,2,3,4,5] and lndx = 1, nFeatures = 3 then the column
            features would be [0,2,3] since we exclude the column label.

        if the data fails to be loaded, an error is generated and None is returned.
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: reading data" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__))

        try:
            if self.is_excel(self.dir_path):
                df = pd.read_excel(self.dir_path, header = None)
            else:
                df = pd.read_csv(self.dir_path, header = None, engine = "c", comment = "#")
        except Exception:
            raise("Error: %s (line: %s) %s: %s (%s)" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "unknown file or data format", self.dir_path))

        if self.lndx >= df.shape[1]:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "Label index out of range"))
            return None

        # pop the label column
        #
        label_column = df.pop(self.lndx)

        # clear label map if there was one already
        #
        if not self.mapping_label:
            self.mapping_label.clear()

        # create a label map for readable label to an index.
        #   Note: Since we are sorting, the mapping will not always be in order if
        #         string because sorting uses string comparison
        #
        for ind, val in enumerate(sorted(label_column.unique())):

            if isinstance(val, str):
                self.mapping_label[ind] = val

            # assume any label that is not a string to be a integer
            #
            else:
                self.mapping_label[ind] = int(val)

        if self.nfeats >= df.shape[1] or self.nfeats < -1:
            self.nfeats = -1

        # if the number of feature is specified then we would need to reshape the
        # data frame
        #
        if self.nfeats != -1:
            df = df.iloc[:, : self.nfeats]

        # append the label column at the beginning of the dataframe
        # and rename its column
        #
        df = pd.concat([label_column, df], axis = 1)
        df.columns = list(range(df.shape[1]))

        # set the index of the table using the label column
        #
        df.set_index(df.keys()[0], inplace = True)

        self.data = df.values
        self.labels = df.index.to_numpy()
        self.num_of_classes = len(set(self.labels))


    def sort(self, inplace = False):
        """
        function: sort

        arguments:
         inplace: flag to sort the data inplace (False)

        return:
         If inplace = True -> returns None
         If inplace = False -> returns the sorted data

        description:
        this function sorts the given data model.
        """

        # samples and labels
        #
        samples = self.data
        labels = np.array(self.labels)

        # np.unique() returns a set of unique values that
        # is in order
        #
        uniq_labels = np.unique(labels)

        # empty list to save sorted data snd labels
        #
        sorted_data = []
        sorted_labels = []

        # loop through the unique labels
        #
        for element in uniq_labels:

            # empty list to save class labels and class data
            #
            class_data = []
            class_labels = []

            # loop through the len labels and compare labels with unique label
            #
            for i in range(len(labels)):
                if labels[i] == element:
                    class_data.append(samples[i])
                    class_labels.append(labels[i])

            sorted_data.extend(class_data)
            sorted_labels.extend(class_labels)

        sorted_data = np.array(sorted_data)
        sorted_labels = np.array(sorted_labels)

        if inplace:
            self.data = sorted_data
            self.labels = sorted_labels

            return None
        else:

            MLToolDataNew = copy.deepcopy(self)
            MLToolDataNew.data = sorted_data
            MLToolDataNew.labels = sorted_labels

            return MLToolDataNew

    def write(self, oname, label):
        """
        function: write

        argument:
         oname: the output file name
         label: the label to write

        return:
        boolean indicating the status

        description:
        this function writes the data with new label to a file
        """

        d = pd.DataFrame(self.data)

        #  add the label to the first column of the file
        #
        try:
            d.insert(0, column = "labels", value = label)
        except ValueError:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "Labels column already existed within the data"))
            return False

        if self.is_excel(self.dir_path):
            d.to_excel(oname)
        else:
            d.to_csv(oname, index = False, header = False)

        return True

    def group_by_class(self):
        """
        function: group_by_class

        argument:
         none

        return:
         group data

        description:
        this function group the data by the label
        """
        group_data = defaultdict(list)

        for label, data in zip(self.labels, self.data):
            group_data[label].append(data)

        return group_data
#
# end of dataclass

#------------------------------------------------------------------------------
#
# classes are listed here
#
#------------------------------------------------------------------------------

class Alg:
    """
    Class: Alg

    arguments:
     none

    description:
     This is a class that acts as a wrapper for all the algorithms supported
     in this library.
    """

    #--------------------------------------------------------------------------
    #
    # allocation methods: constructors/destructors/etc.
    #
    #--------------------------------------------------------------------------

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         none
        """

        # set the class name
        #
        Alg.__CLASS_NAME__ = self.__class__.__name__
        self.alg_d = None
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # assignment methods: set/get
    #
    #--------------------------------------------------------------------------

    def set(self, alg_name):
        """
        method: set

        arguments:
         alg_name: name of the algorithm as a string

        return:
         a boolean indicating status

        description:
         note that this method does not descend into a specific alg class.
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: set algorithm name (%s)" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__, alg_name))

        # attempt to set the name only
        #
        if alg_name in ALGS:
            self.alg_d = ALGS[alg_name]
        else:
            print("Error: %s (line: %s) %s: %s (%s)" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "unknown algorithm name", alg_name))
            return False

        # exit gracefully
        #
        return True
    #
    # end of method

    def set_parameters(self, parameters):
        """
        method: set_parameters

        arguments:
         parameters: a dictionary object containing an algorithm's parameters

        return:
         a boolean value indicating status

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: setting parameters" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check that the argument is a valid dictionary
        #
        if not isinstance(parameters, (dict, defaultdict)):
            raise TypeError(
            f"{__FILE__} (line: {ndt.__LINE__} {ndt.__NAME__}: ",
            "invalid parameter structure",
            f"dict, defaultdict expected, got '{type(parameters).__name__}')")

        # check the algorithm name of the parameter file
        #
        if self.set(parameters[ALG_PRM_KEY_NAME]) is False:
            print("Error: %s (line: %s) %s: %s (%s)" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "unsupported algorithm name", parameters[ALG_PRM_KEY_NAME]))

        # set the parameters
        #
        self.alg_d.params_d = parameters

        # exit gracefully
        #
        return True
    #
    # end of method

    def get(self):
        """
        method: get

        arguments:
         none

        return:
         the current algorithm setting by name

        description:
         note that this method does not descend into a specific alg class.
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: getting the algorithm name" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if an algorithm is set
        #
        if self.alg_d is None:
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "no algorithm has been set"))
            return None

        # exit gracefully
        #
        return self.alg_d.__class__.__name__
    #
    # end of method

    def get_ref_labels(self, data):
        """
        method: get_ref_labels

        arguments:
         data: the data including labels

        return:
         a list of labels in a list (needed by numpy)

        description:
         We use this method to convert the data to a flat list of labels for
         the data. The reference labels are implied by the array location.
        """

        # get labels as the value of data dictionary
        #
        labels = data.labels

        # exit gracefully
        #
        return labels
    #
    # end of method

    def get_hyp_labels(self, hyp_labels):
        """
        method: get_hyp_labels

        arguments:
         data: the list of labels as a list of lists

        return:
         a list of labels in a list (needed by numpy)

        description:
         We use this method to convert the data to a flat list of labels.
        """

        # get labels as the value of data dictionary
        #
        labels = hyp_labels

        # exit gracefully
        #
        return labels
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # i/o related methods: load/save
    #
    #--------------------------------------------------------------------------

    def load_model(self, fname):
        """
        method: load_model

        arguments:
         fname: a filename containing a model

        return:
         a dictionary containing the model

        description:
         none
        """

        # unpickle the model file
        #
        try:
            fp = open(fname, nft.MODE_READ_BINARY)
            model = pickle.load(fp)
        except:
            print("Error: %s (line: %s) %s: %s (%s)" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "error loading model file", fname))
            return None

        # check the type of data
        #
        if not isinstance(model, (dict, defaultdict)):
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "unknown model type"))
            return None

        # check model file key length: it should only contain 2 keys
        #
        if len(model) != int(2):
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "unknown model format"))
            return None

        # check the algorithm name of the model file
        #
        if self.set(model[ALG_MDL_KEY_NAME]) is False:
           print("Error: %s (line: %s) %s: %s (%s)" %
                 (__FILE__, ndt.__LINE__, ndt.__NAME__,
                  "unsupported algorithm name", model[ALG_MDL_KEY_NAME]))

        # set the parameters
        #
        self.alg_d.model_d = model

        # exit gracefully and return the model
        #
        return self.alg_d.model_d
    #
    # end of method

    def load_parameters(self, fname):
        """
        method: load_parameters

        arguments:
         fname: a filename containing a model parameters

        return:
         a dictionary containing the parameters

        description:
         note that this method loads a specific algorithm parameter block.
         the algorithm name must be set before it is called.
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: loading parameters (%s)" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__, fname))

        # check that an algorithm has been set
        #
        if self.alg_d is None:
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "no algorithm has been set"))
            return None

        # make sure the file is a valid parameter file
        #
        if nft.get_version(fname) is None:
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "invalid parameter file (version not specified or \
                   invalid verison)"))
            return None

        # attempt to load the parameters
        #
        params = nft.load_parameters(fname, self.alg_d.__class__.__name__)
        if params is None:
            print("Error: %s (line: %s) %s: %s [%s]" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "unable to parse parameter file", fname))
            return None

        # set the internal parameters
        #
        self.alg_d.params_d[ALG_PRM_KEY_NAME] = self.alg_d.__class__.__name__
        self.alg_d.params_d[ALG_PRM_KEY_PARAM] = params

        # exit gracefully
        #
        return self.alg_d.params_d
    #
    # end of method

    def save_model(self, fname):
        """
        method: save_model

        arguments:
         fname: a filename to be written

        return:
         a boolean value indicating status

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: saving model (%s)" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__, fname))

        # check that there is a valid model
        #
        if self.alg_d is None:
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "invalid model"))
            return False

        # pickle it to a file and trap for errors
        #
        try:
            fp = open(fname, nft.MODE_WRITE_BINARY)
            pickle.dump(self.alg_d.model_d, fp)
            fp.close()
        except:
            print("Error: %s (line: %s) %s: %s (%s)" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "error writing model file", fname))
            return False

        # exit gracefully
        #
        return True
    #
    # end of method

    def save_parameters(self, fname):
        """
        method: save_parameters

        arguments:
         fname: a filename to be written

        return:
         a boolean value indicating status

        description:
         this function writes the current self.alg.params_d to an
         NEDC parameter file
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: saving parameters" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if an algorithm has been set
        #
        if self.alg_d is None:
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "no algorithm has been set"))
            return False

        # check if params_d is empty
        #
        if self.alg_d.params_d is None:
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "parameter block is empty"))
            return False

        # open the file for writing
        #
        try:
            fp = open(fname, nft.MODE_WRITE_TEXT)
        except:
            print("Error: %s (line: %s) %s: error opening file (%s)" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__, fname))

        # write a bare bones parameter file:
        #  start with the version information
        #
        fp.write("%s %s %s" % (nft.DELIM_VERSION, nft.DELIM_EQUAL,
                               nft.PFILE_VERSION + nft.DELIM_NEWLINE))
        fp.write("%s %s" % (self.alg_d.__class__.__name__,
                            nft.DELIM_BOPEN + nft.DELIM_NEWLINE))

        # add the parameter structure
        #
        for key, val in self.alg_d.params_d[ALG_PRM_KEY_PARAM].items():
            fp.write(" %s %s %s" % (key, nft.DELIM_EQUAL,
                                    val + nft.DELIM_NEWLINE))

        fp.write("%s" % (nft.DELIM_BCLOSE + nft.DELIM_NEWLINE))

        # exit gracefully
        #
        return True
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              *, # This means that after the "data" argument,
                 # you would need a keyword argument.
              write_train_labels = False,
              fname_train_labels = DEF_TRAIN_LABELS_FNAME,
              ):
        """
        method: train

        arguments:
         data: a list of numpy matrices where the index corresponds to the class
         write_train_labels: option to output the predicted labels from the after
                             after training (False)
         fname_train_labels: the fname to output it too ("train_labels.csv")
         excel: if true, write the file as excel (.xlsx) (False)

         Note: After the "data" argument, you would need a keyword argument.

         Ex: train(data, write_train_labesl = True, fname = "labels.csv")

        return:
         model: a dictionary containing the model (data dependent)
         score: a float value containing a measure of the goodness of fit

        description:
         note that data is a list of matrices organized by class label,
         so the labels are implicit in the data. the index in the list is
         the class label, and the matrix are the feature vectors:

         class 0:
          data[0] = array[[ 1  2  3  4],
                          [ 5  6  7  8]]
         class 1:
          data[1] = array[[10 11 12 13],
                          [14 15 16 17],
                          [90 91 92 93]]

         note that these are numpy matrices not native Python lists.
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if the algorithm has been configured
        #
        if self.alg_d is None:
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "no algorithm has been set"))
            return None, None

        if not isinstance(data, MLToolData):
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "data is not type of MLToolData"))
            return None, None

        # exit gracefully
        #
        return self.alg_d.train(data,
                                write_train_labels,
                                fname_train_labels)
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a numpy float matrix of feature vectors (each row is a vector)
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels
         posteriors: a float numpy vector with the posterior probability
         for each class assignment

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if the algorithm has been configured
        #
        if self.alg_d is None:
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "no algorithm has been set"))
            return None, None

        if not isinstance(data, MLToolData):
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "data is not type of MLToolData"))
            return None, None

        # exit gracefully
        #
        return self.alg_d.predict(data, model)
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # scoring methods: score/report
    #
    #--------------------------------------------------------------------------

    def confusion_matrix(self, num_classes, ref_labels, hyp_labels):
        """
        method: confusion_matrix

        arguments:
         num_classes: the number of classes
         ref_labels: a list of reference labels
         hyp_labels: a list of hypothesized labels

        return:
         a confusion matrix that is a numpy array

        description:
         note: we pass the number of classes because all of the classes
         might not appear in the reference labels.
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: generating a confusion matrix" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # build a labels matrix
        #
        lbls = list(range(num_classes))

        # get the confusion matrix
        #
        return sklearn_confusion_matrix(ref_labels, hyp_labels, labels = lbls)
    #
    # end of method

    def print_confusion_matrix(self, cnf, mapping_label, fp = sys.stdout):
        """
        method: print_confusion_matrix

        arguments:
         cnf: the confusion matrix
         mapping_label: the mapping labels from an algorithm
         fp: an open file pointer [stdout]

        return:
         a boolean value indicating status

        description:
         none
        """

        # get the number of rows and colums for the numeric data:
        #  we assume a square matrix in this case
        #
        nrows = len(cnf)
        ncols = len(cnf)

        # create the table headers
        #
        headers = ["Ref/Hyp:"]
        for i in range(nrows):
            if isinstance(mapping_label[i], int):
                headers.append(ALG_FMT_LBL % mapping_label[i])
            else:
                headers.append(mapping_label[i])

        # convert the confusion matrix to percentages
        #
        pct = np.empty_like(cnf, dtype = float)
        for i in range(nrows):
            sum = float(cnf[i].sum())
            for j in range(ncols):
                pct[i][j] = float(cnf[i][j]) / sum

        # get the width of each colum and compute the total width:
        #  the width of the percentage column includes "()" and two spaces
        #
        width_lab = int(float(ALG_FMT_WLB[1:-1]))
        width_cell = int(float(ALG_FMT_WCL[1:-1]))
        width_pct = int(float(ALG_FMT_WPC[1:-1]))
        width_paren = 4
        total_width_cell = width_cell + width_pct + width_paren
        total_width_table = width_lab + \
            ncols * (width_cell + width_pct + width_paren)

        # print the title
        #
        title = "confusion matrix"
        fp.write("%s".center(total_width_table - len(title)) % title)
        fp.write(nft.DELIM_NEWLINE)

        # print the first heading label right-aligned
        #
        fp.write("%*s" % (width_lab, "Ref/Hyp:"))

        # print the next ncols labels center-aligned:
        #  add a newline at the end
        #
        for i in range(1, ncols + 1):

            # compute the number of spaces needed to center-align
            #
            num_spaces = total_width_cell - len(headers[i])
            num_spaces_2 = int(num_spaces / 2)

            # write spaces, header, spaces
            #
            fp.write("%s" % nft.DELIM_SPACE * num_spaces_2)
            fp.write("%s" % headers[i])
            fp.write("%s" % nft.DELIM_SPACE * (num_spaces - num_spaces_2))

        fp.write(nft.DELIM_NEWLINE)

        # write the rows with numeric data:
        #  note that "%%" is needed to print a percent
        #
        for i in range(nrows):

            # write the row label
            #
            fp.write("%*s" % (width_lab, headers[i+1] + nft.DELIM_COLON))

            # write the numeric data and then add a new line
            #
            for j in range(ncols):
                fp.write(ALG_FMT_WST % (cnf[i][j], ALG_SCL_PCT * pct[i][j]))
            fp.write(nft.DELIM_NEWLINE)

        # exit gracefully
        #
        return True
    #
    # end of method

    def score(self, num_classes, data, hyp_labels, *,
              isPrint = False,
              fp = sys.stdout):
        """
        method: score


        arguments:
         num_classes: the number of classes
         data: the input data including reference labels
         hyp_labels: the hypothesis labels
         isPrint: a flag to print out the scoring output (False)

        return:
         conf_matrix, sens, spec, prec, acc, err, f1

         if print = True:
            return None

        description:
         Note that we must provide the number of classes because the data
         might not contain all the data.

        """

        # display informational message
        #
        if dbgl_g > ndt.BRIEF:
            print("%s (line: %s) %s: scoring the results" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__))

        r_labels = self.get_ref_labels(data)
        h_labels = self.get_hyp_labels(hyp_labels)

        # calculate confusion matrix
        #
        conf_matrix = self.confusion_matrix(num_classes, r_labels, h_labels)

        # calculate accuracy and error score
        #
        acc = accuracy_score(r_labels, h_labels)
        err = ALG_SCL_PCT * (float(1.0) - acc)
        sens = None
        spec = None
        prec = None
        f1 = None

        if isPrint:

            self.print_confusion_matrix(conf_matrix, data.mapping_label, fp = fp)
            fp.write(nft.DELIM_NEWLINE)

            # generate a master list of labels:
            #  we have to do this because some of the labels might not appear
            #  in the data
            #
            lbls = []
            for i in range(num_classes):
                lbls.append(ALG_FMT_LBL % i)

            # generate and print the classification report
            #
            rpt = classification_report(r_labels, h_labels,
                                        labels = lbls, zero_division = 1)
            fp.write(rpt)
            fp.write(nft.DELIM_NEWLINE)

            # print out the error rate
            #
            print(ALG_FMT_ERR % ("error rate", err))
        else:

            if num_classes > 2:
                average='macro'
            else:
                average='binary'

            sens = sensitivity_score(r_labels, h_labels, average=average)
            spec = specificity_score(r_labels, h_labels, average=average)
            prec = precision_score(r_labels, h_labels, average=average)
            f1 = f1_score(r_labels, h_labels, average=average)

        return None if isPrint else conf_matrix, sens, spec, prec, acc, err, f1

    def print_score(self, num_classes, data, hyp_labels, fp = sys.stdout):
        """
        method: print_score

        arguments:
         num_classes: the number of classes
         data: the input data including reference labels
         hyp_labels: the hypothesis labels
         fp: an open file pointer [stdout]

        return:
         a boolean value indicating status

        description:
         Note that we must provide the number of classes because the data
         might not contain all the data.
        """

        # display informational message
        #
        if dbgl_g > ndt.BRIEF:
            print("%s (line: %s) %s: scoring the results" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # print the date and time
        #
        fp.write(ALG_FMT_DTE % (dt.datetime.now(), nft.DELIM_NEWLINE))
        fp.write(nft.DELIM_NEWLINE)

        # use numpy to generate a confusion matrix
        #
        rlabels = self.get_ref_labels(data)
        hlabels = self.get_hyp_labels(hyp_labels)
        cnf = self.confusion_matrix(num_classes, rlabels, hlabels)

        # print the confusion matrix in ISIP format
        #
        self.print_confusion_matrix(cnf, fp)
        fp.write(nft.DELIM_NEWLINE)

        # generate a master list of labels:
        #  we have to do this because some of the labels might not appear
        #  in the data
        #
        lbls = []
        for i in range(num_classes):
            lbls.append(ALG_FMT_LBL % i)

        # generate and print the classification report
        #
        rpt = classification_report(rlabels, hlabels,
                                    labels = lbls, zero_division = 1)
        fp.write(rpt)
        fp.write(nft.DELIM_NEWLINE)

        # compute the accuracy and the error rate
        #
        acc = accuracy_score(rlabels, hlabels)
        err = ALG_SCL_PCT * (float(1.0) - acc)
        print(ALG_FMT_ERR % ("error rate", err))

        # exit gracefully
        #
        return True
    #
    # end of method
#
# end of Alg

#------------------------------------------------------------------------------
class PCA:
    """
    Class: PCA

    arguments:
     none

    description:
     This is a class that implements Principal Components Analysis (PCA).
    """

    #--------------------------------------------------------------------------
    #
    # constructors/destructors/etc.
    #
    #--------------------------------------------------------------------------

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        PCA.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict(dict)

        # initialize a parameter dictionary
        #
        self.params_d[PCA_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[PCA_PRM_KEY_PARAM] = defaultdict(dict)

        # set the names
        #
        self.model_d[PCA_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[PCA_MDL_KEY_MODEL] = defaultdict(dict)
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data : MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary containing the model (data dependent)
         score: a float value containing a measure of the goodness of fit

        description:
         PCA is implemented as what is known as "pooled covariance", meaning
         that a single covariance matrix is computed over all the data. See:
         https://www.askpython.com/python/examples/principal-component-analysis
         for more details.
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # get sorted_labels and sorted_samples
        #
        data = data.sort()

        uni_label = np.unique(data.labels)
        new_data =[]
        for i in range(len(uni_label)):

            class_data =[]

            for j in range(len(data.labels)):

                if uni_label[i]==data.labels[j]:
                    class_data.append(data.data[j])

            new_data.append(np.array(class_data))

        # calculating number of classes
        #
        num_classes = len(new_data)

        # number of samples
        #
        npts = sum(len(element) for element in new_data)

        # initialize an empty array to save the priors
        #
        priors = np.empty((0,0))

        # case: (ml) equal priors
        #
        mode_prior = self.params_d[PCA_PRM_KEY_PARAM][PCA_PRM_KEY_PRIOR]

        if mode_prior == ALG_PRIORS_ML:

            # compute the priors for each class
            #
            self.model_d[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_PRIOR] = \
                np.full(shape = num_classes,
                        fill_value = (float(1.0) / float(num_classes)))

        # if the priors are based on occurrences : nct.PRIORs_MAP
        #
        elif mode_prior == ALG_PRIORS_MAP:

            # create an array of priors by finding the the number of points
            # in each class and dividing by the total number of samples
            #
            for element in new_data:

                # appending the number of the samples in
                # each element (class) to empty array

                priors = np.append(priors, len(element))

            # final calculation of priors
            #
            _sum = float(1.0) / float(npts)

            self.model_d[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_PRIOR] = priors * _sum

        else:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "unknown value for priors"))
            self.model_d[PCA_MDL_KEY_MODEL].clear()
            return None, None

        # calculate the means of each class:
        #  note these are a list of numpy vectors
        #
        means = []
        for element in new_data:
            means.append(np.mean(element, axis = 0))

        self.model_d[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_MEANS] = means

        # calculate the cov:
        #  note this is a single matrix
        #
        self.model_d[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_COV] = nct.compute(
            new_data,
            ctype = self.params_d[PCA_PRM_KEY_PARAM][PCA_PRM_KEY_CTYPE],
            center= self.params_d[PCA_PRM_KEY_PARAM][PCA_PRM_KEY_CENTER],
            scale= self.params_d[PCA_PRM_KEY_PARAM][PCA_PRM_KEY_SCALE])
        cov = self.model_d[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_COV]
        print(cov)

        # number of components
        #
        n_comp= int(self.params_d[PCA_PRM_KEY_PARAM][PCA_PRM_KEY_COMP])

        #if not( 0 < n_comp <= len(data.data[0])):
        if not( 0 < n_comp <= new_data[0].shape[1]):
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "features out of range"))

            self.model_d[PCA_MDL_KEY_MODEL].clear()

            return None, None

        # eigenvalue and eigen vector decomposition
        #
        eigvals, eigvecs = np.linalg.eig(cov)

        # sorting based on eigenvalues
        #
        sorted_indexes = eigvals.argsort()[::-1]

        eigvals = eigvals[sorted_indexes[0:n_comp]]
        eigvecs = eigvecs[:,sorted_indexes[0:n_comp]]
        if any(eigvals < 0):
                print("Error: %s (line: %s) %s: %s" %
                    (__FILE__, ndt.__LINE__, ndt.__NAME__,
                    "negative eigenvalues"))
                self.model_d[PCA_MDL_KEY_MODEL].clear()
                return None, None

        try:
            eigval_in = np.linalg.inv(np.diag(eigvals ** (1/2)))

        except np.linalg.LinAlgError:

            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "singular matrix model is none"))

            self.model_d[PCA_MDL_KEY_MODEL].clear()

            return None, None

        t = eigvecs @ eigval_in
        self.model_d[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_TRANS] = t

        # compute a transformation matrix for class-independent PCA
        #
        transf = np.identity(new_data[0].shape[1])

        # compute a goodness of fit measure: use the average weighted
        # mean-square-error computed across the entire data set
        #
        gsum = float(0.0)
        for i, d in enumerate(new_data):

           # iterate over the data in class i and calculate the norms

            _sum = float(0.0)
            for v in d:
                _sum += np.linalg.norm(transf * (v - means[i]))

            # weight by the prior
            #
            gsum += self.model_d[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_PRIOR][i] * \
                _sum

        score = gsum / float(npts)

        # exit gracefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a list of numpy float matrices of feature vectors
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels
         posteriors: a list of float numpy vectors with the posterior
         probabilities for each class

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d

        # check for model validity
        #
        if model[PCA_MDL_KEY_NAME] != PCA_NAME:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "incorrect model name"))
            return None, None

        if not model[PCA_MDL_KEY_MODEL]:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "model parameter is empty"))
            return None, None

        # get the number of dimensions
        #

        ndim = data.data.shape[1]

        # transform data to new environment
        #
        t =  model[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_TRANS]
        mu = model[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_MEANS]

        # calculate number of classes
        #
        num_classes = len(mu)
        mt = []
        for i in range(len(mu)):
            m_new = mu[i] @ t
            mt.append(m_new)

        # pre-compute the scaling term
        #
        scale = np.power(2 * np.pi, -ndim / 2)

        # loop over data
        #
        labels = []
        posteriors = []

        for j in range(len(data.data)):
            #print(data.data[j])

            # loop over number of classes
            #
            sample = data.data[j] @ t
            count =0
            #post = np.zeros((1, num_classes))
            post =[]
            for k in range(num_classes):

                # manually compute the log likelihood
                # as a weighted Euclidean distance
                #
                # mean of class k
                #
                prior =  model[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_PRIOR][k]

                # mean of class k
                #
                #m = model[PCA_MDL_KEY_MODEL][PCA_MDL_KEY_MEANS][k]
                m = mt[k]

                # posterior calculation for sample j
                #
                # @: short-hand notation for matrix multiplication
                #
                g1 = (sample - m).T @ (sample - m)
                g2 = np.exp(-1/2 * g1)
                g = g2 * scale * prior
                count = count + g

                #post[0,k] +=g
                post.append(g)

            post = post/count


            # choose the class label with the highest posterior
            #
            labels.append(np.argmax(post))

            # save the posteriors
            #
            posteriors.append(post)

        # exit gracefully
        #
        return labels, posteriors
    #
    # end of method
#
# end of PCA

class QDA:
    """
    Class: QDA

    arguments:
     none

    description:
     This is a class that implements Quadratic Components Analysis (QDA). This
     is also known as class-dependent PCA.
    """

    #--------------------------------------------------------------------------
    #
    # constructors/destructors/etc.
    #
    #--------------------------------------------------------------------------

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        QDA.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict(dict)

        # initialize a parameter dictionary
        #
        self.params_d[QDA_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[QDA_PRM_KEY_PARAM] = defaultdict(dict)

        # set the names
        #
        self.model_d[QDA_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[QDA_MDL_KEY_MODEL] = defaultdict(dict)
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary containing the model (data dependent)
         score: a float value containing a measure of the goodness of fit

        description:
         QDA is implemented as class dependent PCA.
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))


        data = data.sort()
        uni_label = np.unique(data.labels)
        new_data =[]
        for i in range(len(uni_label)):
            class_data =[]

            for j in range(len(data.labels)):
                if uni_label[i]==data.labels[j]:
                    class_data.append(data.data[j])

            new_data.append(np.array(class_data))

        ndim = new_data[0].shape[1]

        num_classes = len(new_data)

        # number of components
        #
        n_comp= int(self.params_d[QDA_PRM_KEY_PARAM][QDA_PRM_KEY_COMP])
        if not(0 < n_comp <= new_data[0].shape[1]):
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "features out of range"))
            self.model_d[QDA_MDL_KEY_MODEL].clear()
            return None, None

        # calculate number of classes
        #

        # calculate number of data points
        #
        npts = 0
        for element in new_data:
            npts += len(element)

        # initialize an empty array to save the priors
        #
        priors = np.empty((0,0))

        # case: (ml) equal priors
        #
        mode_prior = self.params_d[QDA_PRM_KEY_PARAM][QDA_PRM_KEY_PRIOR]
        if mode_prior == ALG_PRIORS_ML:

            # save priors for each class
            #
            self.model_d[QDA_MDL_KEY_MODEL][QDA_MDL_KEY_PRIOR] = \
                np.full(shape = num_classes,
                        fill_value = (float(1.0) / float(num_classes)))

        # if the priors are based on occurrences : nct.PRIORs_MAP
        #
        elif mode_prior == ALG_PRIORS_MAP:

            # create an array of priors by finding the the number of points
            # in each class and dividing by the total number of samples
            #
            for element in new_data:

                # appending the number of samples in
                # each element(class) to empty array
                #
                priors = np.append(priors, len(element))

            # final calculation of priors
            #
            sum = float(1.0) / float(npts)
            self.model_d[QDA_MDL_KEY_MODEL][QDA_MDL_KEY_PRIOR] = priors * sum

        else:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "unknown value for priors"))
            self.model_d[QDA_MDL_KEY_MODEL].clear()
            return None, None

        # calculate the means of each class:
        #  note these are a list of numpy vectors
        #
        means = []
        for elem in new_data:
            means.append(np.mean(elem, axis = 0))
        self.model_d[QDA_MDL_KEY_MODEL][QDA_MDL_KEY_MEANS] = means

        # calculate the cov:
        #  note this is a list of matrices, and each matrix for a class
        #
        # an empty list to save covariances
        #
        t = []

        # loop over classes to calculate covariance of each class
        #
        for i,element in enumerate(new_data):


            covar = nct.compute(element,
                ctype= self.params_d[QDA_PRM_KEY_PARAM][QDA_PRM_KEY_CTYPE],
                center= self.params_d[QDA_PRM_KEY_PARAM][QDA_PRM_KEY_CENTER],
                scale= self.params_d[QDA_PRM_KEY_PARAM][QDA_PRM_KEY_SCALE])

            # eigen vector and eigen value decomposition
            # for each class
            #
            eigvals, eigvecs = np.linalg.eig(covar)

            # sorted eigenvals and eigvecs and choose
            # the first l-1 columns from eigenvals
            # and eigenvecs
            #
            sorted_indexes = eigvals.argsort () [::-1]
            eigvals = eigvals[sorted_indexes[0:n_comp]]
            eigvecs = eigvecs[:,sorted_indexes[0:n_comp]]
            if any(eigvals < 0):
                print("Error: %s (line: %s) %s: %s" %
                    (__FILE__, ndt.__LINE__, ndt.__NAME__,
                    "negative eigenvalues"))
                self.model_d[QDA_MDL_KEY_MODEL].clear()
                return None, None

            try:
                eigvals_in = np.linalg.inv(np.diag(eigvals**(1/2)))

            except np.linalg.LinAlgError as e:
                print("Error: %s (line: %s) %s: %s" %
                    (__FILE__, ndt.__LINE__, ndt.__NAME__,
                    "singular matrix model is none"))
                self.model_d[QDA_MDL_KEY_MODEL].clear()
                return None, None

            # calculation of transformation matrix
            #
            trans = eigvecs @ eigvals_in
            t.append(trans)

        self.model_d[QDA_MDL_KEY_MODEL][QDA_MDL_KEY_TRANS] = t

        # compute a goodness of fit measure: use the average weighted
        # mean-square-error computed across the entire data set
        #
        transf = np.identity(new_data[0].shape[1])
        gsum = float(0.0)
        for i, d in enumerate(new_data):

            # iterate over the data in class i and calculate the norms
            #
            sum = float(0.0)
            for v in d:
                sum += np.linalg.norm(transf*(v - means[i]))

            # weight by the prior
            #
            gsum += self.model_d[QDA_MDL_KEY_MODEL][QDA_MDL_KEY_PRIOR][i] * \
                sum
        score = gsum / float(npts)

        # exit gracefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a list of numpy float matrices of feature vectors
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels
         posteriors: a list of float numpy vectors with the posterior
         probabilities for each class

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d

        # check for model validity
        #
        if model[QDA_MDL_KEY_NAME] != QDA_NAME:
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "incorrect model name"))
            return None, None

        if not model[QDA_MDL_KEY_MODEL]:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "model parameter is empty"))
            return None, None

        # get the number of features
        #

        ndim = data.data.shape[1]

        # transform data and mean to new space
        #
        t =  model[QDA_MDL_KEY_MODEL][QDA_MDL_KEY_TRANS]
        mu = model[QDA_MDL_KEY_MODEL][QDA_MDL_KEY_MEANS]

        # calculate number of classes
        #
        mt = []
        num_classes = len(mu)
        for i in range(len(mu)):
            m_new = mu[i] @ t[i]
            mt.append(m_new)

        # precompute the scaling term
        #
        scale = np.power(2 * np.pi, -ndim / 2)

        # loop over data
        #
        labels = []
        posteriors = []

        # loop over each matrix in data
        #
        for j in range(len(data.data)):

            count = 0
            #post = np.zeros((1, num_classes))
            post =[]
            #dist=[]

            # loop over number of classes
            #
            for k in range(num_classes):
                sample = data.data[j] @ t[k]

                # manually compute the log likelihood
                # as a weighted Euclidean distance
                #
                # priors of class k
                #
                prior =  model[QDA_MDL_KEY_MODEL][QDA_MDL_KEY_PRIOR][k]

                # mean of class k
                #
                #m = model[QDA_MDL_KEY_MODEL][QDA_MDL_KEY_MEANS][k]
                m = mt[k]

                # posterior calculation for sample j
                #
                # @ : short-hand notation for matrix multiplication
                #

                g1 = (sample - m).T @ (sample-m)
                #g1 = (sample - m).T @ inv_cov @ (sample-m)
                g2 = np.exp(-1/2 * g1)
                g = g2 * scale * prior
                #dist.append(g2*prior)
                #g =
                count = count + g
                #post[0,k] += g
                post.append(g)

            post = post/count

            # choose the class label with the highest posterior
            #
            labels.append(np.argmax(post))
            #labels.append(np.argmin(np.array(dist))

            # save the posteriors
            #
            posteriors.append(post)

        # exit gracefully
        #
        return labels, posteriors
    #
    # end of method
#
# end of QDA

#------------------------------------------------------------------------------
class LDA:
    """
    Class: LDA

    description:
     This is a class that implements class_independent Linear Discriminant
     Analysis (LDA).
    """

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        LDA.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict(dict)

        # initialize a parameter dictionary
        #
        self.params_d[LDA_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[LDA_PRM_KEY_PARAM] = defaultdict(dict)

        # set the names
        #
        self.model_d[LDA_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[LDA_MDL_KEY_MODEL] = defaultdict(dict)
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: as a dictionary of priors, means and covariance
         score: a float value containing a measure of the goodness of fit

        description:
         LDA is implemented using this link :
         https://usir.salford.ac.uk/id/eprint/52074/1/AI_Com_LDA_Tarek.pdf
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # calculate number of classes
        #
        data = data.sort()
        uni_label = np.unique(data.labels)
        new_data =[]

        for i in range(len(uni_label)):

            class_data =[]

            for j in range(len(data.labels)):

                if uni_label[i]==data.labels[j]:
                    class_data.append(data.data[j])

            new_data.append(np.array(class_data))

        num_classes = len(new_data)

        # calculate number of data points
        #
        npts = 0
        for element in new_data:
            npts += len(element)

        # initialize an empty array to save the priors
        #
        priors = np.empty((0,0))

        # case: (ml) equal priors
        #
        mode_prior = self.params_d[LDA_PRM_KEY_PARAM][LDA_PRM_KEY_PRIOR]
        if mode_prior == ALG_PRIORS_ML:

            # compute the priors for each class
            #
            priors = np.full(shape = num_classes,
                            fill_value = (float(1.0) / float(num_classes)))
            self.model_d[LDA_MDL_KEY_MODEL][LDA_MDL_KEY_PRIOR] = priors

        # if the priors are based on occurrences
        #
        elif mode_prior == ALG_PRIORS_MAP:

            # create an array of priors by finding the the number of points
            # in each class and dividing by the total number of samples
            #
            for element in new_data:

                # appending the number of samples in
                # each element(class) to empty array
                #
                priors = np.append(priors, len(element))

            # final calculation of priors
            #
            sum = float(1.0) / float(npts)
            priors = priors * sum
            self.model_d[LDA_MDL_KEY_MODEL][LDA_MDL_KEY_PRIOR] = priors

        else:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "unknown value for priors"))
            self.model_d[LDA_MDL_KEY_MODEL].clear()
            return None, None

        # calculate the means of each class:
        # note these are a list of numpy vectors
        #
        means = []
        for elem in new_data:
            means.append(np.mean(elem, axis = 0))
        self.model_d[LDA_MDL_KEY_MODEL][LDA_MDL_KEY_MEANS] = means

        # calculate the global mean
        #
        mean_glob = np.mean(np.vstack(new_data), axis = 0)

        # calculate s_b and s_w.
        # we need to calculate them for the transformation matrix
        #
        n_features = new_data[0].shape[1]

        # initialize within class scatter
        #
        sw = np.zeros((n_features, n_features))

        # initialize between class scatter
        #
        sb = np.zeros((n_features, n_features))

        # within class scatter calculation
        #
        for i, d in enumerate(new_data):

            # calculation of within class scatter
            #
            sw += priors[i]*nct.compute(d, \
            ctype = self.params_d[LDA_PRM_KEY_PARAM][LDA_PRM_KEY_CTYPE],
            center= self.params_d[LDA_PRM_KEY_PARAM][LDA_PRM_KEY_CENTER],
            scale= self.params_d[LDA_PRM_KEY_PARAM][LDA_PRM_KEY_SCALE])

            # between class scatter calculation
            #
            mean_diff = (means[i] - mean_glob)
            sb += priors[i] * (mean_diff).dot(mean_diff.T)

        try:
            sw_in = np.linalg.inv(sw)

        except np.linalg.LinAlgError:

            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "singular matrix"))
            self.model_d[LDA_MDL_KEY_MODEL].clear()

            return None, None

        # calculation of sw^-1*sb
        #
        j = sw_in.dot(sb)
        try:
            j_inv = np.linalg.inv(j)
        except np.linalg.LinAlgError:

            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "singular matrix"))
            self.model_d[LDA_MDL_KEY_MODEL].clear()

            return None, None

        # number of the eigenvectorss need to be chosen
        # it is equal to the num_class minus 1
        #
        l = (len(new_data))-1

        # eigen vector and eigen value decomposition
        #
        eigvals, eigvecs = np.linalg.eig(j)

        # sorted eigenvals and eigvecs and choose
        # the first l-1 columns from eigenvals
        # and eigenvecs
        #
        sorted_indexes = eigvals.argsort()[::-1]
        eigvals = eigvals[sorted_indexes[0:l]]
        eigvecs = eigvecs[:,sorted_indexes[0:l]]
        if any(eigvals < 0):
                print("Error: %s (line: %s) %s: %s" %
                    (__FILE__, ndt.__LINE__, ndt.__NAME__,
                    "negative eigenvalues"))
                self.model_d[LDA_MDL_KEY_MODEL].clear()
                return None, None

        try:
            eigval_in = np.linalg.inv(np.diag(eigvals**(1/2)))

        except np.linalg.LinAlgError:

            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "singular matrix model is none"))

            self.model_d[LDA_MDL_KEY_MODEL].clear()

            return None, None

        # calculation of the transformation matrix
        #
        t = eigvecs @ eigval_in
        self.model_d[LDA_MDL_KEY_MODEL][LDA_MDL_KEY_TRANS] = t

        # compute a transformation matrix for LDA
        #
        transf = np.identity(new_data[0].shape[1])

        gsum = float(0.0)
        for i, d in enumerate(new_data):

            # iterate over the data in class i and calculate the norms
            #
            _sum = float(0.0)
            for v in d:
                _sum += np.linalg.norm(transf * (v - means[i]))

            # weight by the prior
            #
            gsum += self.model_d[LDA_MDL_KEY_MODEL][LDA_MDL_KEY_PRIOR][i] * \
                _sum

        score = gsum / float(npts)

        # exit gracefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a numpy float matrix of feature vectors (each row is a vector)
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels
         posteriors: a list of float numpy vectors with the posterior
         probabilities for each class

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d

        # check for model validity
        #
        if model[LDA_MDL_KEY_NAME] != LDA_NAME:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "incorrect model name"))
            return None, None

        if not model[LDA_MDL_KEY_MODEL]:
            print("Error: %s (line: %s) %s: %s" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__,
                   "model parameter is empty"))
            return None, None

        # get the number of classes and number of features
        #

        ndim = data.data.shape[1]

        # transform data to new environment
        #
        t =  model[LDA_MDL_KEY_MODEL][LDA_MDL_KEY_TRANS]
        mu = model[LDA_MDL_KEY_MODEL][LDA_MDL_KEY_MEANS]
        num_classes = len(mu)
        mt = []
        for i in range(len(mu)):
            m_new = mu[i] @ t
            mt.append(m_new)

        # pre-compute the scaling term
        #
        scale = np.power(2 * np.pi, -ndim / 2)

        # loop over data
        #
        labels = []
        posteriors = []

        # loop over each matrix in data
        #
        for j in range(len(data.data)):

            d = data.data[j]
            d = d @ t
            count = 0
            post = np.zeros((1, num_classes))

            # loop over number of classes
            #
            for k in range(num_classes):

                # manually compute the log likelihood
                # as a weighted Euclidean distance
                #
                # mean of class k
                #
                prior =  model[LDA_MDL_KEY_MODEL][LDA_MDL_KEY_PRIOR][k]

                # mean of class k
                #
                #m = model[LDA_MDL_KEY_MODEL][LDA_MDL_KEY_MEANS][k]
                m = mt[k]

                # posterior calculation for sample j
                #
                # @: short-hand notation for matrix multiplication
                #
                #
                g1 = (d - m).T @ (d - m)
                g2 = np.exp(-1/2 * g1)
                g = g2 * scale * prior
                count = count + g
                post[0,k] +=g
            post = post/count

            # choose the class label with the highest posterior
            #
            labels.append(np.argmax(post))

            # save the posteriors
            #
            posteriors.append(post)

        # exit gracefully
        #
        return labels, posteriors
    #
    # end of method
#
# end of LDA

#------------------------------------------------------------------------------
class QLDA:
    """
    Class: QLDA

    description:
     This is a class that implements class_dependent
     Linear Discriminant Analysis (QLDA).
    """

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        QLDA.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict(dict)

        # initialize a parameter dictionary
        #
        self.params_d[QLDA_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[QLDA_PRM_KEY_PARAM] = defaultdict(dict)

        # set the names
        #
        self.model_d[QLDA_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[QLDA_MDL_KEY_MODEL] = defaultdict(dict)
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary of covariance, means and priors
         score: f1 score

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # calculate number of classes
        #
        data = data.sort()
        uni_label = np.unique(data.labels)
        new_data =[]

        for i in range(len(uni_label)):

            class_data =[]

            for j in range(len(data.labels)):

                if uni_label[i]==data.labels[j]:
                    class_data.append(data.data[j])

            new_data.append(np.array(class_data))

        num_classes = len(new_data)

        # calculate number of data points
        #
        npts = 0
        for element in new_data:
            npts += len(element)

        # initialize an empty array to save the priors
        #
        priors = np.empty((0,0))

        # case: (ml) equal priors
        #
        mode_prior = self.params_d[QLDA_PRM_KEY_PARAM][QLDA_PRM_KEY_PRIOR]
        if mode_prior == ALG_PRIORS_ML:

            # compute the priors for each class
            #
            priors = np.full(shape = num_classes,
                        fill_value = (float(1.0) / float(num_classes)))
            self.model_d[QLDA_MDL_KEY_MODEL][QLDA_MDL_KEY_PRIOR] = priors

        # if the priors are based on occurrences
        #
        elif mode_prior == ALG_PRIORS_MAP:

            # create an array of priors by finding the the number of points
            # in each class and dividing by the total number of samples
            #
            for element in new_data:

                # appending the number of samples in
                # each element(class) to empty array
                #
                priors = np.append(priors, len(element))

            # final calculation of priors
            #
            sum = float(1.0) / float(npts)
            priors = priors * sum
            self.model_d[QLDA_MDL_KEY_MODEL][QLDA_MDL_KEY_PRIOR] = priors

        else:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "unknown value for priors"))
            self.model_d[QLDA_MDL_KEY_MODEL].clear()
            return None, None

        # calculate the means of each class:
        # note these are a list of numpy vectors
        #
        means = []
        for elem in new_data:
            means.append(np.mean(elem, axis = 0))
        self.model_d[QLDA_MDL_KEY_MODEL][QLDA_MDL_KEY_MEANS] = means

        # calculate the global mean
        #
        mean_glob = np.mean(np.vstack(new_data), axis = 0)

        # calculate s_b and s_w.
        # we need to calculate them for the transformation matrix
        #
        n_features = new_data[0].shape[1]

        # number of the eigenvectors need to be chosen
        # it is equal to the num_class minus 1
        #
        l = (len(new_data)) - 1

        t = []

        # initialize between class scatter
        #
        sb = np.zeros((n_features, n_features))

        for i in range(len(new_data)):

            # between class scatter calculation
            #
            mean_diff = (means[i] - mean_glob).reshape(n_features, 1)
            sb += len(new_data)*(mean_diff).dot(mean_diff.T)

        # within class scatter and final covariance for each class
        #
        for i,d in enumerate(new_data):

            # calculation of within class scatter for each class
            #
            sw = priors[i] * nct.compute(d, \
            ctype = self.params_d[QLDA_PRM_KEY_PARAM][QLDA_PRM_KEY_CTYPE],
            center= self.params_d[QLDA_PRM_KEY_PARAM][QLDA_PRM_KEY_CENTER],
            scale= self.params_d[QLDA_PRM_KEY_PARAM][QLDA_PRM_KEY_SCALE])

            # check singularity
            #
            try:
                sw_in = np.linalg.inv(sw)

            except np.linalg.LinAlgError:
                print("Error: %s (line: %s) %s: %s" %
                      (__FILE__, ndt.__LINE__, ndt.__NAME__,
                       "singular matrix"))
                self.model_d[QLDA_MDL_KEY_MODEL].clear()

                return None, None

            # calculation of sw^-1*sb for each class
            #
            j = sw_in.dot(sb)

            try:
                j_inv = np.linalg.inv(j)
            except np.linalg.LinAlgError:
                print("Error: %s (line: %s) %s: %s" %
                      (__FILE__, ndt.__LINE__, ndt.__NAME__,
                       "singular matrix"))
                self.model_d[LDA_MDL_KEY_MODEL].clear()

                return None, None

            # eigen vector and eigen value decomposition
            # for each class
            #
            eigvals, eigvecs = np.linalg.eig(j)

            # sorted eigenvals and eigvecs and choose
            # the first l-1 columns from eigenvals
            # and eigenvecs
            #
            sorted_indexes = eigvals.argsort () [::-1]
            eigvals = eigvals[sorted_indexes[0:l]]
            eigvecs = eigvecs[:,sorted_indexes[0:l]]
            if any(eigvals < 0):
                print("Error: %s (line: %s) %s: %s" %
                    (__FILE__, ndt.__LINE__, ndt.__NAME__,
                    "negative eigenvalues"))
                self.model_d[QLDA_MDL_KEY_MODEL].clear()
                return None, None

            try:
                eigvals_in = np.linalg.inv(np.diag(eigvals**(1/2)))
                det = np.linalg.det(np.diag(eigvals**(1/2)))

            except np.linalg.LinAlgError:
                print("Error: %s (line: %s) %s: %s" %
                    (__FILE__, ndt.__LINE__, ndt.__NAME__,
                    "singular matrix model is none"))
                self.model_d[QLDA_MDL_KEY_MODEL].clear()
                return None, None

            # calculation of transformation matrix
            #
            trans = eigvecs @ eigvals_in
            t.append(trans)

        self.model_d[QLDA_MDL_KEY_MODEL][QLDA_MDL_KEY_TRANS] = t

        transf = np.identity(new_data[0].shape[1])
        gsum = float(0.0)
        for i, d in enumerate(new_data):

            # iterate over the data in class i and calculate the norms
            #
            sum = float(0.0)
            for v in d:
                sum += np.linalg.norm(transf*(v - means[i]))

            # weight by the prior
            gsum += self.model_d[QLDA_MDL_KEY_MODEL][QLDA_MDL_KEY_PRIOR][i] * \
                sum
        score = gsum / float(npts)

        # exit gracefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a list of numpy float matrices of feature vectors
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels
         posteriors: a list of float numpy vectors with the posterior
         probabilities for each class

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d

        # check for model validity
        #
        if model[QLDA_MDL_KEY_NAME] != QLDA_NAME:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "incorrect model name"))
            return None, None

        if not model[QLDA_MDL_KEY_MODEL]:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "model parameter is empty"))
            return None, None

        # get the number of features
        #

        ndim = data.data.shape[1]

        # transform data and mean to new space
        #
        t =  model[QLDA_MDL_KEY_MODEL][QLDA_MDL_KEY_TRANS]
        mu = model[QLDA_MDL_KEY_MODEL][QLDA_MDL_KEY_MEANS]

        # get the number of classes
        #
        mt = []
        num_classes = len(mu)
        for i in range(len(mu)):
            #mu[i]= mu[i] @ t[i]
            m_new = mu[i]@t[i]
            mt.append(m_new)



        # precompute the scaling term
        #
        scale = np.power(2 * np.pi, -ndim / 2)

        # loop over data
        #
        labels = []
        posteriors = []

        # loop over each matrix in data
        #
        for j in range(len(data.data)):

            count = 0
            post = np.zeros((1, num_classes))
            d = data.data[j]

            # loop over number of classes
            #
            for k in range(num_classes):

                sample = d @ t[k]

                # manually compute the log likelihood
                # as a weighted Euclidean distance
                #
                # priors of class k
                #
                prior =  model[QLDA_MDL_KEY_MODEL][QLDA_MDL_KEY_PRIOR][k]

                # mean of class k
                #
                #m = model[QLDA_MDL_KEY_MODEL][QLDA_MDL_KEY_MEANS][k]
                m = mt[k]

                # posterior calculation for sample j
                #
                # @ : short-hand notation for matrix multiplication
                #
                g1 = (d - m).T @ (d - m)
                g2 = np.exp(-1/2 * g1)
                g = g2 * scale * prior
                count = count + g
                post[0,k] += g

            post = post/count

            # choose the class label with the highest posterior
            #
            #
            labels.append(np.argmax(post))


            # save the posteriors
            #

            posteriors.append(post)

        # exit gracefully
        #
        #print('labels',labels)
        return labels, posteriors
    #
    # end of method
#
# end of QLDA

#------------------------------------------------------------------------------
class NB:
    """
    Class: NB

    description:
     This is a class that implements Naive Bayes (NB).
    """

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        NB.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict()

        # initialize a parameter dictionary
        #
        self.params_d[NB_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[NB_PRM_KEY_PARAM] = defaultdict(dict)

        # set the model
        #
        self.model_d[NB_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[NB_MDL_KEY_MODEL] = GaussianNB()
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary of covariance, means and priors
         score: f1 score

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # calculate number of classes
        #
        data = data.sort()
        #print(data)
        uni_label = np.unique(data.labels)
        new_data =[]
        for i in range(len(uni_label)):
            class_data =[]
            for j in range(len(data.labels)):
                if uni_label[i]==data.labels[j]:
                    class_data.append(data.data[j])
            new_data.append(np.array(class_data))
        #print(new_data)
        num_classes = len(new_data)

        # calculate number of data points
        #
        npts = 0
        for element in new_data:
            npts += len(element)

        # case: (ml) equal priors
        #
        mode_prior = self.params_d[NB_PRM_KEY_PARAM][NB_PRM_KEY_PRIOR]
        if mode_prior == ALG_PRIORS_ML:

            # compute the priors for each class
            #
            priors = np.full(shape = num_classes,
                            fill_value = (float(1.0) / float(num_classes)))

        # if the priors are based on occurrences
        #
        elif mode_prior == ALG_PRIORS_MAP:

            # create an array of priors by finding the the number of points
            # in each class and dividing by the total number of samples
            #
            for element in new_data:

                # appending the number of samples in
                # each element(class) to empty array
                #
                priors = np.append(priors, len(element))

            # final calculation of priors
            #
            sum = float(1.0) / float(npts)
            priors = priors * sum

        else:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "unknown value for priors"))
            return None

        # make the final data
        #
        f_data = np.vstack((new_data))

        # getting the labels
        #
        labels = []
        for i in range(len(new_data)):
            for j in range(len(new_data[i])):
                labels.append(i)
        labels = np.array(labels)

        # fit the model
        #
        self.model_d[NB_MDL_KEY_MODEL] = GaussianNB(priors = priors).fit(f_data, labels)

        # prediction
        #
        ypred = self.model_d[NB_MDL_KEY_MODEL].predict(f_data)

        # score calculation using auc ( f1 score f1_score(y_true, y_pred, average=None))
        #
        score = f1_score(labels, ypred, average="macro")

        # write to file
        #
        if write_train_labels:
            data.write(oname = fname_train_labels, label = ypred)

        # exit gracefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a numpy float matrix of feature vectors (each row is a vector)
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        data = np.array(data.data)
        if model is None:
            model = self.model_d

        p_labels = model[NB_MDL_KEY_MODEL].predict(data)

        # posterior calculation
        #
        posteriors = model[NB_MDL_KEY_MODEL].predict_proba(data)

        # exit gracefully
        #
        return p_labels, posteriors
    #
    # end of method
#
# end of NB

class EUCLIDEAN:
    """
    Class: Euclidean

    description:
     this is a class that implements Euclidean Distance
    """

    def __init__(self) -> None:
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """
        # set the class name
        #
        EUCLIDEAN.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict()

        # initialize a parameter dictionary
        #
        self.params_d[EUCLIDEAN_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[EUCLIDEAN_PRM_KEY_PARAM] = defaultdict(dict)

        # set the model
        #
        self.model_d[EUCLIDEAN_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[EUCLIDEAN_MDL_KEY_MODEL] = defaultdict(dict)
    #
    # end of method

    def weightedDistance(self, p1, p2, w):
        """
        method: weightedDistance

        arguments:
          p1: point 1 (numpy array)
          p2: point 2 (numpy array)
           w: weight

        return:
            the weighted euclidean distance

        description:
            this function returns the weighted euclidean distance
        """
        q = p2 - p1
        return np.sqrt((w*q*q).sum())
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary containing the model (data dependent)
         score: a float value containing a measure of the goodness of fit

        description:
         none
        """
        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # get sorted_labels and sorted_samples
        #
        data = data.sort()
        group_data = data.group_by_class()

        # a list of mean for each class
        #
        means = []
        for d in group_data.values():
            means.append(np.mean(d, axis = 0))

        self.model_d[EUCLIDEAN_MDL_KEY_MODEL][EUCLIDEAN_MDL_KEY_MEANS] = means

        # get the weights
        #
        weights = self.params_d[EUCLIDEAN_PRM_KEY_PARAM][EUCLIDEAN_PRM_KEY_WEIGHTS]

        # scoring
        #
        acc = 0
        for true_label, d in zip(data.labels, data.data):

            diff_means = []

            for ind, mean in enumerate(means):
                diff_means.append(
                    self.weightedDistance(mean, d, float(weights[ind]))
                )

            train_label_ind = np.argmin(diff_means)
            if data.mapping_label[train_label_ind] == true_label:
                acc += 1

        score = acc / len(data.data)

        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d

        # check for model validity
        #
        if model[EUCLIDEAN_MDL_KEY_NAME] != EUCLIDEAN_NAME:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "incorrect model name"))
            return None, None

        if not model[EUCLIDEAN_MDL_KEY_MODEL]:
            print("Error: %s (line: %s) %s: %s" %
                (__FILE__, ndt.__LINE__, ndt.__NAME__,
                "model parameter is empty"))
            return None, None

        #data = data.sort()

        means = self.model_d[EUCLIDEAN_MDL_KEY_MODEL][EUCLIDEAN_MDL_KEY_MEANS]
        weights = self.params_d[EUCLIDEAN_PRM_KEY_PARAM][EUCLIDEAN_PRM_KEY_WEIGHTS]
        mapping_label = data.mapping_label

        labels = []
        posteriors = []

        for d in data.data:

            diff_means = []
            cur_posterios = []

            for ind, mean in enumerate(means):
                distance = self.weightedDistance(mean, d, float(weights[ind]))
                diff_means.append(distance)
                cur_posterios.append(distance)
            predict_label_ind = np.argmin(diff_means)
            labels.append(predict_label_ind)
            posteriors.append(cur_posterios)

        return labels, posteriors
    #
    # end of method
#
# end of EUCLIDEAN

class KNN:
    """
    Class: KNN

    description:
     This is a class that implements KNN
    """

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        KNN.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict()

        # initialize a parameter dictionary
        #
        self.params_d[KNN_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[KNN_PRM_KEY_PARAM] = defaultdict(dict)

        # set the model
        #
        self.model_d[KNN_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[KNN_MDL_KEY_MODEL] = KNeighborsClassifier()
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary of covariance, means and priors
         score: f1 score

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # making the final data
        #
        samples = np.array(data.data)

        # getting the labels
        #
        labels = np.array(data.labels)

        # fit the model
        #
        n = int(self.params_d[KNN_PRM_KEY_PARAM][KNN_PRM_KEY_NEIGHB])
        self.model_d[KNN_MDL_KEY_MODEL] = KNeighborsClassifier(n_neighbors = n).fit(samples, labels)

        # prediction
        #
        ypred = self.model_d[KNN_MDL_KEY_MODEL].predict(samples)

        # score calculation using auc ( f1 score )
        #
        score = f1_score(labels, ypred, average="macro")

        # write to file
        #
        if write_train_labels:
            data.write(oname = fname_train_labels, label = ypred)

        # exit gracefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a numpy float matrix of feature vectors (each row is a vector)
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d

        samples = np.array(data.data)

        p_labels = model[KNN_MDL_KEY_MODEL].predict(samples)

        # posterior calculation
        #
        posteriors = model[KNN_MDL_KEY_MODEL].predict_proba(samples)

        return p_labels, posteriors
    #
    # end of method

#------------------------------------------------------------------------------
class RNF:
    """
    Class: RNF

    description:
     This is a class that implements RNF
    """

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        RNF.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict()

        # initialize a parameter dictionary
        #
        self.params_d[RNF_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[RNF_PRM_KEY_PARAM] = defaultdict(dict)

        # set the model
        #
        self.model_d[RNF_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[RNF_MDL_KEY_MODEL] = RandomForestClassifier()
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary of covariance, means and priors
         score: f1 score

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # making the final data
        #
        samples = np.array(data.data)

        # getting the labels
        #
        labels = np.array(data.labels)

        # fit the model
        #
        n_estimators = int(self.params_d[RNF_PRM_KEY_PARAM][RNF_PRM_KEY_ESTIMATOR])
        max_depth = int(self.params_d[RNF_PRM_KEY_PARAM][RNF_PRM_KEY_MAXDEPTH])
        criterion = self.params_d[RNF_PRM_KEY_PARAM][RNF_PRM_KEY_CRITERION]
        random_state = int(self.params_d[RNF_PRM_KEY_PARAM][RNF_PRM_KEY_RANDOM])

        self.model_d[RNF_MDL_KEY_MODEL] = RandomForestClassifier(n_estimators = n_estimators,
                                              max_depth = max_depth,
                                              criterion = criterion,
                                              random_state= random_state).fit(samples, labels)

        # prediction
        #
        ypred = self.model_d[RNF_MDL_KEY_MODEL].predict(samples)

        # score calculation using auc ( f1 score f1_score(y_true, y_pred, average=None))
        #
        score = f1_score(labels, ypred, average="macro")

        # write to file
        #
        if write_train_labels:
            data.write(oname = fname_train_labels, label = ypred)


        # exit gracefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a numpy float matrix of feature vectors (each row is a vector)
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d

        samples = np.array(data.data)

        p_labels = model[RNF_MDL_KEY_MODEL].predict(samples)

        # posterior calculation
        #
        posteriors = model[RNF_MDL_KEY_MODEL].predict_proba(samples)

        # exit gracefully
        #
        return p_labels, posteriors
    #
    # end of method
#
# end of RNF

#------------------------------------------------------------------------------
class SVM:
    """
    Class: SVM

    description:
     This is a class that implements SVM
    """

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        SVM.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict()

        # initialize a parameter dictionary
        #
        self.params_d[SVM_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[SVM_PRM_KEY_PARAM] = defaultdict(dict)

        # set the model
        #
        self.model_d[SVM_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[SVM_MDL_KEY_MODEL] = SVC(probability = True)
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary of covariance, means and priors
         score: f1 score

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # making the final data
        #
        samples = np.array(data.data)

        # getting the labels
        #
        labels = np.array(data.labels)

        # fit the model
        #
        c = float(self.params_d[SVM_PRM_KEY_PARAM][SVM_PRM_KEY_C])
        gamma =float(self.params_d[SVM_PRM_KEY_PARAM][SVM_PRM_KEY_GAMMA])
        kernel = self.params_d[SVM_PRM_KEY_PARAM][SVM_PRM_KEY_KERNEL]

        self.model_d[SVM_MDL_KEY_MODEL] = SVC(C = c,
                        gamma = gamma,
                        kernel = kernel,
                        probability=True).fit(samples, labels)

        # prediction
        #
        ypred = self.model_d[SVM_MDL_KEY_MODEL].predict(samples)

        # score calculation using auc ( f1 score)
        #
        score = f1_score(labels, ypred, average="macro")

        if write_train_labels:
            data.write(oname = fname_train_labels, label = ypred)

        # exit gracefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a numpy float matrix of feature vectors (each row is a vector)
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d

        samples = np.array(data.data)

        p_labels = model[SVM_MDL_KEY_MODEL].predict(samples)

        # posterior calculation
        #
        posteriors = model[SVM_MDL_KEY_MODEL].predict_proba(samples)

        # exit gracefully
        #
        return p_labels, posteriors
    #
    # end of method
#
# end of SVM

#------------------------------------------------------------------------------
class KMEANS:
    """
    Class: KMEANS

    description:
     This is a class that implements KMEANS
    """

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        KMEANS.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict()

        # initialize a parameter dictionary
        #
        self.params_d[KMEANS_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[KMEANS_PRM_KEY_PARAM] = defaultdict(dict)

        # set the model
        #
        self.model_d[KMEANS_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[KMEANS_MDL_KEY_MODEL] = KMeans()
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary of covariance, means and priors
         score: silhouette score

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # making the final data
        #
        samples = np.array(data.data)

        # fit the model
        #
        n_cluster = int(self.params_d[KMEANS_PRM_KEY_PARAM][KMEANS_PRM_KEY_NCLUSTER])
        random_state =int(self.params_d[KMEANS_PRM_KEY_PARAM][KMEANS_PRM_KEY_RANDOM])
        n_init = int(self.params_d[KMEANS_PRM_KEY_PARAM][KMEANS_PRM_KEY_NINIT])
        m_iter = int(self.params_d[KMEANS_PRM_KEY_PARAM][KMEANS_PRM_KEY_MITER])

        self.model_d[KMEANS_MDL_KEY_MODEL] = KMeans(n_clusters=n_cluster,
        random_state = random_state,
        n_init = n_init,
        max_iter = m_iter).fit(samples)

        predicted_labels = self.model_d[KMEANS_MDL_KEY_MODEL].labels_

        score = silhouette_score(samples, predicted_labels)

        if write_train_labels:
            data.write(oname = fname_train_labels, label = predicted_labels)

        # exit gracefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a numpy float matrix of feature vectors (each row is a vector)
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d
        posteriors = []

        data = np.array(data.data)

        p_labels = model[KMEANS_MDL_KEY_MODEL].predict(data)

        # cluster centers
        #
        centers = model[KMEANS_MDL_KEY_MODEL].cluster_centers_

        # posteriors calculation
        #
        for d in data:
            dis_c = []
            count = 0
            for c in centers:
                dis = np.linalg.norm(d - c)
                dis_c.append(dis)
                count = count + dis
            posteriors.append(dis_c/count)

        # exit gracefully
        #
        return p_labels, posteriors
    #
    # end of method
#
# end of KMEANS

#------------------------------------------------------------------------------
class MLP:
    """
    Class: MLP

    description:
     This is a class that implements MLP
    """

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        MLP.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        #self.prior = np.empty((0,0))
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict()

        # initialize a parameter dictionary
        #
        self.params_d[MLP_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[MLP_PRM_KEY_PARAM] = defaultdict(dict)

        # set the model
        #
        self.model_d[MLP_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[MLP_MDL_KEY_MODEL] = MLPClassifier()
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary of covariance, means and priors
         score: f1 score

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # making the final data
        #
        samples = np.array(data.data)

        # getting the labels
        #
        labels = np.array(data.labels)

        # fit the model
        #
        h_s = int(self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_HSIZE])
        act = self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_ACT]
        b_s = self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_BSIZE]
        sol = self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_SOLVER]
        lr = self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_LR]
        lr_init = float(self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_LRINIT])
        e_stop = bool(self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_STOP])
        sh = bool(self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_SHUFFLE])
        val= float(self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_VAL])
        m = float(self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_MOMENTUM])
        r_state = int(self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_RANDOM])
        m_iter = int(self.params_d[MLP_PRM_KEY_PARAM][MLP_PRM_KEY_MITER])

        self.model_d[MLP_MDL_KEY_MODEL] = MLPClassifier(hidden_layer_sizes = (h_s,),
                                     activation = act,
                                     solver = sol,
                                     batch_size = b_s,
                                     learning_rate = lr,
                                     learning_rate_init = lr_init,
                                     shuffle = sh,
                                     random_state = r_state,
                                     momentum = m,
                                     early_stopping = e_stop,
                                     validation_fraction=val,
                                     max_iter=m_iter).fit(samples, labels)

        # prediction
        #
        ypred = self.model_d[MLP_MDL_KEY_MODEL].predict(samples)

        # score calculation using auc ( f1 score )
        #
        score = f1_score(labels, ypred, average="macro")

        if write_train_labels:
            data.write(oname = fname_train_labels, label = ypred)

        # exit graecefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a numpy float matrix of feature vectors (each row is a vector)
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d

        samples = np.array(data.data)

        p_labels = model[MLP_MDL_KEY_MODEL].predict(samples)

        # posterior calculation
        #
        posteriors = model[MLP_MDL_KEY_MODEL].predict_proba(samples)

        # exit gracefully
        #
        return p_labels, posteriors
    #
    # end of method

#
# end of MLP

class RBM:
    """
    Class: RBM

    description:
     This is a class that implements RBM
    """

    def __init__(self):
        """
        method: constructor

        arguments:
         none

        return:
         none

        description:
         this is the default constructor for the class.
        """

        # set the class name
        #
        RBM.__CLASS_NAME__ = self.__class__.__name__

        # initialize variables for the parameter block and model
        #
        self.params_d = defaultdict(dict)
        self.model_d = defaultdict()

        # initialize a parameter dictionary
        #
        self.params_d[RBM_PRM_KEY_NAME] = self.__class__.__name__
        self.params_d[RBM_PRM_KEY_PARAM] = defaultdict(dict)

        # set the model
        #
        self.model_d[RBM_MDL_KEY_NAME] = self.__class__.__name__
        self.model_d[RBM_MDL_KEY_MODEL] = []
    #
    # end of method

    #--------------------------------------------------------------------------
    #
    # computational methods: train/predict
    #
    #--------------------------------------------------------------------------

    def train(self,
              data: MLToolData,
              write_train_labels: bool,
              fname_train_labels: str,
              ):
        """
        method: train

        arguments:
         data: a list of numpy float matrices of feature vectors
         write_train_labels: a boolean to wehther write the train data
         fname_train_labels: the filename of the train file

        return:
         model: a dictionary of covariance, means and priors
         score: f1 score

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: training a model" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # making the final data
        #
        samples = np.array(data.data)

        # getting the labels
        #
        labels = np.array(data.labels)

        # fit the model
        #
        n_comp = int(self.params_d[RBM_PRM_KEY_PARAM][RBM_PRM_KEY_COMP])
        n_iter = int(self.params_d[RBM_PRM_KEY_PARAM][RBM_PRM_KEY_NITER])
        random_state = int(self.params_d[RBM_PRM_KEY_PARAM][RBM_PRM_KEY_RANDOM])
        lr = float(self.params_d[RBM_PRM_KEY_PARAM][RBM_PRM_KEY_LR])
        b_size = int(self.params_d[RBM_PRM_KEY_PARAM][RBM_PRM_KEY_BSIZE])
        verbose = bool(self.params_d[RBM_PRM_KEY_PARAM][RBM_PRM_KEY_VERBOSE])
        #logistic = linear_model.LogisticRegression(solver="newton-cg", tol=1)
        classifier = str(self.params_d[RBM_PRM_KEY_PARAM][RBM_PRM_KEY_CLASSIF])
        rbm= BernoulliRBM(n_components=n_comp, learning_rate=lr,
                          batch_size=b_size, n_iter=n_iter,
                          verbose=verbose, random_state=random_state)

        #if classifier not in ALGS:
            #return None

        self.model_d[RBM_MDL_KEY_MODEL]= Pipeline(steps=[('rbm', rbm), ('classifier', ALGS[classifier].model_d[ALG_MDL_KEY_MODEL])]).fit(samples, labels)

        # prediction
        #
        ypred = self.model_d[RBM_MDL_KEY_MODEL].predict(samples)

        # score calculation using auc ( f1 score )
        #
        score = f1_score(labels, ypred, average="macro")

        # write to file
        #
        if write_train_labels:
            data.write(oname = fname_train_labels, label = ypred)

        # exit gracefully
        #
        return self.model_d, score
    #
    # end of method

    def predict(self,
                data: MLToolData,
                model = None):
        """
        method: predict

        arguments:
         data: a numpy float matrix of feature vectors (each row is a vector)
         model: an algorithm model (None = use the internal model)

        return:
         labels: a list of predicted labels

        description:
         none
        """

        # display an informational message
        #
        if dbgl_g == ndt.FULL:
            print("%s (line: %s) %s: entering predict" %
                  (__FILE__, ndt.__LINE__, ndt.__NAME__))

        # check if model is none
        #
        if model is None:
            model = self.model_d

        samples = np.array(data.data)

        p_labels = model[RBM_MDL_KEY_MODEL].predict(samples)

        # posterior calculation
        #
        posteriors = model[RBM_MDL_KEY_MODEL].predict_proba(samples)

        return p_labels, posteriors
    #
    # end of method

#------------------------------------------------------------------------------



#------------------------------------------------------------------------------
#
# definitions dependent on the above classes go here
#
#------------------------------------------------------------------------------

# define variables to configure the machine learning algorithms
#
ALGS = {PCA_NAME: PCA(), LDA_NAME:LDA(), QDA_NAME:QDA(),
        QLDA_NAME: QLDA(), NB_NAME:NB(), KNN_NAME:KNN(),
        RNF_NAME:RNF(), SVM_NAME:SVM(), KMEANS_NAME:KMEANS(),
        MLP_NAME:MLP(), EUCLIDEAN_NAME: EUCLIDEAN(), RBM_NAME:RBM()}
#
# end of file



