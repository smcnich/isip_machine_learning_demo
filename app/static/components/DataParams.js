class FormContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  async connectedCallback() {

    const params = await this.fetch_params();
    if (params) {
      this.render(params);
      // Use the params as needed.
    }
  }

  async fetch_params() {
    try {
      const response = await fetch('/api/get_data_params');
      if (!response.ok) {
        throw new Error('HTTP error: Status: ${response.status}');
      }
      const data = await response.json();
      const key = this.getAttribute('key') || 'two_gaussian';
      const params = data[key]?.params;
      
      return params;

    } catch (error) {
      console.error('Failed to fetch parameters:', error);
    }
  }

  generate_container(name, dimensions, defaultValues) {
    const [rows, cols] = (dimensions || '1,1').split(',').map(Number);

    let inputsHTML = '';
    let index = 1;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const defaultValue = parseFloat(defaultValues[index - 1] || 0).toFixed(4); // Ensure default values have 4 decimals
        inputsHTML += `
          <input 
            type="number" 
            placeholder="Value ${index}" 
            value="${defaultValue}" 
            oninput="this.value = parseFloat(this.value || 0).toFixed(4)" 
            onblur="this.value = parseFloat(this.value || 0).toFixed(4)"
          >
        `;
        index++;
      }
    }

    const container = document.createElement('div');
    container.className = 'num-container';

    const label = document.createElement('label');
    label.textContent = name;

    const inputDiv = document.createElement('div');
    inputDiv.className = 'num-input';

    // Apply grid layout dynamically
    inputDiv.style.display = 'grid';
    inputDiv.style.gridTemplateColumns = `repeat(${cols}, 1fr)`; // Dynamically set grid columns
    inputDiv.style.gap = '0.5vw'; // Space between inputs

    inputDiv.innerHTML = inputsHTML;

    container.appendChild(label);
    container.appendChild(inputDiv);

    return container.outerHTML;

  }

  render(params) {
    this.shadowRoot.innerHTML = '';

    let inputsHTML = '';
    
    // Helper function to handle the iteration for input and group types
    const processParam = (param) => {
      const { type } = param;

      // If the parameter is of type 'input'
      if (type === 'input') {
        return this.generate_container(param.name, param.dimensions, param.default);
      }

      // If the parameter is of type 'group' and has nested params
      if (type === 'group' && param.params) {
        // Create a div for the group container
        let groupHTML = '<div class="group-container" style="display: flex;">'; // Use flexbox and wrap

        // Iterate over nested params inside the group and process each one
        for (const [nestedKey, nestedParam] of Object.entries(param.params)) {
          groupHTML += processParam(nestedParam);  // Recursively process each nested parameter
        }

        groupHTML += '</div>';  // Close the group container
        return groupHTML;  // Return the group HTML
      }

      return '';  // Return an empty string if no valid type is found
    };

    // Iterate over top-level params
    for (const [key, param] of Object.entries(params)) {
      inputsHTML += processParam(param);  // Process each parameter, including nested ones
    }

    // Attach styles and inputs
    this.shadowRoot.innerHTML = `
      <style>
        .form-container {
          display: flex;
          flex-direction: column;
        }
      
        .num-container {
          border: 2px solid #ccc;
          padding: 0.4vw;
          border-radius: 0.4vw;
          width: 100%;
          margin: 0.4vh 0.15vw 0.1vw;
          box-sizing: border-box;
        }

        .num-container label {
          padding-left: 0.5vw;
          font-family: 'Inter', sans-serif;
          font-size: 0.9em;
          font-weight: bold;
          margin-bottom: 0.3vw;
          display: block;
        }

        .num-input {
          display: grid;
          gap: 0.5vw;
        }

        input {
          padding: 0.4vw;
          border: 1px solid #ccc;
          border-radius: 0.4vw;
          font-size: 0.75em;
          box-sizing: border-box;
          width: 100%;
        }

        input:focus {
          border-color: #7441BA;
          border-width: 2px;
          outline: none;
        }
      </style>
      <div class="form-container">
        ${inputsHTML}
      </div>
    `; 
  }
}

class DataPopup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.isPopupOpen = false;
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
    
  }    
  
  render() {
    const label = this.getAttribute('label') || 'Button';
    const key = this.getAttribute('key') || 'two_gaussian';

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
          width: 25vw; /* Set a fixed width */
          max-width: 90%; /* Allow the width to shrink if needed */
          max-height: 80vh; /* Limit the height to 80% of the viewport height */
          padding: 15px;
          padding-top: 10px;
          padding-bottom: 10px;
          background-color: white;
          border-radius: 15px; /* Rounded corners */
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 1000; /* Ensure it's on top */
          opacity: 0; /* Start fully transparent */
          transition: opacity 0.1s ease, transform 0.2s ease; /* Transition for opening/closing */
          overflow: auto; /* Allow scrolling inside the popup if the content overflows */
        }

        .popup.show {
          display: block; /* Show when needed */
          opacity: 1; /* Fully opaque when shown */
          transform: translate(-50%, -50%) scale(1); /* Scale to original size */
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

        .button-container {
          display: flex;
          justify-content: space-between;
          gap: 0.5vw;
          width: 100%;
          margin: 1vh 0 0.1vw;
        }
  
        .button, .reset {
          flex: 1; /* Makes each button take up equal width */
          padding: 0.2vh 0.4vw;
          border-radius: 1vw; /* Makes buttons rounded */
          background-color: #4CAF50; /* Sets button background color */
          color: white;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 1em;
        }
  
        .button:hover, .reset:hover {
          background-color: #2a732e;
        }

      </style>

      <button class="toolbar-popup-button">${label}</button>
      <div class="overlay" id="overlay"></div>
      <div class="popup" id="popup">
        <button class="close-btn" id="close-btn">X</button>
        <h2>Set ${label} Parameters</h2>
        <form-container key="${key}"></form-container>
        <form id="data-form">
          <div class="button-container">
            <button type="button" class="button" id="presetButton">Presets</button>
            <button type="reset" class="reset" id="clearButton">Clear</button>
            <button type="submit" class="button">Submit</button>
          </div>

        </form>      
      </div>
    `;

    // Get elements
    const button = this.shadowRoot.querySelector('.toolbar-popup-button');
    const popup = this.shadowRoot.getElementById('popup');
    const overlay = this.shadowRoot.getElementById('overlay');
    const closeBtn = this.shadowRoot.getElementById('close-btn');

    // Show the popup when clicking the button
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      this.togglePopup();
    });

    // Close the popup when clicking the close button
    closeBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      this.closePopup();
    });

    // Add a global click listener to close the popup if clicked outside
    document.addEventListener('click', (event) => {
      if (this.isPopupOpen && !this.contains(event.target)) {
        this.closePopup();
      }
    });

    // Stop event propagation on popup to avoid closing when clicking inside it
    popup.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  async getDefaults(key) {
    try {
      // Fetch the JSON data from the /data_json route
      const response = await fetch('/api/get_data_params');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json(); // Parse the response as JSON
  
      // Initialize an array to store default values
      let defaultValues = [];
  
      // Check if the given key exists in the data and process its parameters
      if (data[key] && data[key].params) {
        function traverseParams(params) {
          for (const key in params) {
            if (params[key].type === 'input' && params[key].default) {
              // If it's an input and has a default, add it to the list
              defaultValues = defaultValues.concat(params[key].default);
            } else if (params[key].type === 'group' && params[key].params) {
              // If it's a group, recurse into the params
              traverseParams(params[key].params);
            }
          }
        }
  
        // Start traversing from the params of the given key
        traverseParams(data[key].params);
      }
  
      // Return the default values as a comma-separated string
      return defaultValues.join(', ');
  
    } catch (error) {
      console.error('Error fetching data:', error);
      return '';
    }
  }

  addEventListeners() {
    const clearButton = this.shadowRoot.querySelector('#clearButton');
    const presetButton = this.shadowRoot.querySelector('#presetButton');
    
    clearButton.addEventListener('click', () => {
      this.resetInputs();
    });
    presetButton.addEventListener('click', async () => {
      const key = this.getAttribute('key');
      const presets = await this.getDefaults(key);
      this.fillPresets(presets);
    });
  }

  resetInputs() {
    const components = this.shadowRoot.querySelectorAll('form-container');
    components.forEach(componenets => {
      const inputs = componenets.shadowRoot.querySelectorAll('input');
      inputs.forEach(input => {
        input.value = '';
      });
    });
  }

  fillPresets(presetValues) {
    // If presetValues is a string, split and parse it to convert it to an array of numbers
    if (typeof presetValues === 'string') {
      presetValues = presetValues.split(',').map(value => parseFloat(value.trim()));
    }
  
    const components = this.shadowRoot.querySelectorAll('form-container');
    let valueIndex = 0; // Track position in presetValues array
  
    components.forEach(component => {
      const inputs = component.shadowRoot.querySelectorAll('input');
      
      inputs.forEach(input => {
        if (valueIndex < presetValues.length) {
          input.value = parseFloat(presetValues[valueIndex]).toFixed(4); // Set input value from presetValues array
          valueIndex++;
        }
      });
    });
  }  

  togglePopup() {
    const popup = this.shadowRoot.getElementById('popup');
    const overlay = this.shadowRoot.getElementById('overlay');

    this.isPopupOpen = !this.isPopupOpen;

    if (this.isPopupOpen) {
      popup.classList.add('show');
      overlay.classList.add('show');
      popup.style.display = 'block';
      overlay.style.display = 'block';
    } else {
      this.closePopup();
    }
  }

  closePopup() {
    const popup = this.shadowRoot.getElementById('popup');
    const overlay = this.shadowRoot.getElementById('overlay');

    popup.classList.remove('show');
    overlay.classList.remove('show');

    setTimeout(() => {
      popup.style.display = 'none';
      overlay.style.display = 'none';
    }, 100);

    this.isPopupOpen = false;
  }
}

class DataButton extends HTMLElement {
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
    const key = this.getAttribute('key') || 'two_gaussian';

    this.shadowRoot.innerHTML = `
      <style>
        .toolbar-item {
          position: relative; /* Anchor point for the dropdown menu */
          display: inline-block; /* Keep button and dropdown aligned per instance */
        }

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
          width: 100%;
          white-space: nowrap;
          text-align: left;
        }

        .toolbar-button::after {
          content: '';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent transparent black;
        }

        .toolbar-button:hover,
        .toolbar-button.active {
          background-color: #c9c9c9;
        }

        .header {
          color: black;
          font-family: 'Inter', sans-serif;
          font-weight: bold;
          font-size: 1em;
          padding: 5px 30px;
          margin: 0;
          white-space: nowrap;
          cursor: default;
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          top: 0;
          left: calc(100% + 0.7px); /* Align to the right of the toolbar-item container */
          background-color: white;
          z-index: 1000;
          min-width: 150px;
          border: 1px solid #ccc;
        }

        .dropdown-menu.show {
          display: block;
        }

        .dropdown-item {
          background-color: white;
          color: black;
          font-family: 'Inter', sans-serif;
          font-weight: 100;
          font-size: 1em;
          padding: 5px 20px;
          cursor: pointer;
          white-space: nowrap;
          text-align: left;
        }

        .dropdown-item:hover {
          background-color: #c9c9c9;
        }
      </style>

      <div class="toolbar-item">
        <button class="toolbar-button">${label}</button>
        <div class="dropdown-menu" id="dropdown-menu">
          <h1 class="header">Set Parameters</h1>
          <data-popup label="Train" key="${key}"></data-popup>
          <data-popup label="Eval" key="${key}"></data-popup>
        </div>
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

customElements.define('form-container', FormContainer);
customElements.define('data-popup', DataPopup);
customElements.define('data-button', DataButton);
