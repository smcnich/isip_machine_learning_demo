class FormContainer extends HTMLElement {
    /*
    class: FormContainer

    description:
     this class is used for creating a form container that can be used to create
     dynamic parameter boxes. these formes are populated using parameter files that
     are served from the server. the parameters are used to create input fields for
      the form. the form can be submitted to get the values of the input fields.
    */

    constructor(params) {
      /*
      method: FormContainer::constructor

      args:
       params (Object): the parameters for the form. should have the following format:

        params = {
          param1: {
            name: 'Parameter Name',
            type: 'int' or 'float' or 'matrix' or 'group',
            default: depends on type,
            ...
          },
          ...
        }

      returns:
       FormContainer instance

      description:
       This is the constructor for the FormContainer class. It initializes the component,
       creating a shadow root and getting the class name for reference. given the parameters,
       it will create a form with labeled input fields for each parameter. the parameters must
       have the proper format.
      */

      // Call the parent constructor (HTMLElement)
      super();

      // Create a shadow root for the component
      //
      this.attachShadow({ mode: 'open' });

      // get the name of the class
      //
      this.name = this.constructor.name;

      // set the parameters for the form
      //
      this.params = params;
    }
    //
    // end of method
  
    async connectedCallback() {
      /*
      method: Template::connectedCallback

      args:
       None

      return:
       None

      description:
       This method is called when the component is added to the DOM.
      */

      // render the component to the webpage
      //
      this.render();
    }
    //
    // end of method
  
    render() {
      /*
      method: FormContainer::render
      
      args:
       None

      return:
       None

      description:
       This method renders the component to the webpage by setting the innerHTML of the
       shadow root to what is in the string below.
      */

       // WRITE YOUR HTML AND CSS HERE
      this.shadowRoot.innerHTML = `
        <style>
          /* Styling the main container for form inputs */
          .form-container {
            display: flex;
            flex-direction: column;
          }

          /* Styling for individual input containers */
          .num-container {
            border: 2px solid #ccc;
            padding: 0.4vw;
            border-radius: 0.4vw;
            width: 100%;
            margin: 0.4vh 0.15vw 0.1vw;
            box-sizing: border-box;
          }

          /* Label styling for input fields */
          .num-container label {
            padding-left: 0.5vw;
            font-family: 'Inter', sans-serif;
            font-size: 0.9em;
            font-weight: bold;
            margin-bottom: 0.3vw;
            display: block;
          }

          /* Grid layout for input fields */
          .num-input {
            display: grid;
            gap: 0.5vw;
          }

          /* Input field styling */
          input {
            padding: 0.4vw;
            border: 1px solid #ccc;
            border-radius: 0.4vw;
            font-size: 0.75em;
            box-sizing: border-box;
            width: 100%;
          }

          /* Input field focus state */
          input:focus {
            border-color: #7441BA;
            border-width: 2px;
            outline: none;
          }
        </style>

        <!-- Add your HTML here -->
        <div id="form-div"></div>
      `;

      // save the form element as a class property
      //
      this.form = this.createForm(this.params);


      this.shadowRoot.getElementById('form-div').appendChild(this.form);
    }
    //
    // end of method

    processParam(key, param) {
      /*
      method: ParamForm::processParam

      args:
       key (String): the key of the parameter, should match nedc ml tools data
       param (Object): the parameters for the specific parameter. the format depends
                       on the type of parameter. should have the atleast the 
                       following format:

                        param = {
                          name: 'Parameter Name',
                          type: 'int' or 'float' or 'matrix' or 'group',
                          default: depends on type,
                          ...
                        }

       returns:
        HTMLDivElement: a container with labeled input fields for the parameter,
                        dependent on type

       description:
        this method processes a parameter and generates the appropriate input field
        based on the type of the parameter. it returns an HTMLDivElement with the
        labeled input field.
      */

      // get the type of the parameter
      //
      const type = param.type;

      // If the parameter is of type 'int'
      //
      if (type === 'int') {
        return this.generate_numeric_input(key, param, true);
      }

      // if the input is of type 'float'
      //
      else if (type === 'float') {
        return this.generate_numeric_input(key, param, false);
      }

      // if the input is of type 'matrix'
      //
      else if (type === 'matrix') {
        return this.generate_matrix(key, param, false);
      }

      // If the parameter is of type 'group' and has nested params
      //
      else if (type === 'group' && param.params) {

        // Create a div for the group container
        //
        const groupHTML = document.createElement('div');
        groupHTML.className = "group-container";
        groupHTML.style.display = "flex";

        // Iterate over nested params inside the group and process each one
        //
        for (const [nestedKey, nestedParam] of Object.entries(param.params)) {
          groupHTML.appendChild(this.processParam(nestedKey, nestedParam));  // Recursively process each nested parameter
        }

        // Return the group HTML
        //
        return groupHTML;  
      }

      return null;  // Return an empty string if no valid type is found
    }

    generate_numeric_input(key, params, int=false) {
      /*
      method: ParamForm::generate_numeric_input

      args:
       key (String): the key of the parameter, should match nedc ml tools data
       params (Object): the parameters for the specific numeric input. should have
                        the following format:

                         params {
                            name: 'Parameter Name',
                            type: 'int' or 'float',
                            default: 0,
                            range: [0, 10] (optional)
                         }
        int (Boolean): whether the input should be an integer or not

      returns:
       HTMLDivElement: a container with labeled input fields for a numeric input

      description:
       this method generates a responsive container with labeled input field for an
       integer or float input based on the specified name and default value
      */

      // Create a container with label and input grid
      //
      const container = document.createElement('div');
      container.className = 'num-container';
  
      // create a label for the input
      //
      const label = document.createElement('label');
      label.textContent = params.name;
      label.for = key;
  
      // create the input field
      //
      const inputDiv = document.createElement('input');
      inputDiv.className = 'num-input';
      inputDiv.type = 'number';
      
      // set the default value
      //
      inputDiv.value = params.default;
      
      // set the key of the input so it can be inputted on the form
      //
      inputDiv.id = key;

      // create a basic placeholder that will be expanded on in the
      // logic
      //
      let placeHolder = 'Float Value';

      // if the input is an integer, set the step to 1
      //
      if (int) { 
        inputDiv.step = 1; 
        placeHolder = 'Integer Value';
      }
      
      // if a range is given, set the min and max values
      // make sure to check for inf values and modify placeholder
      //
      if (params.range) {

        if (params.range[0] != "-inf") {
          inputDiv.min = params.range[0];
          placeHolder += ` >= ${params.range[0]}`
        }

        if (params.range[1] != "inf") {
          inputDiv.max = params.range[1]; 
          placeHolder += ` and <= ${params.range[1]}` 
        }
      }

      // set the placeholder value
      //
      inputDiv.placeholder = placeHolder;
  
      // add the label and input to the container
      //
      container.appendChild(label);
      container.appendChild(inputDiv);
  
      // return the container as an HTML string
      //
      return container;
    }
    //
    // end of method

    generate_matrix(key, params, int=False) {
      /*
      method: FormContainer::generate_matrix
  
      args:
       key (String): the key of the parameter, should match nedc ml tools data
       params (Object): the parameters for the specific matrix input. should have
                        the following format:

                         params = {
                           name: 'Matrix Name',
                           type: 'matrix',
                           dimensions: [2, 2],
                           default: [[1, 2], [3, 4]],
                           range: [0, 10] (optional)
                         }
       int (Boolean): whether the input should be an integer or not
  
      returns:
       HTMLDivElement: a container with labeled input fields for a matrix
  
      description:
       This method generates a responsive container with labeled input fields
       based on the specified name, dimensions, and default values. It ensures 
       that all input values are formatted to four decimal places.
      */
      
      // get the rows and columns of the matrix
      //
      const rows = params.dimensions[0];
      const cols = params.dimensions[1];

      // create an input div for the matrix inputs
      //
      const inputDiv = document.createElement('div');
      inputDiv.className = 'num-input';
  
      // Generate HTML for input fields
      //
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          
          // parse the default parameter correctly
          //
          let defaultValue;
          if (int) {
            defaultValue = parseInt(params.default[i][j] || 0); // Ensure default values are integers
          }
          else {
            defaultValue = parseFloat(params.default[i][j] || 0).toFixed(4); // Ensure default values have 4 decimals
          }

          // create the input field
          //
          const input = document.createElement('input');
          input.type = 'number';
          
          // give the input a placeholder and default value
          //
          input.placeholder = `Value [${i}, ${j}]`;
          input.value = defaultValue;
          
          // make sure the input is limited to 4 decimal places
          //
          input.oninput = "this.value = parseFloat(this.value || 0).toFixed(4)";
          input.onblur = "this.value = parseFloat(this.value || 0).toFixed(4)";

          // if a range is given, set the min and max values
          //
          if (params.range) {
            inputDiv.min = params.range[0];
            inputDiv.max = params.range[1];
          }

          // if the input is an integer, set the step to 1
          //
          if (int) { inputDiv.step = 1; }
        
          // add the input to the input div
          //
          inputDiv.appendChild(input);
        }
      }

      // create the label for the input
      //
      const label = document.createElement('label');
      label.textContent = params.name;
      label.for = key;
  
      // Create a container with label and input grid
      // make sure it has the correct aria label that matches
      // the label
      //
      const container = document.createElement('div');
      container.className = 'num-container';
      container.ariaLabel = key;
  
      // Apply grid layout dynamically
      //
      inputDiv.style.display = 'grid';
      inputDiv.style.gridTemplateColumns = `repeat(${cols}, 1fr)`; // Dynamically set grid columns
      inputDiv.style.gap = '0.5vw'; // Space between inputs
  
      // append the label and input div to the container
      //
      container.appendChild(label);
      container.appendChild(inputDiv);
  
      // return the container that contains the label and the matrix input
      //
      return container;
    }
    //
    // end of method

    createForm(params) {
      /*
      method: FormContainer::createForm

      args:
       params (Object): the parameters for the form. should have the following
                        format:

                         params = {
                           param1: {
                             name: 'Parameter Name',
                             type: 'int' or 'float' or 'matrix' or 'group',
                             default: depends on type,
                             ...
                           },
                           ...
                         }

      returns:
       HTMLFormElement: a form with labeled input fields for each parameter

      description:
       this method creates a form with labeled input fields for each parameter
       in the params object. it returns the form as an HTMLFormElement.
      */

      const form = document.createElement('form');

      // iterate over each parameter and create an input field for it
      //
      for (const [key, param] of Object.entries(params.params)) {
        form.appendChild(this.processParam(key, param));
      }

      // return the form element
      //
      return form;
    }
    //
    // end of method

    submitForm() {
      /*
      method: FormContainer::submitForm

      args:
       None

      returns:
       Object: a JSON object with the values of the form

      description:
       this method is called when the form is submitted. tt will collect the values
       of the form and return them as a JSON object.
      */

      // get the form data
      //
      const formData = new FormData(this.form);

      // convert the form data to a JSON object
      //
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }

      // return the data
      //
      return data;
    }
    // end of method

  }
  //
  // end of class

  // Register the custom element so it can be used in the wepage HTML
  customElements.define('form-container', FormContainer); 