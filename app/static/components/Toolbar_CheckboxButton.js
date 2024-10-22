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

// Register the custom element for the checkbox button
customElements.define('toolbar-checkbox-button', Toolbar_CheckboxButton);
