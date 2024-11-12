class ProcessLog extends HTMLElement {
  constructor() {
      /*
      method: ProcessLog::constructor

      args:
       None

      returns:
       ProcessLog instance

      description:
       This is the constructor for the ProcessLog class. It initializes the component 
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
      method: ProcessLog::connectedCallback

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
      method: ProcessLog::render
      
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
        .scroll-bg {
            display: block;
            width: 100%;
            height: 100%;
            margin-bottom: 2%;
            margin-left: 0%;
            box-sizing: border-box;
        }

        .scroll-div {
            width: 100%;
            height: 19vh;
            width: 60vw;
            background: white;
            overflow-y: auto;
        }

        .scroll-object {
            font-family: 'Inter', sans-serif;
            font-size: 1em;
            padding-right: 0.7em;
        }

        /* WebKit Browsers (Chrome, Safari) Custom Scrollbar */
        .scroll-div::-webkit-scrollbar {
           width: 0.7em;
        }
        .scroll-div::-webkit-scrollbar {
           background: #c9c9c9;
           border-radius: 100vw;
        }
        .scroll-div::-webkit-scrollbar-thumb {
           background: #7441BA;
           border-radius: 100vw;
        }
        .scroll-div::-webkit-scrollbar-thumb:hover {
           background: #512e82;
           border-radius: 100vw;
        } 
      </style>
      
      <!-- Add your HTML here -->
      <div>
          <div class="scroll-bg">
              <div class="scroll-div">
                  <div class="scroll-object">
                      Classes: added class 'Class0' <br>
                      Classes: added class 'Class1' <br>
                      =============================================== <br>
                      Algorithm: PCA <br>
                      =============================================== <br>
                      ----------------------------------------------- <br>
                      Training (PCA): <br>
                      Training Error Rate = 0.00% <br>
                      Confusion Matrix: <br>
                        Ref/Hyp:     Class0          Class1      <br>
                        Class0: 10000 (100.00%)     0 (  0.00%)  <br>
                        Class1:     1 (  0.01%)  9999 ( 99.99%)  <br>
                      ----------------------------------------------- <br>
                      Evaluating (PCA): <br>
                      Evaluation Error Rate = 0.00% <br>
                      Confusion Matrix: <br>
                        Ref/Hyp:     Class0          Class1     <br>
                        Class0: 10000 (100.00%)     0 (  0.00%) <br>
                        Class1:     0 (  0.00%) 10000 (100.00%)
                  </div>
              </div>
          </div>
      </div>
      `;
  }
  //
  // end of method

}
//
// end of class

// Register the custom element so it can be used in the webpage HTML
customElements.define('process-log', ProcessLog);
