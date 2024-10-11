class ProcessLog extends HTMLElement {
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

       // WRITE YOUR HTML AND CSS HERE
      this.shadowRoot.innerHTML = `
        <style>

        .scroll-bg {
          background: blue;
          width: 96%; /* Adjust the width to 100% or any specific percentage */
          height: 100%; /* Adjust the height to fit the parent */
          margin-bottom: 1%; /* Padding effect from the bottom */
          margin-left: 2%;
          box-sizing: border-box; /* Ensures margins don’t overflow the container */
        }

        .scroll-div {
          width: 100%;
          height: auto;
          background: white;
          overflow-y: auto;
          max-height: 19vh;
        }

        </style>

        <!-- Add your HTML here -->
        <div>
          <div class="scroll-bg">
            <div class="scroll-div">
              <div class="scroll-object">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Fusce vel nunc gravida, volutpat risus ut, condimentum ante. 
                Donec efficitur tempus fermentum. Ut quis nibh vitae purus semper finibus. 
                Pellentesque id malesuada est, non blandit ex. 
                Praesent condimentum a tellus vel dignissim. 
                Morbi mollis urna at nisl facilisis, nec molestie risus vulputate. 
                Praesent rhoncus diam nulla, tempor pharetra erat consectetur quis. 
                Quisque quam purus, viverra eu mi sollicitudin, sodales fringilla risus. 
                Morbi maximus purus vel odio venenatis, vel tempor nisi tincidunt.
                Maecenas eget lacus id tellus elementum porta. Integer eleifend diam nisl, 
                vitae mollis purus dapibus et. Curabitur non nisl non tellus mattis tincidunt 
                nec at dolor. Donec sagittis nulla a quam dapibus molestie. Phasellus elementum 
                rutrum neque ut volutpat. Suspendisse sed ex nec nulla feugiat facilisis. 
                Aliquam egestas quam ac massa lobortis, scelerisque consequat urna imperdiet.
                Vivamus ullamcorper facilisis metus, eget sagittis turpis blandit sit amet. 
                Mauris a malesuada justo, nec lobortis nisi. Vestibulum massa orci, faucibus 
                sed cursus non, laoreet at neque. Curabitur eleifend, mi nec tristique ornare, 
                magna eros fermentum orci, vel pretium purus sapien eget ligula. Praesent 
                rhoncus tortor et sem laoreet gravida. Maecenas aliquet lacinia hendrerit. 
                Pellentesque lobortis, leo id lobortis laoreet, felis tellus viverra nisl, 
                vitae tincidunt risus magna non mauris. Curabitur id augue mollis, imperdiet 
                lorem et, congue mi. Duis fermentum at eros eu convallis. In id consequat sapien, 
                vitae hendrerit urna. Praesent sodales ultricies risus, non pretium sem malesuada ac. 
                Aliquam id tincidunt ante, non tristique sem. Integer et libero tincidunt, 
                rutrum nisi id, congue nisi.
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

  // Register the custom element so it can be used in the wepage HTML
  customElements.define('process-log', ProcessLog); 