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

// Register the custom element for dropdown buttons
//
customElements.define('toolbar-openfile-button', Toolbar_OpenFileButton);
