class MuCov extends HTMLElement {
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

    this.shadowRoot.innerHTML = `
      <style>
        /* Container for arranging elements */
        .container {
          display: flex;
        }

        /* Style for each container */
        .mu-container {
          border: 2px solid #ccc;
          padding: 0.4vw;
          border-radius: 0.4vw;
          width: 7vw;
          margin: 0.4vh 0.15vw 0.1vw;
        }
      
        /* Style for each container */
        .cov-container {
          border: 2px solid #ccc;
          padding: 0.4vw;
          border-radius: 0.4vw;
          width: 14vw;
          margin: 0.4vh 0.15vw 0.1vw;
        }

        /* Label styling */
        .mu-container label, .cov-container label {
          padding-left: 0.5vw;
          font-size: 1em;
          font-weight: bold;
          margin-bottom: 0.3vw;
          display: block;
        }

        /* Stacking input boxes vertically */
        .mu-input {
          display: flex;
          flex-direction: column;
        }

        .cov-input {
          display: flex;
          gap: 0.5vw;
        }

        /* Input styling */
        .mu-input input, .cov-input-column1 input, .cov-input-column2 input {
          padding: 0.4vw;
          margin-bottom: 0.4vw; /* Space between stacked input boxes */
          border: 1px solid #ccc;
          border-radius: 0.4vw;
          font-size: 0.75em;
          box-sizing: border-box;
          width: 100%;
        }

        /* Remove margin for the last input */
        .mu-input input:last-child, .cov-input-column1 input:last-child, .cov-input-column2 input:last-child {
          margin-bottom: 0;
        }

        input:focus {
          border-color: #7441BA;  /* Purple color */
          border-width: 2px;      /* Add this to make the focus effect more noticeable */
          outline: none; 
        }

      </style>

      <div class="container">

        <div class="mu-container">
          <label>Mu ${label}</label>
          <div class="mu-input">
            <input type="number" placeholder="Value 1">
            <input type="number" placeholder="Value 2">
          </div>
        </div>

        <div class="cov-container">
          <label>Cov ${label}</label>
          <div class="cov-input">
            <div class="cov-input-column1">
              <input type="number" placeholder="Value 1">
              <input type="number" placeholder="Value 2">
            </div>
            <div class="cov-input-column2">
              <input type="number" placeholder="Value 3">
              <input type="number" placeholder="Value 4">
            </div>
          </div>
        </div>

      </div>
    `;
  }

}

class NumPts extends HTMLElement {
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

    this.shadowRoot.innerHTML = `
      <style>
        .num-container {
          border: 2px solid #ccc;
          padding: 0.4vw;
          border-radius: 0.4vw;
          width: 21.75vw;
          margin: 0.4vh 0.15vw 0.1vw;
        }     

        .num-container label {
          padding-left: 0.5vw;
          font-size: 1em;
          font-weight: bold;
          margin-bottom: 0.3vw;
          display: block;
        }

        .num-input input {
          padding: 0.4vw;
          border: 1px solid #ccc;
          border-radius: 0.4vw;
          font-size: 0.75em;
          box-sizing: border-box;
          width: 100%;
        }

        input:focus {
          border-color: #7441BA;  /* Purple color */
          border-width: 2px;      /* Add this to make the focus effect more noticeable */
          outline: none; 
        }
      </style>
      
      <div class="num-container">
        <label>${label}</label>
        <div class="num-input">
          <input type="number" placeholder="Value 1">
        </div>
      </div>
    `;
  }

}

class TwoRadius extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isPopupOpen = false; // Track the popup state
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .num-container {
          border: 2px solid #ccc;
          padding: 0.4vw;
          border-radius: 0.4vw;
          width: 21.75vw;
          margin: 0.4vh 0.15vw 0.1vw;
        }     

        .num-container label {
          padding-left: 0.5vw;
          font-size: 1em;
          font-weight: bold;
          margin-bottom: 0.3vw;
          display: block;
        }

        .num-input {
          display: flex;
          gap: 0.5vw;
        }

        .num-input input {
          padding: 0.4vw;
          border: 1px solid #ccc;
          border-radius: 0.4vw;
          font-size: 0.75em;
          box-sizing: border-box;
          width: 100%;
        }
          
        input:focus {
          border-color: #7441BA;  /* Purple color */
          border-width: 2px;      /* Add this to make the focus effect more noticeable */
          outline: none; 
        }

      </style>
      
      <div class="num-container">
        <label>Inner and Outer Radius (Ring)</label>
        <div class="num-input">
          <input type="number" placeholder="Value 1">
          <input type="number" placeholder="Value 2">
        </div>
      </div>
    `;
  }

}

class ParamButtons extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isPopupOpen = false; // Track the popup state
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .num-container {
          border: 2px solid #ccc;
          padding: 0.4vw;
          border-radius: 0.4vw;
          width: 21.75vw;
          margin: 0.4vh 0.15vw 0.1vw;
        }     

        .num-container label {
          padding-left: 0.5vw;
          font-size: 1em;
          font-weight: bold;
          margin-bottom: 0.3vw;
          display: block;
        }

        .num-input {
          display: flex;
          gap: 0.5vw;
        }

        .num-input input {
          padding: 0.4vw;
          border: 1px solid #ccc;
          border-radius: 0.4vw;
          font-size: 0.75em;
          box-sizing: border-box;
          width: 100%;
        }
          
        input:focus {
          border-color: #7441BA;  /* Purple color */
          border-width: 2px;      /* Add this to make the focus effect more noticeable */
          outline: none; 
        }

      </style>
      
      <div class="num-container">
        <label>Inner and Outer Radius (Ring)</label>
        <div class="num-input">
          <input type="number" placeholder="Value 1">
          <input type="number" placeholder="Value 2">
        </div>
      </div>
    `;
  }

}

customElements.define('mu-cov', MuCov);
customElements.define('num-pts', NumPts);
customElements.define('two-radius', TwoRadius);
customElements.define('param-buttons', ParamButtons)
