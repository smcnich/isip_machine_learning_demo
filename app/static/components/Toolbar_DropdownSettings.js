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

// Register the custom element for dropdown buttons
customElements.define('toolbar-dropdown-settings', Toolbar_DropdownSettings);
