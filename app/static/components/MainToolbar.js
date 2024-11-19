class MainToolbar extends HTMLElement {
  /*
  class: MainToolbar

  description:
  This class is designed to create a customizable toolbar component with dropdown menus 
  for various actions. It extends the HTMLElement class and uses a shadow root for 
  encapsulating its styles and structure, ensuring that styles do not leak to the outside.
  It provides the ability to interact with various toolbar buttons and dropdowns, handling 
  user clicks and interactions.

  To create a new instance of the component, the class should be instantiated by the custom 
  element `<main-toolbar>`, and it will render a fully interactive toolbar with different 
  functional sections.

  Additional methods and properties may be added as needed to extend the functionality.
  */

  constructor() {
    /*
    method: ToolbarBtn::constructor

    args:
     None

    returns:
     ToolbarBtn instance

    description:
     This is the constructor for the ToolbarBtn class. It initializes the component, 
     creates a shadow root for encapsulation, and binds the handleOutsideClick 
     method to the current context to ensure it has the correct 'this' reference 
     when invoked as an event handler.
    */

    // Call the parent constructor (HTMLElement)
    //
    super();

    // Create a shadow root for the component
    //
    this.attachShadow({ mode: 'open' });

    // Bind the handleOutsideClick method to the current instance
    //
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  //
  // end of method

  async connectedCallback() {
    /*
    method: ToolbarBtn::connectedCallback

    args:
     None

    return:
     None

    description:
     This method is called when the component is added to the DOM. It renders the 
     component's HTML and CSS, adds click event listeners for the menu buttons, 
     and attaches an event listener to the document for handling clicks outside 
     the component to close any open dropdowns.
    */

     await this.loadJSONData();

    // Render the component to the webpage
    //
    this.render();

    // Add click event listeners to the menu buttons
    //
    this.addClickEvents();

    // Attach an event listener to the document for outside clicks
    //
    document.addEventListener('click', this.handleOutsideClick);
  }
  //
  // end of method

  async loadJSONData() {
    try {
      const response = await fetch('/api/get_data_params');  // Adjust the URL to your endpoint
      const jsonText = await response.json();  // Use .json() instead of .text() for JSON parsing
      this.jsonData = jsonText;  // Store the data directly
    } catch (error) {
      this.jsonData = {};  // Fallback in case of error
      console.error("Error loading JSON data:", error);
    }
  }  

  disconnectedCallback() {
    /*
    method: ToolbarBtn::disconnectedCallback

    args:
     None

    return:
     None

    description:
     This method is called when the component is removed from the DOM.
     It removes the event listener for outside clicks to prevent memory leaks.
    */

    // Remove the event listener for outside clicks
    //
    document.removeEventListener('click', this.handleOutsideClick);
  }
  //
  // end of method

  handleOutsideClick(event) {
    /*
    method: ToolbarBtn::handleOutsideClick

    args:
     event: MouseEvent - The click event that triggered the handler.

    return:
     None

    description:
     This method checks if a click event occurred outside the shadow root
     of the component. If so, it calls closeAllDropdowns to close any open dropdowns.
    */

    // Check if the click was outside the component's shadow root
    //
    if (!this.shadowRoot.contains(event.target)) {
        this.closeAllDropdowns();
    }
  }
  //
  // end of method

  closeAllDropdowns() {
    /*
    method: ToolbarBtn::closeAllDropdowns

    args:
     None

    return:
     None

    description:
     This method closes all dropdown menus within the component and 
     removes the 'active' class from all menu buttons, ensuring that 
     only one dropdown can be open at a time.
    */

    // Close all dropdowns and remove the 'active' class from all buttons
    //
    this.shadowRoot.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.style.display = 'none';
    });
    this.shadowRoot.querySelectorAll('.menubutton').forEach(button => {
        button.classList.remove('active');
    });
  }
  //
  // end of method

  addClickEvents() {
    /*
    method: ToolbarBtn::addClickEvents

    args:
     None

    return:
     None

    description:
     This method adds click event listeners to all menu buttons. When a button 
     is clicked, it toggles the visibility of the associated dropdown and 
     ensures that only one dropdown is open at a time by calling closeAllDropdowns.
    */

    // Select all menu buttons within the component's shadow root
    //
    const buttons = this.shadowRoot.querySelectorAll('.menubutton');

    // Add a click event listener to each menu button
    //
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Stop the event from bubbling up to prevent it from closing dropdown immediately
            //
            event.stopPropagation();  

            // Retrieve the dropdown associated with the current button
            // 
            const dropdown = button.nextElementSibling;

            // Check if the dropdown is currently visible
            //
            if (dropdown) {
                const isVisible = dropdown.style.display === 'block';

                // Close all other dropdowns and deactivate buttons
                //
                this.closeAllDropdowns();

                // If the dropdown was not already visible, open it and mark the button as active
                //
                if (!isVisible) {
                    dropdown.style.display = 'block';
                    button.classList.add('active');
                }
            } else {
                // Close all if it's just a button without a dropdown
                //
                this.closeAllDropdowns();
            }
        });
    });
  }
  //
  // end of method

  render() {
    /*
    method: ToolbarBtn::render
      
    args:
      None

    return:
      None

    description:
      This method renders the component to the webpage by setting the innerHTML of the
      shadow root to what is in the string below.
    */

    const dataButtons = Object.entries(this.jsonData).map(([key, value]) => {
      return `<data-button label="${value.name}" key="${key}"></data-button>`;
    }).join("");

    // Set the inner HTML of the shadow root with toolbar structure, menu items, and dropdowns
    //
    this.shadowRoot.innerHTML = `
      <style>
        /* Global Styles: Resets default body margin and padding */
        body {
          margin: 0;
          padding: 0;
        }

        /* Toolbar Styles: Defines toolbar layout and borders */
        .toolbar {
          background-color: #FFFFFF;
          display: flex;
          padding: 0;
          width: 100vw;
          box-sizing: border-box;
          border-bottom: #c9c9c9 1px solid;
          border-top: #c9c9c9 1px solid;
        }

        /* Menu and Dropdown Styles: Sets position and styling for menu items and dropdowns */
        .menu {
          position: relative;
          display: inline-block;
        }

        /* Dropdown default state: Hidden until triggered */
        .dropdown {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background-color: white;
          min-width: 150px;
          border: 1px solid #ccc;
          z-index: 2;
        }

        /* Dropdown Button Styles: Styles each option within dropdown menus */
        .dropdownbutton {
          background-color: white;
          color: black;
          font-family: 'Inter', sans-serif;
          font-weight: 100;
          font-size: 1em;
          padding: 5px 30px;
          border: none;
          cursor: pointer;
          min-width: 220px;
          white-space: nowrap;
          text-align: left;
        }

        /* Hover effect for dropdown buttons */
        .dropdownbutton:hover {
          background-color: #c9c9c9
        }

        /* Separator: Thin dividing line between dropdown options */
        .separator {
          border-bottom: 1px solid #ccc; // Thin line
        }

        /* Menu Button Styles: Styles for buttons at the top of each dropdown */
        .menubutton {
          background-color: #FFFFFF;
          color: #464646;
          font-family: 'Inter', sans-serif;
          font-weight: 100;
          font-size: 1em;
          padding: 0.5vh 1vw;
          margin: 0 10px;
          border: none;
          border-bottom: 2px solid #FFFFFF;
          cursor: pointer;
        }

        /* Hover Effect for menu buttons */
        .menubutton:hover {
          color: #808080;
          border-bottom: 2px solid #808080; /* Gray border when hovered */
        }

        /* Active button: Keeps a button visually active after being clicked */
        .menubutton.active {
          color: #7441BA;
          border-bottom: 2px solid #7441BA;
          font-weight: bold;
        }

      </style>

      <div class="toolbar">
        <!-- "File" menu with associated dropdown containing file operations -->
        <div class="menu">
          <button class="menubutton">File</button>
          <div class="dropdown">
            <toolbar-openfile-button label="Load Train Data" plotId="train"></toolbar-openfile-button>
            <toolbar-openfile-button label="Load Eval Data" plotId="eval"></toolbar-openfile-button>
            <div class="separator"></div>
            <toolbar-savefile-button label="Save Train As..."></toolbar-savefile-button>
            <toolbar-savefile-button label="Save Eval As..."></toolbar-savefile-button>
            <div class="separator"></div>
            <toolbar-openfile-button label="Load Model"></toolbar-openfile-button>
            <toolbar-openfile-button label="Load Parameters"></toolbar-openfile-button>
            <div class="separator"></div>
            <toolbar-savefile-button label="Save Model As..."></toolbar-savefile-button>
            <toolbar-savefile-button label="Save Parameters As..."></toolbar-savefile-button>
          </div>
        </div>

        <!-- "Edit" menu with dropdown for settings and clearing options -->
        <div class="menu">
          <button class="menubutton">Edit</button>
          <div class="dropdown">
            <toolbar-dropdown-settings label="Settings"></toolbar-dropdown-settings>
            <toolbar-button label="Process Log"></toolbar-button>
            <toolbar-dropdown-clear label="Clear Train"></toolbar-dropdown-clear>
            <toolbar-dropdown-clear label="Clear Eval"></toolbar-dropdown-clear>
            <toolbar-button label="Clear All"></toolbar-button>
            <toolbar-button label="Reset"></toolbar-button>
          </div>
        </div>

        <!-- "View" menu with dropdown for matrix display options -->
        <div class="menu">
          <button class="menubutton">View</button>
          <div class="dropdown">
            <toolbar-checkbox-button label="Print Confusion Matrix"></toolbar-checkbox-button>
          </div>
        </div>

        <!-- "Classes" menu with options to add and delete classes -->
        <div class="menu">
          <button class="menubutton">Classes</button>
          <div class="dropdown">
            <toolbar-popup-button label="Add Class"></toolbar-popup-button>
            <toolbar-popup-button label="Delete Class"></toolbar-popup-button>
          </div>
        </div>

        <!-- "Patterns" menu with options for point and Gaussian drawing -->
        <div class="menu">
          <button class="menubutton">Patterns</button>
          <div class="dropdown">
            <toolbar-checkbox-button label="Draw Points"></toolbar-checkbox-button>
            <toolbar-checkbox-button label="Draw Gaussian"></toolbar-checkbox-button>
          </div>
        </div>

        <!-- "Data" menu with dropdown for selecting data shapes and layouts -->
        <div class="menu">
          <button class="menubutton">Data</button>
          <div class="dropdown">
            ${dataButtons}
          </div>
        </div>

        <!-- "Help" menu with static help button for guidance -->
        <div class="menu">
          <button class="menubutton">Help</button>
        </div>
      </div>
    `;
  }
  //
  // end of method

}
//
// end of class 

// Register the custom element
//
customElements.define('main-toolbar', MainToolbar);
