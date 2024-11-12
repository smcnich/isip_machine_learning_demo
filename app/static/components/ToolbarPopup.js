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

class Toolbar_PopupButton_MuCovTwo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isPopupOpen = false; // Track the popup state
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const label = this.getAttribute('label') || 'Button';
    const shape = this.getAttribute('shape') || 'two-gaussian';

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
          width: 23vw;
          height: 48vh; /* Increased height */
          padding: 20px;
          background-color: white;
          border-radius: 15px; /* Rounded corners */
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 1000; /* Ensure it's on top */
          opacity: 0; /* Start fully transparent */
          transition: opacity 0.1s ease, transform 0.1s ease; /* Transition for opening/closing */
        }

        .popup.show {
          display: block; /* Show when needed */
          opacity: 1; /* Fully opaque when shown */
          transform: translate(-50%, -50%) scale(1); /* Scale to original size */
        }

        .popup h2 {
          margin: 0 0 1.5vh 0;
          font-family: 'Inter', sans-serif;
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
        <h2>Set ${label} Parameters</h2>
        <mu-cov-two shape=${shape}></mu-cov-two>
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

    // Close the popup when clicking outside of it
    document.addEventListener('click', (event) => {
      // Check if the click is outside the popup and not on the button itself
      const clickedOutside = !popup.contains(event.target) && !button.contains(event.target);

      if (this.isPopupOpen && clickedOutside) {
        this.closePopup();
      }
    });

    // Stop event propagation on popup to avoid closing when clicking inside it
    popup.addEventListener('click', (event) => {
      event.stopPropagation();
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

class Toolbar_PopupButton_MuCovFour extends HTMLElement {
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
    const shape = this.getAttribute('shape') || 'four-gaussian';

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
          width: 23vw;
          height: 79vh; /* Increased height */
          padding: 20px;
          background-color: white;
          border-radius: 15px; /* Rounded corners */
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 1000; /* Ensure it's on top */
          opacity: 0; /* Start fully transparent */
          transition: opacity 0.1s ease, transform 0.1s ease; /* Transition for opening/closing */
        }

        .popup.show {
          display: block; /* Show when needed */
          opacity: 1; /* Fully opaque when shown */
          transform: translate(-50%, -50%) scale(1); /* Scale to original size */
        }

        .popup h2 {
          margin: 0 0 1.5vh 0;
          font-family: 'Inter', sans-serif;
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
        <h2>Set ${label} Parameters</h2>
        <mu-cov-four shape=${shape}></mu-cov-four>
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

    // Close the popup when clicking outside of it
    document.addEventListener('click', (event) => {
      // Check if the click is outside the popup and not on the button itself
      const clickedOutside = !popup.contains(event.target) && !button.contains(event.target);

      if (this.isPopupOpen && clickedOutside) {
        this.closePopup();
      }
    });

    // Stop event propagation on popup to avoid closing when clicking inside it
    popup.addEventListener('click', (event) => {
      event.stopPropagation();
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

class Toolbar_PopupButton_Toroidal extends HTMLElement {
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
          width: 23vw;
          height: 54vh; /* Increased height */
          padding: 20px;
          background-color: white;
          border-radius: 15px; /* Rounded corners */
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 1000; /* Ensure it's on top */
          opacity: 0; /* Start fully transparent */
          transition: opacity 0.1s ease, transform 0.1s ease; /* Transition for opening/closing */
        }

        .popup.show {
          display: block; /* Show when needed */
          opacity: 1; /* Fully opaque when shown */
          transform: translate(-50%, -50%) scale(1); /* Scale to original size */
        }

        .popup h2 {
          margin: 0 0 1.5vh 0;
          font-family: 'Inter', sans-serif;
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
        <h2>Set ${label} Parameters</h2>
        <mu-cov-toroidal></mu-cov-toroidal>
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

    // Close the popup when clicking outside of it
    document.addEventListener('click', (event) => {
      // Check if the click is outside the popup and not on the button itself
      const clickedOutside = !popup.contains(event.target) && !button.contains(event.target);

      if (this.isPopupOpen && clickedOutside) {
        this.closePopup();
      }
    });

    // Stop event propagation on popup to avoid closing when clicking inside it
    popup.addEventListener('click', (event) => {
      event.stopPropagation();
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

class Toolbar_PopupButton_YinYang extends HTMLElement {
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
          width: 23vw;
          height: 39vh; /* Increased height */
          padding: 20px;
          background-color: white;
          border-radius: 15px; /* Rounded corners */
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 1000; /* Ensure it's on top */
          opacity: 0; /* Start fully transparent */
          transition: opacity 0.1s ease, transform 0.1s ease; /* Transition for opening/closing */
        }

        .popup.show {
          display: block; /* Show when needed */
          opacity: 1; /* Fully opaque when shown */
          transform: translate(-50%, -50%) scale(1); /* Scale to original size */
        }

        .popup h2 {
          margin: 0 0 1.5vh 0;
          font-family: 'Inter', sans-serif;
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
        <h2>Set ${label} Parameters</h2>
        <num-pts-yinyang></num-pts-yinyang>
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

    // Close the popup when clicking outside of it
    document.addEventListener('click', (event) => {
      // Check if the click is outside the popup and not on the button itself
      const clickedOutside = !popup.contains(event.target) && !button.contains(event.target);

      if (this.isPopupOpen && clickedOutside) {
        this.closePopup();
      }
    });
    
    // Stop event propagation on popup to avoid closing when clicking inside it
    popup.addEventListener('click', (event) => {
      event.stopPropagation();
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

customElements.define('toolbar-popup-button', Toolbar_PopupButton);
customElements.define('toolbar-popup-button-mucovtwo', Toolbar_PopupButton_MuCovTwo);
customElements.define('toolbar-popup-button-mucovfour', Toolbar_PopupButton_MuCovFour);
customElements.define('toolbar-popup-button-toroidal', Toolbar_PopupButton_Toroidal);
customElements.define('toolbar-popup-button-yinyang', Toolbar_PopupButton_YinYang);


