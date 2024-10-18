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

      let algs = {
        'EUCLIDEAN': 'Euclidean Distance',
        'PCA'      : 'Principle Components Analysis',
        'QDA'      : 'Quadratic Discriminant Analysis',
        'LDA'      : 'Linear Discriminant Analysis',
        'QLDA'     : 'Quadratic Linear Discriminant Analysis',
        'NB'       : 'Naive Bayes',
        'KMEANS'   : 'K-Means Clustering',
        'KNN'      : 'K-Nearest Neighbors',
        'RF'       : 'Random Forest',
        'SVM'      : 'Support Vector Machines',
        'MLP'      : 'Multi-Layer Perceptron',
      };

      // iterate over each alg in the dictionary and create an option element
      let options = '';
      for (let key in algs) {
        options += `<option value="${key}">${algs[key]} (${key})</option>`;
      };

      // WRITE YOUR HTML AND CSS HERE
      this.shadowRoot.innerHTML = `
        <style>
          /* Add your CSS styles here */

          div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 90%;
            width: 100%;
            margin-top: 0.5em;
          }

          select {
            height: 80%;
            border: 2px solid black;
            border-radius: 5px;
            font-family: 'Inter', sans-serif;
            font-size: 1em;
            font-weight: 600;
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
            margin-bottom: 1em;
            margin-top: 1em;
            width: 100%;
            height: 20%;
          }

          button { 
            width: 10em;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            padding-top: 0.5em;
            padding-bottom: 0.5em;
            font-size: 1.25em;
            border-style: solid;
            border-width: 2px;
            border-color: black;
            border-radius: 5px;
          }

          #params {
            width: 100%;
            height: 90%;
            outline: 1px solid black;
            margin-top: 0.5em;
          }

          #train {
            background-color: #E1BE08;
            margin-right: 0.6em;
          }

          #eval {
            background-color: #02B313;
            margin-left: 0.6em;
          }
        </style>

        <!-- Add your HTML here -->
        <div>
          <select>
            <option value="" disabled selected>Select an Algorithm</option>
            ${options}
          <select>
          <div id="params">
            <h3> params go here </h3>
          </div>
          <div id="button-container">
            <button id="train">Train</button>
            <button id="eval">Evaluate</button>
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