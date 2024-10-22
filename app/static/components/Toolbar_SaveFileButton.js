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
customElements.define('toolbar-savefile-button', Toolbar_SaveFileButton);
