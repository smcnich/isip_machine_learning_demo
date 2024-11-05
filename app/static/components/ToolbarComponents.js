class Toolbar_Button extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const label = this.getAttribute('label') || 'Button'; // Get the label from the attribute
      
      this.shadowRoot.innerHTML = `
        <style>
          .toolbar-button {
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
  
          .toolbar-button:hover {
            background-color: #c9c9c9;
          }
  
        </style>
  
        <button class="toolbar-button">${label}</button>
      `;
    }
}

class Toolbar_CheckboxButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.checked = false; // Initial state of the checkbox
      this.isOpen = false; // Track if the button is open
    }
  
    connectedCallback() {
      this.render();
      document.addEventListener('click', this.handleDocumentClick.bind(this)); // Add global click listener
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
        </style>
  
        <button class="toolbar-checkbox-button" id="checkboxButton">
          <input type="checkbox" id="checkbox" ?checked="${this.checked}" />
          ${label}
        </button>
      `;
  
      // Add click event listener to toggle checkbox and button state
      const button = this.shadowRoot.querySelector('#checkboxButton');
      const checkbox = this.shadowRoot.querySelector('#checkbox');
  
      button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event from bubbling up
        this.checked = !this.checked; // Toggle the checked state
        checkbox.checked = this.checked; // Update the checkbox state
        this.isOpen = true; // Mark the button as open
      });
    }
  
    handleDocumentClick(event) {
      const button = this.shadowRoot.querySelector('#checkboxButton');
      // Check if the clicked target is outside of the button
      if (this.isOpen && !button.contains(event.target)) {
        this.isOpen = false; // Close the button
        // Optionally, reset checkbox state if needed
        // this.checked = false; 
        // this.shadowRoot.querySelector('#checkbox').checked = this.checked; // Update checkbox state
      }
    }
}

class Toolbar_DropdownClear extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.addHoverListeners();
    }
  
    render() {
      const label = this.getAttribute('label') || 'Button'; // Get the label from the attribute
  
      this.shadowRoot.innerHTML = `
        <style>
          .toolbar-button {
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
            position: relative; /* Needed for absolute positioning of dropdown */
          }
  
          /* Add the triangle using ::after pseudo-element */
          .toolbar-button::after {
            content: ''; /* Empty content for triangle */
            position: absolute;
            right: 10px; /* Distance from the right edge */
            top: 50%;
            transform: translateY(-50%); /* Vertically center the triangle */
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent transparent black; /* Creates a right-pointing triangle */
          }
      
          .toolbar-button:hover,
          .toolbar-button.active {
            background-color: #c9c9c9; /* Highlight color */
          }
  
          /* Dropdown menu styling */
          .dropdown-menu {
            display: none; /* Initially hidden */
            position: absolute;
            top: 0; /* Aligns with the top of the button */
            left: calc(100% + 0.7px); /* Positions to the right of the button */
            background-color: white;
            z-index: 1000; /* Ensure it's on top */
            min-width: 150px; /* Match button width */
            border: 1px solid #ccc;
          }
  
          .dropdown-menu.show {
            display: block; /* Show when needed */
          }
  
          .dropdown-item {
            background-color: white;
            color: black;
            font-family: 'Inter', sans-serif;
            font-weight: 100;
            font-size: 1em;
            padding: 5px 20px;
            border: none;
            cursor: pointer;
            min-width: 180px;
            white-space: nowrap;
            text-align: left;
          }
  
          .dropdown-item:hover {
            background-color: #c9c9c9; /* Hover effect for dropdown items */
          }
        </style>
  
        <button class="toolbar-button">${label}</button>
        <div class="dropdown-menu" id="dropdown-menu">
          <toolbar-button label="Clear Data"></toolbar-button>
          <toolbar-button label="Clear Results"></toolbar-button>
          <toolbar-button label="Clear All"></toolbar-button>
        </div>
      `;
    }
  
    addHoverListeners() {
      const button = this.shadowRoot.querySelector('.toolbar-button');
      const dropdownMenu = this.shadowRoot.getElementById('dropdown-menu');
  
      // Show the dropdown on hover
      button.addEventListener('mouseenter', () => {
        dropdownMenu.classList.add('show');
        button.classList.add('active'); // Add active class to highlight button
      });
  
      // Hide the dropdown when not hovering over both the button and dropdown
      button.addEventListener('mouseleave', () => {
        if (!dropdownMenu.matches(':hover')) {
          dropdownMenu.classList.remove('show');
          button.classList.remove('active'); // Remove active class when hiding
        }
      });
  
      dropdownMenu.addEventListener('mouseenter', () => {
        dropdownMenu.classList.add('show'); // Keep dropdown open
        button.classList.add('active'); // Keep button highlighted
      });
  
      dropdownMenu.addEventListener('mouseleave', () => {
        dropdownMenu.classList.remove('show'); // Hide when not hovering over dropdown
        button.classList.remove('active'); // Remove highlight when leaving dropdown
      });
    }
}

class Toolbar_DropdownData extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.addHoverListeners();
    }
  
    render() {
      const label = this.getAttribute('label') || 'Button'; // Get the label from the attribute
  
      this.shadowRoot.innerHTML = `
        <style>
          .toolbar-button {
            background-color: white;
            color: black;
            font-family: 'Inter', sans-serif;
            font-weight: 100; /* Keep the button font weight light */
            font-size: 1em;
            padding: 5px 30px;
            border: none;
            cursor: pointer;
            min-width: 220px;
            width: 100%;
            white-space: nowrap;
            text-align: left;
            position: relative; /* Needed for absolute positioning of dropdown */
          }
  
          /* Add the triangle using ::after pseudo-element */
          .toolbar-button::after {
            content: ''; /* Empty content for triangle */
            position: absolute;
            right: 10px; /* Distance from the right edge */
            top: 50%;
            transform: translateY(-50%); /* Vertically center the triangle */
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent transparent black; /* Creates a right-pointing triangle */
          }
  
          .toolbar-button:hover,
          .toolbar-button.active {
            background-color: #c9c9c9; /* Highlight color */
          }
  
          /* Styling for the header to match button style */
          .header {
            color: black;
            font-family: 'Inter', sans-serif;
            font-weight: bold; /* Set the header font weight to bold */
            font-size: 1em;
            padding: 5px 30px; /* Match button padding */
            margin: 0; /* Remove default margin */
            white-space: nowrap; /* Prevent line breaks */
            cursor: default; /* Indicate that it's not clickable */
          }
  
          /* Dropdown menu styling */
          .dropdown-menu {
            display: none; /* Initially hidden */
            position: absolute;
            top: 0px; /* Aligns with the top of the button */
            left: calc(100% + 0.7px); /* Positions to the right of the button */
            background-color: white;
            z-index: 1000; /* Ensure it's on top */
            min-width: 150px; /* Match button width */
            border: 1px solid #ccc;
          }
  
          .dropdown-menu.show {
            display: block; /* Show when needed */
          }
  
          .dropdown-item {
            background-color: white;
            color: black;
            font-family: 'Inter', sans-serif;
            font-weight: 100; /* Keep item font weight light */
            font-size: 1em;
            padding: 5px 20px;
            border: none;
            cursor: pointer;
            min-width: 180px;
            white-space: nowrap;
            text-align: left;
          }
  
          .dropdown-item:hover {
            background-color: #c9c9c9; /* Hover effect for dropdown items */
          }
        </style>
  
        <button class="toolbar-button">${label}</button>
        <div class="dropdown-menu" id="dropdown-menu">
          <h1 class="header">Set Parameters</h1> <!-- Use the new header class -->
          <toolbar-popup-button label="Train"></toolbar-popup-button>
          <toolbar-popup-button label="Eval"></toolbar-popup-button>
        </div>
      `;
    }
  
    addHoverListeners() {
      const button = this.shadowRoot.querySelector('.toolbar-button');
      const dropdownMenu = this.shadowRoot.getElementById('dropdown-menu');
  
      // Show the dropdown on hover
      button.addEventListener('mouseenter', () => {
        dropdownMenu.classList.add('show');
        button.classList.add('active'); // Add active class to highlight button
      });
  
      // Hide the dropdown when not hovering over both the button and dropdown
      button.addEventListener('mouseleave', () => {
        if (!dropdownMenu.matches(':hover')) {
          dropdownMenu.classList.remove('show');
          button.classList.remove('active'); // Remove active class when hiding
        }
      });
  
      dropdownMenu.addEventListener('mouseenter', () => {
        dropdownMenu.classList.add('show'); // Keep dropdown open
        button.classList.add('active'); // Keep button highlighted
      });
  
      dropdownMenu.addEventListener('mouseleave', () => {
        dropdownMenu.classList.remove('show'); // Hide when not hovering over dropdown
        button.classList.remove('active'); // Remove highlight when leaving dropdown
      });
    }
}

class Toolbar_DropdownSettings extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.addHoverListeners();
    }
  
    render() {
      const label = this.getAttribute('label') || 'Button'; // Get the label from the attribute
  
      this.shadowRoot.innerHTML = `
        <style>
          .toolbar-button {
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
            position: relative; /* Needed for absolute positioning of dropdown */
          }
  
          /* Add the triangle using ::after pseudo-element */
          .toolbar-button::after {
            content: ''; /* Empty content for triangle */
            position: absolute;
            right: 10px; /* Distance from the right edge */
            top: 50%;
            transform: translateY(-50%); /* Vertically center the triangle */
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent transparent black; /* Creates a right-pointing triangle */
          }
          
          .toolbar-button:hover,
          .toolbar-button.active {
            background-color: #c9c9c9; /* Highlight color */
          }
  
          /* Dropdown menu styling */
          .dropdown-menu {
            display: none; /* Initially hidden */
            position: absolute;
            top: 0px; /* Aligns with the top of the button */
            left: calc(100% + 0.7px); /* Positions to the right of the button */
            background-color: white;
            z-index: 1000; /* Ensure it's on top */
            min-width: 150px; /* Match button width */
            border: 1px solid #ccc;
          }
  
          .dropdown-menu.show {
            display: block; /* Show when needed */
          }
  
          .dropdown-item {
            background-color: white;
            color: black;
            font-family: 'Inter', sans-serif;
            font-weight: 100;
            font-size: 1em;
            padding: 5px 30px;
            border: none;
            cursor: pointer;
            min-width: 180px;
            white-space: nowrap;
            text-align: left;
          }
  
          .dropdown-item:hover {
            background-color: #c9c9c9; /* Hover effect for dropdown items */
          }
        </style>
  
        <button class="toolbar-button">${label}</button>
        <div class="dropdown-menu" id="dropdown-menu">
          <toolbar-popup-button label="Set Ranges"></toolbar-popup-button>
          <toolbar-popup-button label="Set Gaussian"></toolbar-popup-button>
          <toolbar-popup-button label="Set Color"></toolbar-popup-button>
          <toolbar-checkbox-button label="Normalize Data"></toolbar-checkbox-button>
        </div>
      `;
    }
  
    addHoverListeners() {
      const button = this.shadowRoot.querySelector('.toolbar-button');
      const dropdownMenu = this.shadowRoot.getElementById('dropdown-menu');
  
      // Show the dropdown on hover
      button.addEventListener('mouseenter', () => {
        dropdownMenu.classList.add('show');
        button.classList.add('active'); // Add active class to highlight button
      });
  
      // Hide the dropdown when not hovering over both the button and dropdown
      button.addEventListener('mouseleave', () => {
        if (!dropdownMenu.matches(':hover')) {
          dropdownMenu.classList.remove('show');
          button.classList.remove('active'); // Remove active class when hiding
        }
      });
  
      dropdownMenu.addEventListener('mouseenter', () => {
        dropdownMenu.classList.add('show'); // Keep dropdown open
        button.classList.add('active'); // Keep button highlighted
      });
  
      dropdownMenu.addEventListener('mouseleave', () => {
        dropdownMenu.classList.remove('show'); // Hide when not hovering over dropdown
        button.classList.remove('active'); // Remove highlight when leaving dropdown
      });
    }
}

class Toolbar_OpenFileButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.fileInput = document.createElement('input');
      this.fileInput.type = 'file'; // Set the input type to file
      this.fileInput.style.display = 'none'; // Hide the input
      this.fileInput.addEventListener('change', this.handleFileSelect.bind(this)); // Handle file selection
    }
  
    connectedCallback() {
      this.render();
      this.shadowRoot.appendChild(this.fileInput); // Append the hidden file input to the shadow DOM
    }
  
    render() {
      const label = this.getAttribute('label') || 'Button'; // Get the label from the attribute
      
      this.shadowRoot.innerHTML = `
        <style>
          .toolbar-openfile-button {
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
  
          .toolbar-openfile-button:hover {
            background-color: #c9c9c9;
          }
        </style>
  
        <button class="toolbar-openfile-button">${label}</button>
      `;
  
      // Add click event listener to the button to trigger file input
      const button = this.shadowRoot.querySelector('.toolbar-openfile-button');
      button.addEventListener('click', () => {
        this.fileInput.click()
      }); // Simulate click on the hidden input
    }
  
    handleFileSelect(event) {
      const file = event.target.files[0]; // Get the selected file
      if (file) {
        // You can add code here to handle the selected file, e.g., read it or send it to a server
        console.log('Selected file:', file.name);
      }
    }
}

class Toolbar_PopupButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.isPopupOpen = false; // Track the popup state
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const label = this.getAttribute('label') || 'Button'; // Get the label from the attribute
  
      this.shadowRoot.innerHTML = `
        <style>
          .toolbar-popup-button {
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
  
          .toolbar-popup-button:hover {
            background-color: #c9c9c9;
          }
  
          /* Popup styling */
          .popup {
            display: none; /* Initially hidden */
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0); /* Start scaled down */
            width: 300px;
            height: 200px; /* Increased height */
            padding: 20px;
            background-color: white;
            border-radius: 15px; /* Rounded corners */
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 1000; /* Ensure it's on top */
            opacity: 0; /* Start fully transparent */
            transition: opacity 0.1s ease, transform 0.s ease; /* Transition for opening/closing */
          }
  
          .popup.show {
            display: block; /* Show when needed */
            opacity: 1; /* Fully opaque when shown */
            transform: translate(-50%, -50%) scale(1); /* Scale to original size */
          }
  
          .popup h2 {
            margin: 0 0 20px 0;
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
            display: none; /* Initially hidden */
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
            z-index: 999; /* Ensure it's below the popup */
          }
  
          .overlay.show {
            display: block; /* Show overlay when needed */
          }
        </style>
  
        <button class="toolbar-popup-button">${label}</button>
        <div class="overlay" id="overlay"></div>
        <div class="popup" id="popup">
          <button class="close-btn" id="close-btn">X</button>
          <h2>Popup Title</h2>
          <p>This is the popup content!</p>
        </div>
      `;
  
      // Get elements
      const button = this.shadowRoot.querySelector('.toolbar-popup-button');
      const popup = this.shadowRoot.getElementById('popup');
      const overlay = this.shadowRoot.getElementById('overlay');
      const closeBtn = this.shadowRoot.getElementById('close-btn');
  
      // Show the popup when clicking the button
      button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click event from bubbling up to parent elements
        this.togglePopup(); // Toggle the popup visibility
      });
  
      // Close the popup when clicking the close button or overlay
      closeBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent bubbling when closing
        this.closePopup(); // Close the popup
      });
      
      overlay.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent bubbling when clicking on overlay
        this.closePopup(); // Close the popup
      });
    }
  
    togglePopup() {
      const popup = this.shadowRoot.getElementById('popup');
      const overlay = this.shadowRoot.getElementById('overlay');
  
      this.isPopupOpen = !this.isPopupOpen;
  
      if (this.isPopupOpen) {
        popup.classList.add('show'); // Add show class to initiate transition
        overlay.classList.add('show'); // Add show class to overlay
        popup.style.display = 'block'; // Ensure popup is displayed
        overlay.style.display = 'block'; // Ensure overlay is displayed
      } else {
        this.closePopup(); // Close the popup if it's already open
      }
    }
  
    closePopup() {
      const popup = this.shadowRoot.getElementById('popup');
      const overlay = this.shadowRoot.getElementById('overlay');
  
      popup.classList.remove('show'); // Remove show class to initiate transition
      overlay.classList.remove('show'); // Remove show class from overlay
  
      // Wait for the transition to end before hiding elements
      setTimeout(() => {
        popup.style.display = 'none'; // Hide after transition
        overlay.style.display = 'none'; // Hide overlay after transition
      }, 100); // Match the timeout with the CSS transition duration
  
      this.isPopupOpen = false; // Update the popup state
    }
}  

class Toolbar_SaveFileButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const label = this.getAttribute('label') || 'Save File'; // Get the label from the attribute
      
      this.shadowRoot.innerHTML = `
        <style>
          .toolbar-openfile-button {
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
  
          .toolbar-openfile-button:hover {
            background-color: #c9c9c9;
          }
        </style>
  
        <button class="toolbar-openfile-button">${label}</button>
      `;
  
      // Add click event listener to the button to trigger the save file dialog
      const button = this.shadowRoot.querySelector('.toolbar-openfile-button');
      button.addEventListener('click', () => {
        this.openSaveFileDialog(); // Call openSaveFileDialog on button click
      });
    }
  
    async openSaveFileDialog() {
      try {
        const options = {
          suggestedName: 'myfile.txt', // Default filename
          types: [
            {
              description: 'Text Files',
              accept: { 'text/plain': ['.txt'] }, // Accept text files
            },
          ],
        };
  
        const handle = await window.showSaveFilePicker(options); // Open save file dialog
        const writable = await handle.createWritable(); // Create a writable stream
        await writable.write('Hello, world!'); // Write data to the file (example)
        await writable.close(); // Close the stream
        console.log('File saved:', handle.name);
      } catch (err) {
        console.error('Error saving file:', err);
      }
    }
}

// Register the custom element for dropdown buttons
customElements.define('toolbar-button', Toolbar_Button);
customElements.define('toolbar-checkbox-button', Toolbar_CheckboxButton);
customElements.define('toolbar-dropdown-clear', Toolbar_DropdownClear);
customElements.define('toolbar-dropdown-data', Toolbar_DropdownData);
customElements.define('toolbar-dropdown-settings', Toolbar_DropdownSettings);
customElements.define('toolbar-openfile-button', Toolbar_OpenFileButton);
customElements.define('toolbar-popup-button', Toolbar_PopupButton);
customElements.define('toolbar-savefile-button', Toolbar_SaveFileButton);


