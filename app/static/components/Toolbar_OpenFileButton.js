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

// Register the custom element for dropdown buttons
customElements.define('toolbar-openfile-button', Toolbar_OpenFileButton);
