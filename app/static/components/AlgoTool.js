import { EventBus } from "./Events.js";

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

    // intialize the web socket
    //
    this.socket = io();
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
    await this.render();

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

  get_form() {
    /*
    method: AlgoTool::get_form

    args:
      None

    return:
      form (Object): The form object that is created by the FormContainer class

    description:
      this method returns the form object that is created by the FormContainer class
    */
   return this.form;
  }

  get_algo() {
    /*
    method: AlgoTool::get_algo

    args:
      None

    return:
      selectedValue (String): The name of the selected algorithm

    description:
      this method returns the name of the selected algorithm
    */
    return this.selectedValue;
  }

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
            width: 100%;
            height: 10%;
          }

          #progress-bar-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            height: 5%;
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

          progress-bar {
            width: 45%;  /* Same width as the buttons */
            height: 70%; /* Same height as the buttons */
            margin: 0 10px;
          }

        </style>

        <!-- Add your HTML here -->
        <div class="main">
          <div id="progress-bar-container">
            <progress-bar id="trainProgressBar"></progress-bar>
            <progress-bar id="evalProgressBar"></progress-bar>
          </div>
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

      // get elements for train and eval progress bar
      //
      const trainProgressBar = this.shadowRoot.querySelector('#trainProgressBar');
      const evalProgressBar = this.shadowRoot.querySelector('#evalProgressBar');
  
      // listen to web socket for updates to train progress bar key
      //
      this.socket.on('trainProgressBar', (data) => {
        // update progress value of trian progress bar
        //
        trainProgressBar.setProgress(data.trainProgress);
      });

      // listen to web socket for updates to eval progress bar key
      //
      this.socket.on('evalProgressBar', (data) => {
        // update progress value of eval progress bar
        //
        evalProgressBar.setProgress(data.evalProgress);
      })

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

      // add an event listener to the submit buttons
      // to listen for when the button is clicked
      //
      submitButtons.forEach((button) => {
        button.onclick = () => {
          
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

            EventBus.dispatchEvent(new CustomEvent('train', { 
              detail: {
                'userID': userID,
                'algo': this.selectedValue.toString(),
                'params': this.form.submitForm()
                }
            }));
            
            EventBus.dispatchEvent(new CustomEvent('stateChange'));
          }

          // if the plot is eval, evaluate the model
          //
          else if (plot == 'eval') {
            EventBus.dispatchEvent(new CustomEvent('eval', { 
              detail: {
                'userID': userID
                }
            }));

            EventBus.dispatchEvent(new CustomEvent('stateChange'));
          }
        }
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

        EventBus.dispatchEvent(new CustomEvent('stateChange'));
      });
      //
      // end of event listener
    
    });
    //
    // end of fetch

  }
  //
  // end of method

  set_train_progress(percentage) {
    /*
    method: AlgoTool::set_train_progress

    args:
     percentage (Number): The percentage of the evaluation progress bar
                          as a whole number between 0 and 100

    return:
     None

    description:
     this method sets the progress of the train progress bar. 
     the percentage is a whole number between 0 and 100.
    */
    

    // get the train progress bar
    //
    const pb = this.shadowRoot.getElementById('trainProgressBar');

    // set the progress of the train progress bar
    //
    pb.setProgress(percentage);
  }

  set_eval_progress(percentage) {
    /*
    method: AlgoTool::set_eval_progress

    args:
     percentage (Number): The percentage of the evaluation progress bar
                          as a whole number between 0 and 100

    return:
     None

    description:
     this method sets the progress of the eval progress bar. 
     the percentage is a whole number between 0 and 100.
    */
    

    // get the train progress bar
    //
    const pb = this.shadowRoot.getElementById('evalProgressBar');

    // set the progress of the train progress bar
    //
    pb.setProgress(percentage);
  }

  change_train_state(state) {
    /*
    method: AlgoTool::change_train_state

    args:
     state (Boolean): The state of the train button. True if the button is enabled, 
                      false if the button is disabled.

    return:
     None

    description:
     This method changes the state of the train button. If the state is true, the button is enabled.
     If the state is false, the button is disabled.
    */

    // get the train button
    //
    const trainButton = this.shadowRoot.querySelector('button#train');

    // change the state accordingly
    //
    if (state) { trainButton.className = ''; }
    else { trainButton.className = 'disabled'; }
  }

  change_eval_state(state) {
    /*
    method: AlgoTool::change_eval_state

    args:
     state (Boolean): The state of the eval button. True if the button is enabled, 
                      false if the button is disabled.

    return:
     None

    description:
     This method changes the state of the eval button. If the state is true, the button is enabled.
     If the state is false, the button is disabled.
    */

    // get the eval button
    //
    const evalButton = this.shadowRoot.querySelector('button#eval');

    // change the state accordingly
    //
    if (state) { evalButton.className = ''; }
    else { evalButton.className = 'disabled'; }
  }
}
//
// end of class

// Register the custom element so it can be used in the wepage HTML
//
customElements.define('algorithm-toolbar', AlgoTool); 