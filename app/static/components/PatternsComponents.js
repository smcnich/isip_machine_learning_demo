import { EventBus } from "./Events.js";

class DrawPointsCheckBox extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.checked = false; // Initial state of the checkbox
      this.isOpen = false; // Track if the button is open
    }
  
    connectedCallback() {

        // Render the initial state
        //
        this.render();

        // Add global click listener
        //
        document.addEventListener('click', this.handleDocumentClick.bind(this));
    }
  
    disconnectedCallback() {
      document.removeEventListener('click', this.handleDocumentClick.bind(this)); // Clean up the listener
    }
  
    render() {
      const label = this.getAttribute('label') || 'Button'; // Get the label from the attribute
      
      this.shadowRoot.innerHTML = `
        <style>
          .toolbar-checkbox-button {
            background-color: white;
            color: black;
            font-family: 'Inter', sans-serif;
            font-weight: 100;
            font-size: 1em;
            padding: 5px 0; /* Remove left padding, keep top/bottom padding */
            border: none;
            cursor: pointer;
            min-width: 220px;
            white-space: nowrap;
            text-align: left;
            display: flex; /* Use flexbox for alignment */
            align-items: center; /* Center align items vertically */
          }
  
          .toolbar-checkbox-button:hover {
            background-color: #c9c9c9;
          }
  
          input[type="checkbox"] {
            margin-right: 7px; /* Space between checkbox and label */
            margin-left: 10px;
          }

          /* Popup styling */
          .popup {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 25vw;
            max-width: 90%;
            max-height: 80vh;
            padding: 15px;
            padding-top: 10px;
            padding-bottom: 10px;
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.1s ease, transform 0.2s ease;
            overflow: auto;
          }
  
          .popup.show {
            display: block;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
  
          .popup h2 {
            font-family: 'Inter', sans-serif;
            font-size: 1.2em;
            margin: 0 0 8px 0;
          }
  
          /* Close button styling */
          .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #333;
          }
  
          /* Overlay styling */
          .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
  
          .overlay.show {
            display: block;
          }
        </style>
  
        <button class="toolbar-checkbox-button" id="checkboxButton">
          <input type="checkbox" id="checkbox" ?checked="${this.checked}"/>
          ${label}
        </button>

        <!-- Background overlay -->
        <div class="overlay" id="overlay"></div>
  
        <!-- Popup container -->
        <div class="popup" id="popup">
            <button class="close-btn" id="close-btn">X</button>
            <h2>Draw Gaussian</h2>
            <form>
                <label for="class-select">Class:</label>
                <select id="class-select" name="class-select"></select>
                <button type="submit">Submit</button>
            </form>
        </div>
      `;
  
        // Add click event listener to toggle checkbox and button state
        const button = this.shadowRoot.querySelector('#checkboxButton');
        const checkbox = this.shadowRoot.querySelector('#checkbox');
        const popup = this.shadowRoot.getElementById('popup');
        const closeBtn = this.shadowRoot.getElementById('close-btn');
        const form = this.shadowRoot.querySelector('form');
    
        button.onclick = (event) => {
            
            // Prevent event from bubbling up
            //
            event.stopPropagation(); 
            
            // Toggle the checked state
            //
            this.checked = !this.checked; 

            // Update the checkbox state
            //
            checkbox.checked = this.checked; 

            // Mark the button as open
            //
            this.isOpen = true;

            // toggle the popup if the checkbox is checked
            //
            if (this.checked) {
                this.togglePopup();
            }
        };

        // Close the popup when clicking the close button
        //
        closeBtn.onclick = (event) => {

            // Prevent event propagation to avoid conflicts
            //
            event.stopPropagation();

            // Call closePopup method to hide popup
            //
            this.closePopup();
        };

        // Stop event propagation on popup to avoid closing when clicking inside it
        //
        popup.onclick = (event) => {
            event.stopPropagation(); // Stop event from bubbling up to parent listeners
        };

        // Add a global click listener to close the popup if clicked outside
        //
        document.onclick = (event) => {

            // Get the selected item
            // the first item of the composed path is the clicked item
            // for some reason event.target is not leading to the clicked item
            //
            const selectedItem = event.composedPath()[0]

            // Check if popup is open and if the click item is not the 
            // color picker
            //
            if (this.isPopupOpen && 
            !selectedItem.getAttribute('id') == 'color-select') {
                this.closePopup();
            }
        };

        form.onsubmit = (event) => {

            event.preventDefault();
            
            const formData = new FormData(form);

            EventBus.dispatchEvent(new CustomEvent('enableDraw', {
                detail: {
                    'type': 'points',
                    'className': formData.get('class-select'),
                }
            }));

            this.closePopup();
        };
    }

    clearClassOptions() {
            
        // Clear existing options in the select element
        //
        const select = this.shadowRoot.getElementById('class-select');
        select.innerHTML = '';
    }

    addClassOption(className) {
            
        // Create a new option element
        //
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
    
        // Append the new option to the select element
        //
        const select = this.shadowRoot.getElementById('class-select');
        select.appendChild(option);
    }

    // Toggle the visibility of the popup
    togglePopup() {

        // Create popup and overlay element
        //
        const popup = this.shadowRoot.getElementById('popup');
        const overlay = this.shadowRoot.getElementById('overlay');
    
        // Toggle popup state
        //
        this.isPopupOpen = !this.isPopupOpen;
    
        // Show popup and overlap and ensure they are both visible
        //
        if (this.isPopupOpen) {
          popup.classList.add('show');
          overlay.classList.add('show');
          popup.style.display = 'block';
          overlay.style.display = 'block';
        } 
        
        else {
          // Close popup if already open
          //
          this.closePopup();
        }
    }
    //
    // end of method

    // Close the popup and overlay
    //
    closePopup() {

        // Create popup and overlay element
        //
        const popup = this.shadowRoot.getElementById('popup');
        const overlay = this.shadowRoot.getElementById('overlay');
    
        // Remove show class from popup and overlay
        //
        popup.classList.remove('show');
        overlay.classList.remove('show');
    
        // Hide popup and overlay after transition ends
        //
        setTimeout(() => {
          popup.style.display = 'none';
          overlay.style.display = 'none';
        }, 100);
    
        // Set popup state to closed
        //
        this.isPopupOpen = false;
    }
    //
    // end of method
  
    handleDocumentClick(event) {
      const button = this.shadowRoot.querySelector('#checkboxButton');

      console.log('component clicked')
      
      // Check if the clicked target is outside of the button
      if (this.isOpen && !button.contains(event.target)) {
        this.isOpen = false; // Close the button
        // Optionally, reset checkbox state if needed
        // this.checked = false; 
        // this.shadowRoot.querySelector('#checkbox').checked = this.checked; // Update checkbox state
      }
    }
}

// Register the custom element
//
customElements.define('draw-points-checkbox', DrawPointsCheckBox);