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

          .toolbar-item {
            position: relative;
            display: inline-block;
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
        
        <div class="toolbar-item">
          <button class="toolbar-button">${label}</button>
          <div class="dropdown-menu" id="dropdown-menu">
            <toolbar-button label="Clear Data"></toolbar-button>
            <toolbar-button label="Clear Results"></toolbar-button>
            <toolbar-button label="Clear All"></toolbar-button>
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
      const layoutType = this.getAttribute('layout') || 'mucovtwo'; // Dynamically choose the layout
      const shape = this.getAttribute('shape');

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
            <div id="dropdown-content"></div>
          </div>
        </div>

      `;

      const dropdownContent = this.shadowRoot.getElementById('dropdown-content');
      this.insertLayout(layoutType, dropdownContent, shape);
    }

    insertLayout(layoutType, container, shape) {

      const mucovtwo = `
        <toolbar-popup-button-mucovtwo label="Train" shape=${shape}></toolbar-popup-button-mucovtwo>
        <toolbar-popup-button-mucovtwo label="Eval" shape=${shape}></toolbar-popup-button-mucovtwo>
      `;

      const mucovfour = `
        <toolbar-popup-button-mucovfour label="Train" shape=${shape}></toolbar-popup-button-mucovfour>
        <toolbar-popup-button-mucovfour label="Eval" shape=${shape}></toolbar-popup-button-mucovfour>
      `;

      const toroidal = `
        <toolbar-popup-button-toroidal label="Train"></toolbar-popup-button-toroidal>
        <toolbar-popup-button-toroidal label="Eval"></toolbar-popup-button-toroidal>
      `;

      const yinyang = `
        <toolbar-popup-button-yinyang label="Train"></toolbar-popup-button-yinyang>
        <toolbar-popup-button-yinyang label="Eval"></toolbar-popup-button-yinyang>
      `;

      if (layoutType == 'mucovfour') {
        container.innerHTML = mucovfour;
      } else if (layoutType == 'toroidal') {
        container.innerHTML = toroidal;
      } else if (layoutType == 'yinyang') {
        container.innerHTML = yinyang;
      } else {
        container.innerHTML = mucovtwo;
      }

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

          .toolbar-item {
            position: relative;
            display: inline-block;
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

        <div class="toolbar-item">
          <button class="toolbar-button">${label}</button>
          <div class="dropdown-menu" id="dropdown-menu">
            <toolbar-popup-button label="Set Ranges"></toolbar-popup-button>
            <toolbar-popup-button label="Set Gaussian"></toolbar-popup-button>
            <toolbar-popup-button label="Set Color"></toolbar-popup-button>
            <toolbar-checkbox-button label="Normalize Data"></toolbar-checkbox-button>
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
    //
    const button = this.shadowRoot.querySelector('.toolbar-openfile-button');
    button.addEventListener('click', () => {
      this.plotId = this.getAttribute('plotId');
      this.fileInput.click()
    });
  }
  handleFileSelect(event) {
    /*
    method: Toolbar_OpenFileButton::handleFileSelect
    
    args:
     event: the event listener event
    
     returns:
     None
    
     description:
     This method is called when a file is selected. It reads the file and
     dispatches a custom event with the loaded file data.
    */
    
     // Get the selected file
    //
    const file = event.target.files[0];
    
    // if the file is valid
    //
    if (file) {
    
      // create a filereader object
      //
      const reader = new FileReader();
    
      // when the reader is called (i.e. when the file is read)
      //
      reader.onload = (e) => {
    
        // get the text from the file
        //
        const text = e.target.result;
    
        // split the text into rows, filter out comments, and split the rows into columns
        //
        const rows = text.split("\n")
                     .filter(row => !row.trim().startsWith("#"))             
                     .map(row => row.split(","));
                    
        // Create an object to store grouped data
        //
        const groupedData = {};
    
        // Iterate over the rows and group data by labels
        //
        rows.forEach(row => {
    
          // get the label, x value, and y value from the row
          //
          const label = row[0];
          const xValue = parseFloat(row[1]);
          const yValue = parseFloat(row[2]);
    
          // If the label does not exist in the grouped data object, create it
          //
          if (!groupedData[label]) {
            groupedData[label] = { x: [], y: [] };
          }
    
          // Add the x and y values to the grouped data object
          //
          groupedData[label].x.push(xValue);
          groupedData[label].y.push(yValue);
        });
    
        // Convert grouped data into arrays for labels, x, and y
        //
        const labels = Object.keys(groupedData);
        const x = labels.map(label => groupedData[label].x);
        const y = labels.map(label => groupedData[label].y);
    
        // Dispatch a custom event with the loaded file data
        // the Plot.js component will be listening for this event.
        // When the event is dispatched, the Plot.js component will plot the data.
        //
        window.dispatchEvent(new CustomEvent('file-loaded', {
          detail: {
            plotId: this.plotId,
            labels: labels,
            x: x,
            y: y
          }
        }));
      };
    
      // Read the file as text, this will trigger the onload event
      //
      reader.readAsText(file);
    }
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
customElements.define('toolbar-savefile-button', Toolbar_SaveFileButton);


