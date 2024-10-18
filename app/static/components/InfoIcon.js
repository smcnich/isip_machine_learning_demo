class InfoIcon extends HTMLElement {
    constructor() {
      super();
      // Create a shadow root for the component
      this.attachShadow({ mode: 'open' });
      // Get the name of the class
      this.name = this.constructor.name;
    }
  
    async connectedCallback() {
      // Render the component to the webpage
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>  

          /* Styling for the smaller info icon */
          .info-icon {
            width: 16px; /* Smaller width */
            height: 16px; /* Smaller height */
            cursor: pointer;
            display: inline-block;
            transition: filter 0.3s, box-shadow 0.3s;
          }

          /* Hover effect to change color */
          .info-icon:hover {
            filter: invert(40%) sepia(100%) saturate(1000%) hue-rotate(180deg); /* Adjust colors to change the look */
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
            transition: opacity 0.1s ease, transform 0.3s ease; /* Transition for opening/closing */
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
  
        <!-- Overlay and Popup -->
        <div class="overlay" id="overlay"></div>
        <div class="popup" id="popup">
          <button class="close-btn" id="close-btn">X</button>
          <h2>Information</h2>
          <p>This is your popup information!</p>
        </div>
  
        <!-- Updated HTML inside the div -->
        <div>
          <img src="static/icons/info-circle-grey.svg" class="info-icon" id="info-icon"></div>
        </div>
      `;
  
      // Get elements
      const infoIcon = this.shadowRoot.getElementById('info-icon');
      const popup = this.shadowRoot.getElementById('popup');
      const overlay = this.shadowRoot.getElementById('overlay');
      const closeBtn = this.shadowRoot.getElementById('close-btn');
  
      // Show the popup when clicking the info icon
      infoIcon.addEventListener('click', () => {
        popup.classList.add('show'); // Add show class to initiate transition
        overlay.classList.add('show'); // Add show class to overlay
        popup.style.display = 'block'; // Ensure popup is displayed
        overlay.style.display = 'block'; // Ensure overlay is displayed
      });
  
      // Close the popup when clicking the close button or overlay
      closeBtn.addEventListener('click', closePopup);
      overlay.addEventListener('click', closePopup);
  
      function closePopup() {
        popup.classList.remove('show'); // Remove show class to initiate transition
        overlay.classList.remove('show'); // Remove show class from overlay
  
        // Wait for the transition to end before hiding elements
        setTimeout(() => {
          if (!popup.classList.contains('show')) {
            popup.style.display = 'none'; // Hide after transition
          }
          if (!overlay.classList.contains('show')) {
            overlay.style.display = 'none'; // Hide overlay after transition
          }
        }, 100); // Match the timeout with the CSS transition duration
      }
    }
}
  
// Register the custom element so it can be used in the webpage HTML
customElements.define('info-icon', InfoIcon);
  