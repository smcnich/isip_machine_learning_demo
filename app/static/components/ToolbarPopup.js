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

customElements.define('toolbar-popup-button', Toolbar_PopupButton);
