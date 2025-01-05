# Backend Directory - File Overview

This directory contains the backend files and logic for the project. Below is an explanation of each file and folder to help understand their roles within the backend system.

## File/Folders Structure
- **app/backend/**
  - **callback.py**
  - **imld_alg_params.json**
  - **imld_data_params.json**
  - **nedc_cov_tools.py**
  - **nedc_debug_tools.py**
  - **nedc_file_tools.py**
  - **nedc_imld_tools.py**
  - **nedc_ml_tools_data.py**
  - **nedc_ml_tools.py**

### **callback.py**
Contains the logic for the callback statement, which is used for exposing backend elements within ML Tools to the frontend through the use of the app's web socket instance. The callback function is used for various elements such as providing information for both the process log and progress bars.

### **imld_alg_params.json**
Defines the algorithms and parameters of the selected machine learning algorithms for the IMLD application in JSON format for ease of use.

### **imld_data_params.json**
Defines the selected shapes and parameters for the data generation feature for the IMLD application in JSON format for ease of use.

### **nedc_cov_tools.py**
Contains the various implementations for computing a covariance matrix used within the NEDC environment.

### **nedc_debug_tools.py**
Contains the utility functions for debugging operations used within the NEDC environment.

### **nedc_file_tools.py**
Contains the utility functions for handling file operations used within the NEDC environment.

### **nedc_imld_tools.py**
Contains specific functionality used for the IMLD application. It is essentially a wrapper for ML Tools and ML Tools Data while modifying those inputs and outputs to the web app's specific needs.

### **nedc_ml_tools_data.py**
Contains the core logic for the generation of the selected shapes for the data generation feature for the IMLD application.

### **nedc_ml_tools.py**
Contains the core logic, mainly training and predicting, of the selected machine learning algorithms. It also includes general functionality that can be used by all algorithms. 
