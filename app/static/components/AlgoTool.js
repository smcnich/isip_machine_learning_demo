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

      // create a variable to hold the process log component
      //
      this.processLog = document.querySelector('process-log');

      this.form = null;
      this.selectedValue = null;
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
          options += `<option value="${key}">${data[key]['name']}</option>`;
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
              margin-top: 0.2rem;
              margin-bottom: 0.2rem;
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
              margin-bottom: 0.2em;
              margin-top: 1em;
              width: 100%;
              height: 10%;
            }

            button { 
              height: 70%;
              width: 45%;
              font-family: 'Inter', sans-serif;
              font-weight: 600;
              font-size: 1.1em;
              border-style: solid;
              border-width: 1px;
              border-color: black;
              border-radius: 5px;
              box-shadow: 1px 2px 2px 1px rgba(0,0,0,0.24);
              opacity: 0.8;
              transition: box-shadow 0.2s;
              transition: opacity 0.2s;
            }

            button:hover {
              box-shadow: 2px 3px 3px 2px rgba(0,0,0,0.24);
              opacity: 1;
            }

            button:active {
              box-shadow: none;
            }

            .disabled {
              opacity: 0.6;
              cursor: not-allowed;
              box-shadow: none;
            }

            .disabled:hover {
              box-shadow: none;
            }

            #params {
              width: 100%;
              height: 90%;
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

            #paramBox {
              margin-top: 1em;
              width: 100%;
              height: 100%;
            }
          </style>

          <!-- Add your HTML here -->
          <div class="main">
            <div id="button-container">
              <button id="train" class=disabled>Train</button>
              <button id="eval" class=disabled>Evaluate</button>
            </div>
            <select class="algo-select">
              <option value="" disabled selected>Select an Algorithm</option>
              ${options}
            <select>
            <div id="paramBox"></div>
          </div>
        `;

        // get the algo select element to be used to monitor when the value changes
        //
        const selectElement= this.shadowRoot.querySelector('.algo-select');
        
        // get the container which the parameters will be stored in so they can be
        // added when the algortihm is changed
        //
        const paramsContainer = this.shadowRoot.querySelector('#paramBox');

        // get the algo select element to be used to monitor when the value changes
        //
        const submitButtons = this.shadowRoot.querySelectorAll('button');

        submitButtons.forEach((button) => {
          button.addEventListener('click', () => {

            // if the form or selected value is null, return
            //
            if ((!this.form) || (!this.selectedValue) || (button.className == 'disabled')) {
              return;
            }

            this.processLog.writeLog('Training model...');

            // get the proper button id and route to send the data to
            //
            let plot = button.getAttribute('id');
            let route = '/api/' + plot + '/';

            // create an event to get the data from the Plot.js component
            // the event listener is in the Plot.js component and when invoked,
            // the listener will add a property called "this.data" that contains
            // the data from the plot
            //
            window.dispatchEvent(new CustomEvent('getData', {
              detail: {
                ref: this,
                plotId: plot
              }
            }));

            if (this.data == null) {
              return null;
            }

            const request = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                'algo': this.selectedValue.toString(),
                'params': this.form.submitForm(),
                'plotData': this.data
              })
            };

            // make a train request to the server
            //
            fetch(route, request)
            
            // if the fetch fails, throw an error
            //
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Network response was not ok.');
            })
            
            // if the fetch is successful, plot the decision surface
            //
            .then((data) => {

              document.querySelectorAll('plot-card').forEach((plotCard) => {

                if(plotCard.getAttribute('plotId') == plot) {
                  plotCard.decision_surface(data);
                }

              })

              this.processLog.writeLog('Model trained successfully!');

            });

            

          });
        });
        
        // create an event listener that listens to when the value of the select element changes
        //
        selectElement.addEventListener('change', (event) => {

          // get the algo select element to be used to monitor when the value changes
          //
          const submitButtons = this.shadowRoot.querySelectorAll('button');

          submitButtons.forEach((button) => {
            button.className = '';
          });

          // clear the params container so that the new params can be added
          //
          paramsContainer.innerHTML = '';

          // get the selected value of the select element
          //
          this.selectedValue = event.target.value;

          // Create a style element
          const style = `
          /* Styling the main container for form inputs */
          .form-container {
            display: flex;
            flex-direction: row;
            width: 100%;
          }
      
          /* Styling for individual input containers */
          .num-container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border: 2px solid #ccc;
            padding: 0.4vw;
            border-radius: 0.4vw;
            margin: 0.4vh 0.15vw 0.1vw;
            box-sizing: border-box;
            width: 100%;
          }
      
          /* Label styling for input fields */
          label {
            padding-left: 0.5vw;
            padding-right: 0.5vw;
            padding-top: 0.30vw;
            font-family: 'Inter', sans-serif;
            font-size: 0.85em;
            font-weight: bold;
          }
      
          /* Input field styling */
          input, select {
            padding: 0.2vw;
            border: 1px solid #ccc;
            border-radius: 0.4vw;
            font-size: 0.8em;
            width: 35%;
            background-color: white;
            font-family: 'Inter', sans-serif;
            font-size: 0.8em;

            -ms-box-sizing:content-box;
            -moz-box-sizing:content-box;
            box-sizing:content-box;
            -webkit-box-sizing:content-box; 
          }

          option {
            font-family: 'Inter', sans-serif;
            font-size: 0.8em;
          }
      
          /* Input field focus state */
          input:focus, select:focus {
            border-color: #7441BA;
            border-width: 2px;
            outline: none;
          }
        `;

        // create a dynamic form container for the distribution key
        //
        this.form = new FormContainer(data[this.selectedValue], style);

        // add the params to the params container
        paramsContainer.appendChild(this.form);
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