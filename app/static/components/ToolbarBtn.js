class ToolbarBtn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  async connectedCallback() {
    this.render();
    this.addClickEvents();
    document.addEventListener('click', this.handleOutsideClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick(event) {
    if (!this.shadowRoot.contains(event.target)) {
      this.closeAllDropdowns();
    }
  }

  closeAllDropdowns() {
    // Close all dropdowns and remove the 'active' class from all buttons
    this.shadowRoot.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.style.display = 'none';
    });
    this.shadowRoot.querySelectorAll('.menubutton').forEach(button => {
      button.classList.remove('active');
    });
  }

  addClickEvents() {
    const buttons = this.shadowRoot.querySelectorAll('.menubutton');

    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();  // Prevent the click from bubbling to the window

        const dropdown = button.nextElementSibling;

        // Toggle dropdown visibility
        if (dropdown) {
          const isVisible = dropdown.style.display === 'block';

          // Close all other dropdowns and deactivate buttons
          this.closeAllDropdowns();

          // If the dropdown was not already visible, open it and mark the button as active
          if (!isVisible) {
            dropdown.style.display = 'block';
            button.classList.add('active');
          }
        } else {
          // Close all if it's just a button without a dropdown
          this.closeAllDropdowns();
        }
      });
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Global Styles */
        body {
          margin: 0;
          padding: 0;
        }

        /* Toolbar Styles */
        .toolbar {
          background-color: #FFFFFF;
          display: flex;
          padding: 0;
          width: 100vw;
          box-sizing: border-box;
          border-bottom: #c9c9c9 1px solid;
          border-top: #c9c9c9 1px solid;
        }

        /* Menu and Dropdown Styles */
        .menu {
          position: relative;
          display: inline-block;
        }

        /* Dropdown default state */
        .dropdown {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background-color: white;
          min-width: 150px;
          border: 1px solid #ccc;
        }

        /* Dropdown Button Styles */
        .dropdownbutton {
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

        .dropdownbutton:hover {
          background-color: #c9c9c9
        }

        .separator {
          border-bottom: 1px solid #ccc; // Thin line
        }

        /* Menu Button Styles */
        .menubutton {
          background-color: #FFFFFF;
          color: #464646;
          font-family: 'Inter', sans-serif;
          font-weight: 100;
          font-size: 1em;
          padding: 5px 20px;
          margin: 0 10px;
          border: none;
          border-bottom: 2px solid #FFFFFF;
          cursor: pointer;
        }

        /* Hover Effect */
        .menubutton:hover {
          color: #808080;
          border-bottom: 2px solid #808080; /* Gray border when hovered */
        }

        /* Active button: stays purple after being clicked */
        .menubutton.active {
          color: #7441BA;
          border-bottom: 2px solid #7441BA;
          font-weight: bold;
        }

      </style>

      <div class="toolbar">
        <div class="menu">
          <button class="menubutton">File</button>
          <div class="dropdown">
            <button class="dropdownbutton">Load Train Data</button>
            <button class="dropdownbutton separator">Load Eval Data</button>
            <button class="dropdownbutton">Save Train As...</button>
            <button class="dropdownbutton separator">Save Eval As...</button>
            <button class="dropdownbutton">Load Model</button>
            <button class="dropdownbutton separator">Load Parameters</button>
            <button class="dropdownbutton">Save Model As...</button>
            <button class="dropdownbutton">Save Parameters As...</button>
          </div>
        </div>

        <div class="menu">
          <button class="menubutton">Edit</button>
          <div class="dropdown">
            <button class="dropdownbutton separator">Settings</button>
            <button class="dropdownbutton">Clear Process Log</button>
            <button class="dropdownbutton">Clear Train</button>
            <button class="dropdownbutton">Clear Eval</button>
            <button class="dropdownbutton separator">Clear All</button>
            <button class="dropdownbutton">Reset</button>
          </div>
        </div>

        <div class="menu">
          <button class="menubutton">View</button>
          <div class="dropdown">
            <button class="dropdownbutton">Print Confusion Matrix</button>
          </div>
        </div>

        <div class="menu">
          <button class="menubutton">Classes</button>
          <div class="dropdown">
            <button class="dropdownbutton">Add Class</button>
            <button class="dropdownbutton">Delete Class</button>
          </div>
        </div>

        <div class="menu">
          <button class="menubutton">Patterns</button>
          <div class="dropdown">
            <button class="dropdownbutton">Draw Points</button>
            <button class="dropdownbutton">Draw Gaussian</button>
          </div>
        </div>

        <div class="menu">
          <button class="menubutton">Data</button>
          <div class="dropdown">
            <button class="dropdownbutton">Two Gaussian</button>
            <button class="dropdownbutton">Four Gaussian</button>
            <button class="dropdownbutton">Overlapping Gaussian</button>
            <button class="dropdownbutton">Two Ellipses</button>
            <button class="dropdownbutton">Four Ellipses</button>
            <button class="dropdownbutton">Rotated Ellipses</button>
            <button class="dropdownbutton">Toroidal</button>
            <button class="dropdownbutton">Yin-Yang</button>
          </div>
        </div>

        <div class="menu">
          <button class="menubutton">Help</button>
        </div>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('toolbar-btn', ToolbarBtn);
