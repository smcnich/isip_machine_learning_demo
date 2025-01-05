# Components Directory - File Overview

This directory contains all of the JavaScript frontend components for the project. Below is an explanation of each file to help understand their roles within the frontend system.

## File/Folders Structure
- **app/static/components/**
  - **AlgoTool.js**
  - **DataParams.js**
  - **FormContainer.js**
  - **InfoIcon.js**
  - **MainToolbar.js**
  - **Plot.js**
  - **ProcessLog.js**
  - **ProgressBar.js**
  - **ShareBtn.js**
  - **ToolbarComponents.js**

### **AlgoTool.js**
Defines the component to create the algorithm toolbar of the application, which is used for selecting between various machine learning algorithms, setting the corresponding parameters to the selected algorithm, and allowing the user to train and evaluate the datasets with those algorithms.

### **DataParams.js**
Defines the components used to create the data generation popups of the default shapes, which is used for generating 2D datasets used for training and evaluation. It also provides the user with more customizability during the generation of the shape such as the number of points, mean, and covariance.

### **FormContainer.js**
Defines the component used to create a form with inputs. It is modular as this component is used for both the algorithm toolbar and data generation features, as both have forms with inputs. This component also has modular input types such as select, float input, integer input, matrix inputs, and class-based inputs.

### **InfoIcon.js**
Defines the component used to create the popup for the info icons. These info icons are used to provide the user with additional information when pressed upon. 

### **MainToolbar.js**
Defines the component used to create the main toolbar. The main toolbar then contains various different components from the 'ToolbarComponents.js' file to create the different types of buttons within the main toolbar. This component also sets up how the main toolbar reacts to mouse movements. 

### **Plot.js**
Defines the component used to create the plots. These plots can be reused and defined using the plotID, which can be seen through the Train and Eval plots of the application. It also contains the event listeners to define how it dynamically responds to update the plots by graphing with new data, plotting decision surfaces, or clearing the plots altogehter.

### **ProcessLog.js**
Defines the component used to provide dynamic and responsive updates while training and evaluating the datasets. It provides crucial information including the algorithm selected, performance metrics, and various elements while training the model. 

### **ProgressBar.js**
Defines the component used to provide visual updates in percentages of the current stages of both training and evaluating the datasets.

### **ShareBtn.js**
Defines the component used to share the web application to others through a link.

### **ToolbarComponents.js**
Defines the smaller components that make up the main toolbar, which includes the different popups, buttons, and secondary dropdown menus. Each of these smaller components contain their own individual functionalities and can be reused without the application.
