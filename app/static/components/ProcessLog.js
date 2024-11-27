class ProcessLog extends HTMLElement {
    /*
    class: ProcessLog
  
    description:
     This class is designed to provide a customizable logging interface for displaying 
     process and analysis results in a scrollable container. It extends the HTMLElement 
     class and creates a shadow root to encapsulate its styles and structure.
  
     To create a new component, copy this template and adjust the class and file names 
     to match the desired component. Also, change the custom element name at the 
     end of this file.
  
     Additional methods and properties may be added as needed.
    */
  
    
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
        method: ProcessLog::connectedCallback
  
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
        method: ProcessLog::render
        
        args:
         None
  
        return:
         None
  
        description:
         This method renders the component to the webpage by setting the innerHTML of the
         shadow root to what is in the string below.
        */
  
        // Write HTML and CSS structure for the ProcessLog component
        //
        this.shadowRoot.innerHTML = `
        
        <style>
          /* Styling for the scrollable background area */
          .scroll-bg {
              display: block;
              width: 100%;
              height: 100%;
              margin-bottom: 2%;
              margin-left: 0%;
              box-sizing: border-box;
          }
  
          /* Main scrollable div container styling */
          .scroll-div {
              width: 100%;
              height: 19vh;
              width: 60vw;
              background: white;
              overflow-y: auto;
          }
  
          /* Content inside the scrollable div styling */
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
        
        <!-- Structure for log content within a scrollable div -->
        <div>
            <div class="scroll-bg">
                <div class="scroll-div">
                    <div class="scroll-object">
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    //
    // end of method

    writeLog(log) {
        /*
        method: ProcessLog::writeLog
        
        args:
         log: string - the log message to be written to the log container
  
        return:
         None
  
        description:
         This method writes a log message to the log container.
        */
  
        // Get the log object
        //
        let logObject = this.shadowRoot.querySelector('.scroll-object');
  
        // Append the log message to the log container
        //
        logObject.innerHTML += log + '<br>';
  
        // Scroll to the bottom of the log container
        //
        logObject.scrollTop = logObject.scrollHeight;
    }
  
  }
  //
  // end of class
  
  // Register the custom element
  //
  customElements.define('process-log', ProcessLog);
  