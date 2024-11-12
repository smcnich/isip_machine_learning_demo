class AlgoTool extends HTMLElement {
    /*
    class: Template

    description:
     This class is meant to act as a template for creating custom web components.
     It extends the HTMLElement class and creates a shadow root for encapsulation.

     If you want to create a new component, copy this template and make your component
     with it. Just change the name of the class and the name of the file to match the
     name of your component. Also, make sure to change the name of the custom element
     at the end of this file.

     Feel free to add any additional methods or properties to your component as needed.
    */

    constructor() {
      /*
      method: Template::constructor

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
      super();

      // Create a shadow root for the component
      this.attachShadow({ mode: 'open' });

      // get the name of the class
      this.name = this.constructor.name;
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
      this.render();
    }
    //
    // end of method

    createParam(key, value) {

      let container = document.createElement('div');
      container.classList.add('param-container');

      let label_container = document.createElement('div');
      label_container.classList.add('label-container');
      
      let label = document.createElement('label');
      label.setAttribute('for', key);
      label.innerText = value['name'];

      label_container.appendChild(label);
      label_container.appendChild(
        document.createElement('info-icon')
      )

      let input;

      if (value['type'] == 'select') {
        input = document.createElement('select');
        for (let option of value['options']) {
          let opt = document.createElement('option');
          opt.setAttribute('value', option);
          opt.innerText = option;
          input.appendChild(opt);
        }
      }
      else {
        input = document.createElement('input');
        input.setAttribute('type', value['type']);
      }

      input.setAttribute('name', key);
      input.classList.add('input');

      container.appendChild(label_container);
      container.appendChild(input);

      return container;
    }
  
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

      const algs = {
        'EUCLIDEAN': 'Euclidean Distance',
        'PCA'      : 'Principle Components Analysis',
        'QDA'      : 'Quadratic Discriminant Analysis',
        'LDA'      : 'Linear Discriminant Analysis',
        'QLDA'     : 'Quadratic Linear Discriminant Analysis',
        'NB'       : 'Naive Bayes',
        'KMEANS'   : 'K-Means Clustering',
        'KNN'      : 'K-Nearest Neighbors',
        'RNF'      : 'Random Forest',
        'SVM'      : 'Support Vector Machines',
        'MLP'      : 'Multi-Layer Perceptron',
      };

      const parameters = {
        'criterion' : {'name' : 'Criterion', 'type' : 'select', 'options' : ['gini', 'entropy', 'log_loss']},
        'estimator' : {'name' : 'Estimator', 'type' : 'number'},
        'max_depth' : {'name' : 'Max Depth', 'type' : 'number'}
      }

      // iterate over each alg in the dictionary and create an option element
      let options = '';
      for (let key in algs) {
        options += `<option value="${key}">${algs[key]} (${key})</option>`;
      };

      let params = '';
      for (let [key, param] of Object.entries(parameters)) {
        let cont = this.createParam(key, param);
        params += cont.outerHTML;
      }

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
          <div id="params">
            ${params}
          </div>
        </div>
      `;
    }
    //
    // end of method
  
  }
  //
  // end of class

  // Register the custom element so it can be used in the wepage HTML
  customElements.define('algorithm-toolbar', AlgoTool); 