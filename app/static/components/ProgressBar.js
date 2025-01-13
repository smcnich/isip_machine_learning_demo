class ProgressBar extends HTMLElement {
  /*
  class: ProgressBar

  description:
   This class defines a custom web component for a progress bar that can be filled to
   a specific percentage. The progress bar will also display the current percentage value
   in the middle of the bar. The fill color will change based on the input percentage.
  */

  constructor() {
    /*
    method: ProgressBar::constructor

    args:
     None

    returns:
     ProgressBar instance

    description:
     Initializes the ProgressBar component, creating a shadow root for encapsulated styles
     and markup, and stores the component name in a `name` property.
    */

    // Call the parent constructor (HTMLElement)
    //
    super();

    // Create a shadow root for the component
    //
    this.attachShadow({ mode: 'open' });

    // Set the component's name property
    //
    this.name = this.constructor.name;
  }

  async connectedCallback() {
    /*
    method: ProgressBar::connectedCallback

    args:
     None

    return:
     None

    description:
     Called when the component is added to the DOM, triggering the `render` method to
     inject the HTML and CSS into the shadow root.
    */

    // Render the component to the webpage
    //
    this.render();
  }

  render() {
    /*
    method: ProgressBar::render
    
    args:
     None

    return:
     None

    description:
     Renders the HTML and CSS for the ProgressBar component by setting the shadow root's
     `innerHTML`. This defines the layout and appearance of the component.
    */

    this.shadowRoot.innerHTML = `
      <style>
        /* Basic styling for the progress bar container */
        .progress-bar-container {
          width: 100%;
          height: 18px;
          background-color: #e0e0e0;
          border-radius: 20px;
          position: relative;
        }

        /* The progress fill inside the bar */
        .progress-fill {
          height: 100%;
          width: 0;
          background-color: #4caf50; /* Default color */
          border-radius: 20px;
          transition: width 0.3s ease-in-out;
        }

        /* The percentage label in the center */
        .percentage {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Inter', sans-serif;
          font-weight: bold;
          color: #000;
          font-size: 13px;
        }
      </style>

      <div class="progress-bar-container">
        <div class="progress-fill" id="progressFill"></div>
        <div class="percentage" id="percentageLabel">0%</div>
      </div>
    `;
  }

  setProgress(percentage) {
    /*
    method: ProgressBar::setProgress

    args:
     percentage (Number): A number between 0 and 100 indicating the progress.

    returns:
     None

    description:
     Updates the width of the progress bar based on the input percentage.
     The fill color will change depending on the percentage.
    */

    // Ensure percentage is between 0 and 100
    //
    percentage = Math.min(100, Math.max(0, percentage));

    // get the elements for the label and fill for dynamic changing
    //
    const progressFill = this.shadowRoot.getElementById('progressFill');
    const percentageLabel = this.shadowRoot.getElementById('percentageLabel');

    // Set the width of the progress fill based on the percentage
    //
    progressFill.style.width = `${percentage}%`;

    // Change the color based on the percentage
    //
    if (percentage <= 30) {
      progressFill.style.backgroundColor = '#f44336'; // Red for low progress
    } else if (percentage <= 70) {
      progressFill.style.backgroundColor = '#ff9800'; // Orange for medium progress
    } else {
      progressFill.style.backgroundColor = '#4caf50'; // Green for high progress
    }

    // Display the percentage in the middle of the progress bar
    //
    percentageLabel.textContent = `${percentage}%`;
  }
}

// Register the custom element
//
customElements.define('progress-bar', ProgressBar);
