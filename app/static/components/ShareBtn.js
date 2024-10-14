class ShareBtn extends HTMLElement {
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

          /* Add your CSS styles here */
          div {
            display: flex;
            flex-direction: row;
            align-items: center;
            transition: filter 0.3s ease;
          }

          div:hover {
            filter: drop-shadow(3px 3px 3px rgb(65, 65, 65));
            cursor: pointer;
          }
        
          div h2 {
            color: var(--secondary-color);
            font-family: 'Inter', sans-serif;
            font-weight: 100;
            font-size: clamp(16px, 2vh, 40px);
            margin-right: 10px;
          }
          
          div img {
            width: 20px;
            height: 20px;
          }

        </style>

        <div>
          <h2>Share</h2>
          <img src="static/icons/share.svg" alt="share">
        </div> 
      `;
    }
    //
    // end of method
  
  }
  //
  // end of class

  // Register the custom element so it can be used in the wepage HTML
  customElements.define('share-btn', ShareBtn); 