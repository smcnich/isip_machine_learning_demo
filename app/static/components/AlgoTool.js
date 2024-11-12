const ALGO_PARAMS = "algo_params";

class AlgoTool extends HTMLElement {
    /*
    class: AlgoTool

    description:
     this class is to contain the functionality, styling, and structure of the algorithm toolbar.
     this class will include the dropdown menu for the algorithms, the parameters for the algorithms,
     and the buttons to train and evaluate the algorithms. it will also contain the logic to populate
     the dropdown menu with the algorithms and the parameters for the selected algorithm. finally, the
     class will contain the logic to send the parameters to the server when the train or evaluate button
     as well as retrieve the parameters from the server when the page is loaded.
    */

    constructor() {
      /*
      method: AlgoTool::constructor

      args:
       None

      returns:
       Template instance

      description:
       This is the constructor for the Template class. It initializes the component 
       and creates a shadow root. It gets the HTML and CSS for the component that
       should be in the same directory as this file.
      */

      // Call the parent constructor (HTMLElement)
      //
      super();

      // Create a shadow root for the component
      //
      this.attachShadow({ mode: 'open' });

      // get the name of the class
      //
      this.name = this.constructor.name;
    }
    //
    // end of method
  
    async connectedCallback() {
      /*
      method: AlgoTool::connectedCallback

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

    async fetch_params() {
      /*
      method: async AlgoTool::fetch_params

      args:
       none

      return:
       data (Object): The algorithm parameters that are fetched from the server

      description:
       fetch the algorithm parameters from the server. cache the parameters on the client so that this
       method only needs to be run once on the load of the page
      */

      try {

        // fetch the parameters from the Flask server. make sure to wait for the response
        //
        const response = await fetch('/api/get_alg_params');
        
        // if the fetch fails, throw an error
        //
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        // parse the response as JSON
        //
        const data = await response.json();

        // return the parameters
        //
        return data;
      }

      // if an error occurs during the fetch and process, log the error to the console
      //
      catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    }
    //
    // end of method

    createParam(key, value) {
      /*
      method: AlgoTool::createParam

      args:
       key (String): the key of the parameter
       value (Object): the object containing the parameter information

      return:
       container (Element): the div element that contains the label and input
                            for the parameter

      description:
       this method creates a div element that contains the label and input for the parameter.
       it sets the label to the name of the parameter and the input to the default value of the
       parameter. it then returns the div element. this function uses logic to create the correct
       input type based on the type of the parameter.
      */

      // create the overall container for the parameter
      //
      let container = document.createElement('div');
      container.classList.add('param-container');

      // create the label container
      //
      let label_container = document.createElement('div');
      label_container.classList.add('label-container');
      
      // create the label element
      //
      let label = document.createElement('label');
      label.setAttribute('for', key);
      label.innerText = value['name'];

      // append the label and info icon to the label container
      //
      label_container.appendChild(label);
      label_container.appendChild(
        document.createElement('info-icon')
      )

      // initialize the input element
      //
      let input;

      // if the parameter is a select type, create a select element
      //
      if (value['type'] == 'select') {
        
        // create the select element
        //
        input = document.createElement('select');
        
        // iterate over the options in the parameter and create an option element for each
        //
        for (let option of value['options']) {
          let opt = document.createElement('option');
          opt.setAttribute('value', option);
          opt.innerText = option;
          input.appendChild(opt);
        }

        // set the default value of the select element
        //
        input.defaultValue = value['default'];
      }

      // if the parameter is a int type, create a number input element
      //
      else if (value['type'] == 'int') {

        // create the number input element
        //
        input = document.createElement('input');

        // set the attributes of the number input element
        //
        input.setAttribute('type', 'number');

        // make sure the input is only a whole int
        //
        input.setAttribute('step', '1');
        
        // limit the input to the range of the parameter
        //
        input.setAttribute('min', value['range'][0]);

        // if the range is not infinite, set the max attribute
        //
        if (value['range'][1] != "inf") {
          input.setAttribute('max', value['range'][1]);
        }

        // set the default value of the number input element
        //
        input.defaultValue = value['default'];
      }
      // TODO: create the 'float' and 'class-based' types

      // link the input to the key of the parameter
      //
      input.setAttribute('name', key);
      input.classList.add('input');

      // append the label container and input to the overall container
      //
      container.appendChild(label_container);
      container.appendChild(input);

      // return the container element
      //
      return container;
    }
    //
    // end of method

    generate_param_fields(data) {
      /*
      method: AlgoTool::generate_param_fields

      args:
       data (Object): the parameters for the algorithm, that came from the server

      return:
       params (String): the HTML string that contains the parameter fields for the algorithm

      description:
       this method generates the parameter fields for the algorithm. it creates a div for each
       parameter in the algorithm using the AlgoTool::createParam method. it then adds the
       divs (as a string) to the params variable and returns it.
      */
      
      // create an empty string to hold the html for the parameters
      //
      let params = '';

      // iterate over each parameter in the data object and create a div for it
      //
      for (let key in data) {
        params += this.createParam(key, data[key]).outerHTML;
      }

      // return the params html
      //
      return params; 
    }
    //
    // end of method
  
    render() {
      /*
      method: Template::render
      
      args:
       None

      return:
       None

      description:
       This method renders the component to the webpage by setting the innerHTML of the
       shadow root to what is in the string below.
      */

      let options = '';

      // fetch the algorithm parameters from the server and render them
      // this is an async function so we need to use a promise to wait for the data
      //
      this.fetch_params().then((data) => {

        // iterate over each alg in the dictionary and create an option element
        //
        for (let key in data) {
          options += `<option value="${key}">${data[key]['name']} (${key})</option>`;
        };

        // WRITE YOUR HTML AND CSS HERE
        this.shadowRoot.innerHTML = `
          <style>
            /* Add your CSS styles here */

            :host {
              height: 100%;
              width: 100%;
            }

            .main {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 95%;
              margin-top: 1rem;
              margin-bottom: 1rem;
              margin-left: 1.25rem;
              margin-right: 1.25rem;
            }

            .algo-select {
              height: 2.5rem;
              border: 1px solid black;
              border-radius: 5px;
              font-family: 'Inter', sans-serif;
              font-size: 1em;
              font-weight: 100;
              background-color: var(--main-color);
              margin-top: 1em;
            }

            option {
              font-family: 'Inter', sans-serif;
              font-size: 1em;
              font-weight: 100;
            }

            #button-container {
              display: flex;
              flex-direction: row;
              justify-content: center;
              margin-bottom: 1em;
              margin-top: 1em;
              width: 100%;
              height: 10%;
            }

            button { 
              height: 100%;
              width: 40%;
              font-family: 'Inter', sans-serif;
              font-weight: 600;
              padding-top: 0.5em;
              padding-bottom: 0.5em;
              font-size: 1.25em;
              border-style: solid;
              border-width: 1px;
              border-color: black;
              border-radius: 5px;
            }

            #params {
              width: 100%;
              height: 90%;
              margin-top: 1.5em;
              display: flex;
              flex-direction: column;
              justify-content: start;
            }

            #train {
              background-color: #E1BE08;
              margin-right: 0.6em;
            }

            #eval {
              background-color: #02B313;
              margin-left: 0.6em;
            }

            .param-container {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              height: 10%;
            }

            label {
              font-family: 'Inter', sans-serif;
              font-size: 1em;
              font-weight: 100;
            }

            .label-container {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              margin-left: 1em;
            }

            div.label-container > info-icon {
              margin-top: 4px;
              margin-left: 5px;
            }

            .input {
              height: auto;
              width: 50%;
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
              box-sizing: border-box;
            }

            select.input {
              font-family: 'Inter', sans-serif;
              font-size: 0.9em;
              font-weight: 100;
              border: 1px solid #8f8f9d;
              border-radius: 2px;
              background-color: var(--secondary-color);
            }

            input.input {
              font-family: 'Inter', sans-serif;
              font-size: 0.9em;
              font-weight: 100;
              border: 1px solid #8f8f9d;
              border-radius: 2px;
              background-color: var(--secondary-color);
            }

          </style>

          <!-- Add your HTML here -->
          <div class="main">
            <div id="button-container">
              <button id="train">Train</button>
              <button id="eval">Evaluate</button>
            </div>
            <select class="algo-select">
              <option value="" disabled selected>Select an Algorithm</option>
              ${options}
            <select>
            <div id="params"></div>
          </div>
        `;

        // get the algo select element to be used to monitor when the value changes
        //
        const selectElement= this.shadowRoot.querySelector('.algo-select');
        
        // get the container which the parameters will be stored in so they can be
        // added when the algortihm is changed
        //
        const paramsContainer = this.shadowRoot.querySelector('#params');
        
        // create an event listener that listens to when the value of the select element changes
        //
        selectElement.addEventListener('change', (event) => {

          // clear the params container so that the new params can be added
          //
          paramsContainer.innerHTML = '';

          // get the selected value of the select element
          //
          const selectedValue = event.target.value;

          // get the params for the selected algorithm and generate the param fields
          //
          let params = this.generate_param_fields(data[selectedValue]['params']);

          // add the params to the params container
          paramsContainer.innerHTML += params;
        });
        //
        // end of event listener
      
      });
      //
      // end of fetch
    }
    //
    // end of method
  
  }
  //
  // end of class

  // Register the custom element so it can be used in the wepage HTML
  //
  customElements.define('algorithm-toolbar', AlgoTool); 