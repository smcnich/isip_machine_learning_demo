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

// Register the custom element for dropdown buttons
customElements.define('toolbar-button', Toolbar_Button);
