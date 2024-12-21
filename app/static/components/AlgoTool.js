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
      AlgoTool instance

    description:
      This is the constructor for the AlgoTool class. It is called when a new instance of the class is created.
      The constructor will create a shadow root for the component and set the name of the class. It will also
      create a variable to hold the process log component and set the trainReady and evalReady flags to false.
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

    // create a variable to hold the form and select values
    //
    this.form = null;
    this.selectedValue = null;

    // create variables to hold flags that are used in the state-machine
    // that controls which buttons are enabled and disabled
    //
    this.trainReady = false;
    this.evalReady = false;
    this.trained = false;
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

    // Add a global listener for getAlgoParams
    //
    window.addEventListener('getAlgoParams', (event) => {
      // get the event sender so the data can be sent back to the correct component
      //
      const sender = event.detail.ref;

      sender.data = {};

      // Get the selected algorithm name from the AlgoTool component
      const selectElement = this.shadowRoot.querySelector('.algo-select');
      const algoName = selectElement.selectedOptions[0].textContent;

      // save the data to the sender, to it can be saved 
      //
      sender.data.params = this.form.submitForm(null, null, 1);
      sender.data.name = algoName;
    });

    window.addEventListener('paramfileLoaded', (event) => {

      // get the algoName and params
      //
      const algoName = event.detail.data.name;
      const params = event.detail.data.params;

      // get the algorithm select element from shadow DOM
      //
      const selectElement = this.shadowRoot.querySelector('.algo-select');

      // loop through all options of select toolbar
      //
      for (const option of selectElement.options) {

        // see if option from file exists and matches
        //
        if (option.text == algoName) {

          // set to matching value and dispatch event to change toolbar and form container
          //
          selectElement.value = option.value;
          selectElement.dispatchEvent(new Event('change'));
          break;
        }
      }

      // set default values of the form container
      //
      this.form.setDefaults(params);
    });
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
      const response = await fetch(`${baseURL}api/get_alg_params/`);
      
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
            opacity: 0.6;
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
          </select>
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

      // listen for a plotChange event that comes from the Plot component
      // when this event is fired, one of the plots have changed
      // and the button should be enabled or disabled accordingly
      //
      window.addEventListener('plotChange', (event) => {

        // if the plotId is train, set the trainReady flag to the status of the event
        //
        if (event.detail.plotId == 'train') {
          this.trainReady = event.detail.status;
          
          // if the train plot is not ready, set the trained flag to false
          //
          if (!this.trainReady) {
            this.trained = false;
          }
        }

        // if the plotId is eval, set the evalReady flag to the status of the event
        //
        else if (event.detail.plotId == 'eval') {
          this.evalReady = event.detail.status;
        }

        // modify the status of the buttons after the changes
        //
        this.check_button();
      });

      // add an event listener to the submit buttons
      // to listen for when the button is clicked
      //
      submitButtons.forEach((button) => {
        button.addEventListener('click', () => {
          
          // if the button is disabled, do not do anything
          //
          if (button.className == 'disabled') {
            return null;
          }

          // get the proper button id and route to send the data to
          //
          let plot = button.getAttribute('id');

          // if the plot is train, train the model
          // and set the trained flag to true
          //
          if (plot == 'train') {
            this.train();
            this.trained = true;
            this.check_button();
          }

          // if the plot is eval, evaluate the model
          //
          else if (plot == 'eval') {
            this.evaluate();
          }
        });
      });
      
      // create an event listener that listens to when the value of the select element changes
      //
      selectElement.addEventListener('change', (event) => {

        // clear the params container so that the new params can be added
        //
        paramsContainer.innerHTML = '';

        // get the selected value of the select element
        //
        this.selectedValue = event.target.value;
        this.selectedName = event.target.options[event.target.selectedIndex].text;

        // Create a style element
        const style = `
        /* Styling the main container for form inputs */
        .form-container {
          display: flex;
          flex-direction: row;
          width: 100%;
        }

        .class-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
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

        // if the form is an instance of InvalidLabelsError, then the user
        // has not created training data yet. print to the process log that
        // the user needs to create training data before selecting an algorithm
        // 
        if (this.form instanceof InvalidLabelsError) {
          this.processLog.writePlain(`Please create training data before selecting ${this.selectedValue} algorithm`);

          // reset the form
          //
          this.form = null;

          // reset the the value on the select element to default
          //
          event.target.selectedIndex = 0;
          
          // end this function
          //
          return;
        }

        // add the params to the params container
        //
        paramsContainer.appendChild(this.form);

        // modify the status of the buttons after the changes
        //
        this.check_button();
      });
      //
      // end of event listener
    
    });
    //
    // end of fetch

  }
  //
  // end of method

  check_button() {
    /*
    method: AlgoTool::check_button

    args:
      plotId (string): the id of the plot that the button is associated with

    return:
      None

    description:
      this method checks the status of the button associated with the plotId. if the button is
      disabled, the method will enable the button. if the button is enabled, the method will disable
      the button.
    */

    // get the train and eval buttons
    //
    const trainButton = this.shadowRoot.querySelector('button#train');
    const evalButton = this.shadowRoot.querySelector('button#eval');

    // if the train and eval plots are ready and the form is ready and the model is trained
    // then allow both buttons to be clicked
    //
    if (this.trainReady && this.evalReady && this.form && this.trained) {
      trainButton.className = '';
      evalButton.className = '';
    }

    // if the train plot is ready and the form is ready, allow the train button to be clicked
    //
    if (this.trainReady && this.form) {
      trainButton.className = '';
    }

    // if the eval plot is ready and the model is trained, allow the eval button to be clicked
    //
    if (this.evalReady && this.form && this.trained) {
      evalButton.className = '';
    }

    // if the train plot is not ready or the form is not ready, disable the train button
    // and set the trained flag to false
    //
    if (!this.trainReady || !this.form) {
      trainButton.className = 'disabled';
      this.trained = false;
    }

    // if the eval plot is not ready or the model is not trained, disable the eval button
    //
    if (!this.evalReady || !this.trained) {
      evalButton.className = 'disabled';
    }
  }
  // end of method

  evaluate() {
    /*
    method: AlgoTool::evaluate

    args:
     None

    return:
     None

    description:
     this method sends the data from the eval plot to the server to be evaluated. it then
     plots the decision surface on the eval plot and writes the results to the process log.
     the server will know which model to use because it is stored in a server side cache.
     the cache is a dictionary with the key being the user id (a timestamp) and the value 
     being the model.
    */

    // since the eval button was clicked, we know that the plot is the eval plot
    //
    let plot = 'eval';

    const start = Date.now()

    // write to the process log that the eval data is being evaluated
    //
    this.processLog.writePlain('Evaluating data...');

    // get the train and the eval plot card
    //
    let evalCard, trainCard;
    document.querySelectorAll('plot-card').forEach((card) => {
      if(card.getAttribute('plotId') == "train") {
        trainCard = card;
      }
      else if (card.getAttribute('plotId') == 'eval') {
        evalCard = card;
      }
    });

    // get the decision surface data from the train plot
    //
    const dsData = trainCard.get_decision_surface();

    // if the data is null, print to the process log that the model could not be evaluated
    //
    if (dsData == null) {
      this.processLog.writePlain('Could not evaluate model. Please train the model first.');
      return null;
    }

    // plot the decision surface on the eval plot
    //
    evalCard.decision_surface(dsData);

    // get the data from the eval plot
    //
    const plotData = evalCard.data;

    // build the request
    //
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userID': userID,
        'plotData': plotData
      })
    };

    // make a train request to the server
    //
    fetch(`${baseURL}api/${plot}/`, request)
    
    // if the fetch fails, throw an error and log it to the 
    // process log
    //
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      else {
        this.processLog.writePlain('Model could not be trained due to a server error. Please try again.');
        throw new Error('Network response was not ok.');
      }
    })
    
    // if the fetch is successful, plot the decision surface
    //
    .then((data) => {
      this.processLog.writeMetrics('Eval', data);
      const end = Date.now()
      console.log(`Eval Time: ${end - start} ms`)
    });
    //
    // end of fetch
  }
  //
  // end of method

  train() {
    /*
    method: AlgoTool::train

    args:
     None

    return:
     None

    description:
     this method sends the data from the train plot to the server to be trained. it then
     plots the decision surface on the train plot and writes the results to the process log.
     the server will store the model in the server side cache. the cache is a dictionary with 
     the key being the user id (a timestamp) and the value being the model.
    */
    
    // since the train button was clicked, we know that the plot is the train plot
    //
    let plot = 'train';

    const start = Date.now()

    // get the form data
    //
    const formData = this.form.submitForm();

    this.processLog.writeHeader(this.selectedName.toString(), 'h2');

    // write to the process log that the model is being trained
    //
    this.processLog.writePlain('Training model...');

    // get the plot card to be used to plot the decision surface
    //
    let plotCard;
    document.querySelectorAll('plot-card').forEach((card) => {
      if(card.getAttribute('plotId') == plot) {
        plotCard = card;
      }
    });

    // clear the decision surface before plotting the new one
    //
    plotCard.clear_decision_surface();

    // get the data from the plot
    //
    let plotData = plotCard.data;

    // if the data in the plot is nothing, 
    // print to the process log that the model could not be trained
    //
    if (plotData == null) {
      this.processLog.writePlain('Could not train model. Please plot training data first.');
      return null;
    }

    // build the request
    //
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userID': userID,
        'algo': this.selectedValue.toString(),
        'params': formData,
        'plotData': plotData
      })
    };

    // make a train request to the server
    //
    fetch(`${baseURL}api/${plot}/`, request)
    
    // if the fetch fails, throw an error and log it to the 
    // process log
    //
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      else {
        this.processLog.writePlain('Model could not be trained due to a server error. Please try again.');
        throw new Error('Network response was not ok.');
      }
    })
    
    // if the fetch is successful, plot the decision surface
    //
    .then((data) => {

      // plot the decision surface
      //
      plotCard.decision_surface(data.decision_surface);

      // write the metrics to the process log
      //
      this.processLog.writeMetrics('Train', data.metrics);
      const end = Date.now()
      console.log(`Train Time: ${end - start} ms`)

    });
  }
  //
  // end of method
  
}
//
// end of class

// Register the custom element so it can be used in the wepage HTML
//
customElements.define('algorithm-toolbar', AlgoTool); 