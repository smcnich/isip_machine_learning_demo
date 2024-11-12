class MuCovTwo extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });
    this.isPopupOpen = false;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const shape = this.getAttribute('shape') || 'two-gaussian';

    this.shadowRoot.innerHTML = `
      <style>
        .form-container{
          display: flex;
          flex-direction: column;
        }

        .num-container {
          border: 2px solid #ccc;
          padding: 0.4vw;
          border-radius: 0.4vw;
          width: 21.75vw;
          margin: 0 0 0.1vw;
        }     

        .num-container label {
          padding-left: 0.5vw;
          font-family: 'Inter', sans-serif;
          font-size: 1em;
          font-weight: bold;
          margin-bottom: 0.3vw;
          display: block;
        }

        .num-input input {
          padding: 0.4vw;
          border: 1px solid #ccc;
          border-radius: 0.4vw;
          font-family: 'Inter', sans-serif;
          font-size: 0.75em;
          box-sizing: border-box;
          width: 100%;
        }

        .mu-cov-container {
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
          font-family: 'Inter', sans-serif;
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
          font-family: 'Inter', sans-serif;
          font-size: 0.75em;
          box-sizing: border-box;
          width: 100%;
        }

        /* Remove margin for the last input */
        .mu-input input:last-child, .cov-input-column1 input:last-child, .cov-input-column2 input:last-child {
          margin-bottom: 0;
        }

        input:focus{
          border-color: #7441BA;  /* Purple color */
          border-width: 2px;      /* Add this to make the focus effect more noticeable */
          outline: none; 
        }

        .button-container {
          display: flex;
          justify-content: space-between;
          gap: 0.5vw;
          max-width: 23vw;
          margin: 1vh 0.15vw 0.5vh;
        }

        .button, .reset {
          flex: 1; /* Makes each button take up equal width */
          padding: 0.2vh 0.4vw;
          border-radius: 1vw; /* Makes buttons rounded */
          background-color: #4CAF50; /* Sets button background color */
          color: white;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 1em;
        }

        .button:hover, .reset:hover {
          background-color: #45a049;
          border: 1.5px solid black;
        }
      </style>

      <form>
        <div class="form-container">
          <div class="num-container">
            <label>Number of Points</label>
            <div class="num-input">
              <input type="number" placeholder="Enter Number of Points" id="numPoints">
            </div>
          </div>

          <div class="mu-cov-container">
            <div class="mu-container">
              <label>Mu (1st)</label>
              <div class="mu-input">
                <input type="number" placeholder="Value 1" id="mu1-1">
                <input type="number" placeholder="Value 2" id="mu1-2">
              </div>
            </div>
            <div class="cov-container">
              <label>Cov (1st)</label>
              <div class="cov-input">
                <div class="cov-input-column1">
                  <input type="number" placeholder="Value 1" id="cov1-1">
                  <input type="number" placeholder="Value 2" id="cov1-2">
                </div>
                <div class="cov-input-column2">
                  <input type="number" placeholder="Value 3" id="cov1-3">
                  <input type="number" placeholder="Value 4" id="cov1-4">
                </div>
              </div>
            </div>
          </div>

          <div class="mu-cov-container">
            <div class="mu-container">
              <label>Mu (2nd)</label>
              <div class="mu-input">
                <input type="number" placeholder="Value 1" id="mu2-1">
                <input type="number" placeholder="Value 2" id="mu2-2">
              </div>
            </div>
            <div class="cov-container">
              <label>Cov (2nd)</label>
              <div class="cov-input">
                <div class="cov-input-column1">
                  <input type="number" placeholder="Value 1" id="cov2-1">
                  <input type="number" placeholder="Value 2" id="cov2-2">
                </div>
                <div class="cov-input-column2">
                  <input type="number" placeholder="Value 3" id="cov2-3">
                  <input type="number" placeholder="Value 4" id="cov2-4">
                </div>
              </div>
            </div>
          </div>

          <div class="button-container">
            <button type="button" class="button" id="presetButton">Presets</button>
            <button type="reset" class="reset">Clear</button>
            <button type="submit" class="button">Submit</button>
          </div>
        </div>
      </form>
    `;

    // Define presets for different shapes
    const presets = {
        "two-gaussian": {
            "numPoints": 10000,
            "mu1-1": -0.5000, "mu1-2": 0.5000,
            "cov1-1": 0.0250, "cov1-2": 0.0000, "cov1-3": 0.0000, "cov1-4": 0.0250,
            "mu2-1": 0.5000, "mu2-2": -0.5000,
            "cov2-1": 0.0250, "cov2-2": 0.0000, "cov2-3": 0.0000, "cov2-4": 0.0250
        },
        "overlapping-gaussian": {
            "numPoints": 10000,
            "mu1-1": -0.1400, "mu1-2": 0.1400,
            "cov1-1": 0.0250, "cov1-2": 0.0000, "cov1-3": 0.0000, "cov1-4": 0.0250,
            "mu2-1": 0.1400, "mu2-2": 0.1400,
            "cov2-1": 0.0250, "cov2-2": 0.0000, "cov2-3": 0.0000, "cov2-4": 0.0250
        },
        "two-ellipses": {
            "numPoints": 10000,
            "mu1-1": -0.5000, "mu1-2": 0.5000,
            "cov1-1": 0.0333, "cov1-2": 0.0000, "cov1-3": 0.0000, "cov1-4": 0.0043,
            "mu2-1": 0.5000, "mu2-2": -0.5000,
            "cov2-1": 0.0333, "cov2-2": 0.0000, "cov2-3": 0.0000, "cov2-4": 0.0043
        },
        "rotated-ellipses": {
            "numPoints": 10000,
            "mu1-1": -0.5000, "mu1-2": 0.5000,
            "cov1-1": 0.0333, "cov1-2": 0.0000, "cov1-3": 0.0000, "cov1-4": 0.0043,
            "mu2-1": 0.5000, "mu2-2": -0.5000,
            "cov2-1": 0.0043, "cov2-2": 0.0000, "cov2-3": 0.0000, "cov2-4": 0.0333
        }
        // Add additional shapes and their presets as needed
    };

    // Event listener to populate inputs with preset values based on the shape
    this.shadowRoot.querySelector("#presetButton").addEventListener("click", () => {
        const selectedPreset = presets[shape];
        if (selectedPreset) {
            Object.keys(selectedPreset).forEach(id => {
                const input = this.shadowRoot.getElementById(id);
                if (input) input.value = selectedPreset[id];
            });
        } else {
            console.warn(`No preset found for shape: ${shape}`);
        }
    });
  }
}

class MuCovFour extends HTMLElement {
    constructor () {
      super();
      this.attachShadow({ mode: 'open' });
      this.isPopupOpen = false;
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const shape = this.getAttribute('shape') || 'four-gaussian';

      this.shadowRoot.innerHTML = `
        <style>
          .form-container{
            display: flex;
            flex-direction: column;
            gap: 0.5vh;
          }
  
          .num-container {
            border: 2px solid #ccc;
            padding: 0.4vw;
            border-radius: 0.4vw;
            width: 21.75vw;
            margin: 0 0 0.1vw;
          }     
  
          .num-container label {
            padding-left: 0.5vw;
            font-family: 'Inter', sans-serif;
            font-size: 1em;
            font-weight: bold;
            margin-bottom: 0.3vw;
            display: block;
          }
  
          .num-input input {
            padding: 0.4vw;
            border: 1px solid #ccc;
            border-radius: 0.4vw;
            font-family: 'Inter', sans-serif;
            font-size: 0.75em;
            box-sizing: border-box;
            width: 100%;
          }
  
          .mu-cov-container {
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
            font-family: 'Inter', sans-serif;
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
            font-family: 'Inter', sans-serif;
            font-size: 0.75em;
            box-sizing: border-box;
            width: 100%;
          }
  
          /* Remove margin for the last input */
          .mu-input input:last-child, .cov-input-column1 input:last-child, .cov-input-column2 input:last-child {
            margin-bottom: 0;
          }
  
          input:focus{
            border-color: #7441BA;  /* Purple color */
            border-width: 2px;      /* Add this to make the focus effect more noticeable */
            outline: none; 
          }
  
          .button-container {
            display: flex;
            justify-content: space-between;
            gap: 0.5vw;
            max-width: 23vw;
            margin: 1vh 0.15vw 0.5vh;
          }
  
          .button, .reset {
            flex: 1; /* Makes each button take up equal width */
            padding: 0.2vh 0.4vw;
            border-radius: 1vw; /* Makes buttons rounded */
            background-color: #4CAF50; /* Sets button background color */
            color: white;
            border: none;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-size: 1em;
          }
  
          .button:hover, .reset:hover {
            background-color: #45a049;
            border: 1.5px solid black;
          }
        </style>
  
        <form>
        <div class="form-container">
          <div class="num-container">
            <label>Number of Points</label>
            <div class="num-input">
              <input type="number" placeholder="Enter Number of Points" id="numPoints">
            </div>
          </div>

          <div class="mu-cov-container">
            <div class="mu-container">
              <label>Mu (1st)</label>
              <div class="mu-input">
                <input type="number" placeholder="Value 1" id="mu1-1">
                <input type="number" placeholder="Value 2" id="mu1-2">
              </div>
            </div>

            <div class="cov-container">
              <label>Cov (1st)</label>
              <div class="cov-input">
                <div class="cov-input-column1">
                  <input type="number" placeholder="Value 1" id="cov1-1">
                  <input type="number" placeholder="Value 2" id="cov1-2">
                </div>
                <div class="cov-input-column2">
                  <input type="number" placeholder="Value 3" id="cov1-3">
                  <input type="number" placeholder="Value 4" id="cov1-4">
                </div>
              </div>
            </div>
          </div>

          <div class="mu-cov-container">
            <div class="mu-container">
              <label>Mu (2nd)</label>
              <div class="mu-input">
                <input type="number" placeholder="Value 1" id="mu2-1">
                <input type="number" placeholder="Value 2" id="mu2-2">
              </div>
            </div>

            <div class="cov-container">
              <label>Cov (2nd)</label>
              <div class="cov-input">
                <div class="cov-input-column1">
                  <input type="number" placeholder="Value 1" id="cov2-1">
                  <input type="number" placeholder="Value 2" id="cov2-2">
                </div>
                <div class="cov-input-column2">
                  <input type="number" placeholder="Value 3" id="cov2-3">
                  <input type="number" placeholder="Value 4" id="cov2-4">
                </div>
              </div>
            </div>
          </div>

          <div class="mu-cov-container">
            <div class="mu-container">
              <label>Mu (3rd)</label>
              <div class="mu-input">
                <input type="number" placeholder="Value 1" id="mu3-1">
                <input type="number" placeholder="Value 2" id="mu3-2">
              </div>
            </div>

            <div class="cov-container">
              <label>Cov (3rd)</label>
              <div class="cov-input">
                <div class="cov-input-column1">
                  <input type="number" placeholder="Value 1" id="cov3-1">
                  <input type="number" placeholder="Value 2" id="cov3-2">
                </div>
                <div class="cov-input-column2">
                  <input type="number" placeholder="Value 3" id="cov3-3">
                  <input type="number" placeholder="Value 4" id="cov3-4">
                </div>
              </div>
            </div>
          </div>

          <div class="mu-cov-container">
            <div class="mu-container">
              <label>Mu (4th)</label>
              <div class="mu-input">
                <input type="number" placeholder="Value 1" id="mu4-1">
                <input type="number" placeholder="Value 2" id="mu4-2">
              </div>
            </div>

            <div class="cov-container">
              <label>Cov (4th)</label>
              <div class="cov-input">
                <div class="cov-input-column1">
                  <input type="number" placeholder="Value 1" id="cov4-1">
                  <input type="number" placeholder="Value 2" id="cov4-2">
                </div>
                <div class="cov-input-column2">
                  <input type="number" placeholder="Value 3" id="cov4-3">
                  <input type="number" placeholder="Value 4" id="cov4-4">
                </div>
              </div>
            </div>
          </div>

          <div class="button-container">
            <button type="button" class="button" id="presetButton">Presets</button>
            <button type="reset" class="reset">Clear</button>
            <button type="submit" class="button">Submit</button>
          </div>

        </div>
        </form>

        `;
      
        // Define presets for different shapes
        const presets = {
            "four-gaussian": {
                "numPoints": 10000,
                "mu1-1": -0.5000, "mu1-2": 0.5000,
                "cov1-1": 0.0250, "cov1-2": 0.0000, "cov1-3": 0.0000, "cov1-4": 0.0250,
                "mu2-1": 0.5000, "mu2-2": -0.5000,
                "cov2-1": 0.0250, "cov2-2": 0.0000, "cov2-3": 0.0000, "cov2-4": 0.0250,
                "mu3-1": -0.5000, "mu3-2": -0.5000,
                "cov3-1": 0.0250, "cov3-2": 0.0000, "cov3-3": 0.0000, "cov3-4": 0.0250,
                "mu4-1": 0.5000, "mu4-2": 0.5000,
                "cov4-1": 0.0250, "cov4-2": 0.0000, "cov4-3": 0.0000, "cov4-4": 0.0250
            },
            "four-ellipses": {
                "numPoints": 10000,
                "mu1-1": -0.5000, "mu1-2": 0.5000,
                "cov1-1": 0.0333, "cov1-2": 0.0000, "cov1-3": 0.0000, "cov1-4": 0.0043,
                "mu2-1": 0.5000, "mu2-2": -0.5000,
                "cov2-1": 0.0333, "cov2-2": 0.0000, "cov2-3": 0.0000, "cov2-4": 0.0043,
                "mu3-1": -0.5000, "mu3-2": -0.5000,
                "cov3-1": 0.0333, "cov3-2": 0.0000, "cov3-3": 0.0000, "cov3-4": 0.0043,
                "mu4-1": 0.5000, "mu4-2": 0.5000,
                "cov4-1": 0.0333, "cov4-2": 0.0000, "cov4-3": 0.0000, "cov4-4": 0.0043
            }
        };

        // Event listener to populate inputs with preset values based on the shape
        this.shadowRoot.querySelector("#presetButton").addEventListener("click", () => {
            const selectedPreset = presets[shape];
            if (selectedPreset) {
                Object.keys(selectedPreset).forEach(id => {
                    const input = this.shadowRoot.getElementById(id);
                    if (input) input.value = selectedPreset[id];
                });
            } else {
                console.warn(`No preset found for shape: ${shape}`);
            }
        });

    }
}

class MuCovToroidal extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });
    this.isPopupOpen = false;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .form-container{
          display: flex;
          flex-direction: column;
        }

        .num-container {
          border: 2px solid #ccc;
          padding: 0.4vw;
          border-radius: 0.4vw;
          width: 21.75vw;
          margin: 0 0 0.1vw;
        }     

        .num-container label {
          padding-left: 0.5vw;
          font-family: 'Inter', sans-serif;
          font-size: 1em;
          font-weight: bold;
          margin-bottom: 0.3vw;
          display: block;
        }

        .num-input input, .two-num-input input {
          padding: 0.4vw;
          border: 1px solid #ccc;
          border-radius: 0.4vw;
          font-family: 'Inter', sans-serif;
          font-size: 0.75em;
          box-sizing: border-box;
          width: 100%;
        }

        .two-num-input {
          display: flex;
          gap: 0.5vw;
        }

        .mu-cov-container {
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
          font-family: 'Inter', sans-serif;
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
          font-family: 'Inter', sans-serif;
          font-size: 0.75em;
          box-sizing: border-box;
          width: 100%;
        }

        /* Remove margin for the last input */
        .mu-input input:last-child, .cov-input-column1 input:last-child, .cov-input-column2 input:last-child {
          margin-bottom: 0;
        }

        input:focus{
          border-color: #7441BA;  /* Purple color */
          border-width: 2px;      /* Add this to make the focus effect more noticeable */
          outline: none; 
        }

        .button-container {
          display: flex;
          justify-content: space-between;
          gap: 0.5vw;
          max-width: 23vw;
          margin: 1vh 0.15vw 0.5vh;
        }

        .button, .reset {
          flex: 1; /* Makes each button take up equal width */
          padding: 0.2vh 0.4vw;
          border-radius: 1vw; /* Makes buttons rounded */
          background-color: #4CAF50; /* Sets button background color */
          color: white;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 1em;
        }

        .button:hover, .reset:hover {
          background-color: #45a049;
          border: 1.5px solid black;
        }
      </style>

      <form>
        <div class="form-container">
          <div class="num-container">
            <label>Number of Points</label>
            <div class="num-input">
              <input type="number" placeholder="Enter Number of Points" id="numPoints">
            </div>
          </div>

          <div class="num-container">
            <label>Number of Points (Ring)</label>
            <div class="num-input">
              <input type="number" placeholder="Enter Number of Points" id="numPointsRing">
            </div>
          </div>

          <div class="num-container">
            <label>Inner and Outer Radius (Ring)</label>
            <div class="two-num-input">
              <input type="number" placeholder="Value 1" id="InnerRadius">
              <input type="number" placeholder="Value 2" id="OuterRadius">
            </div>
          </div>


          <div class="mu-cov-container">
            <div class="mu-container">
              <label>Mu (1st)</label>
              <div class="mu-input">
                <input type="number" placeholder="Value 1" id="mu1-1">
                <input type="number" placeholder="Value 2" id="mu1-2">
              </div>
            </div>
            <div class="cov-container">
              <label>Cov (1st)</label>
              <div class="cov-input">
                <div class="cov-input-column1">
                  <input type="number" placeholder="Value 1" id="cov1-1">
                  <input type="number" placeholder="Value 2" id="cov1-2">
                </div>
                <div class="cov-input-column2">
                  <input type="number" placeholder="Value 3" id="cov1-3">
                  <input type="number" placeholder="Value 4" id="cov1-4">
                </div>
              </div>
            </div>
          </div>

          <div class="button-container">
            <button type="button" class="button" id="presetButton">Presets</button>
            <button type="reset" class="reset">Clear</button>
            <button type="submit" class="button">Submit</button>
          </div>
        </div>
      </form>
    `;

    const presetValues = {
        "numPoints": 10000,
        "numPointsRing": 2000,
        "InnerRadius": 0.65,
        "OuterRadius": 0.85,
        "mu1-1": 0.0000, "mu1-2": 0.0000,
        "cov1-1": 0.0083, "cov1-2": 0.0000, "cov1-3": 0.0000, "cov1-4": 0.0083,
      };
  
      // Event listener to populate inputs with preset values
      this.shadowRoot.querySelector("#presetButton").addEventListener("click", () => {
        Object.keys(presetValues).forEach(id => {
          const input = this.shadowRoot.getElementById(id);
          if (input) input.value = presetValues[id];
        });
      });
    }

}

class NumPtsYinYang extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.isPopupOpen = false;
      }
    
      connectedCallback() {
        this.render();
      }
    
      render() {
        this.shadowRoot.innerHTML = `
          <style>
            .form-container{
              display: flex;
              flex-direction: column;
            }
    
            .num-container {
              border: 2px solid #ccc;
              padding: 0.4vw;
              border-radius: 0.4vw;
              width: 21.75vw;
              margin: 0 0 0.1vw;
            }     
    
            .num-container label {
              padding-left: 0.5vw;
              font-family: 'Inter', sans-serif;
              font-size: 1em;
              font-weight: bold;
              margin-bottom: 0.3vw;
              display: block;
            }
    
            .num-input input {
              padding: 0.4vw;
              border: 1px solid #ccc;
              border-radius: 0.4vw;
              font-family: 'Inter', sans-serif;
              font-size: 0.75em;
              box-sizing: border-box;
              width: 100%;
            }
    
            input:focus{
              border-color: #7441BA;  /* Purple color */
              border-width: 2px;      /* Add this to make the focus effect more noticeable */
              outline: none; 
            }
    
            .button-container {
              display: flex;
              justify-content: space-between;
              gap: 0.5vw;
              max-width: 23vw;
              margin: 1vh 0.15vw 0.5vh;
            }
    
            .button, .reset {
              flex: 1; /* Makes each button take up equal width */
              padding: 0.2vh 0.4vw;
              border-radius: 1vw; /* Makes buttons rounded */
              background-color: #4CAF50; /* Sets button background color */
              color: white;
              border: none;
              cursor: pointer;
              font-family: 'Inter', sans-serif;
              font-size: 1em;
            }
    
            .button:hover, .reset:hover {
              background-color: #45a049;
              border: 1.5px solid black;
            }
          </style>
    
          <form>
            <div class="form-container">
              <div class="num-container">
                <label>Number of Points (Yin)</label>
                <div class="num-input">
                  <input type="number" placeholder="Enter Number of Points" id="numPointsYin">
                </div>
              </div>

              <div class="num-container">
                <label>Number of Points (Yang)</label>
                <div class="num-input">
                  <input type="number" placeholder="Enter Number of Points" id="numPointsYang">
                </div>
              </div>

              <div class="num-container">
                <label>Radius</label>
                <div class="num-input">
                  <input type="number" placeholder="Enter Radius" id="radius">
                </div>
              </div>
    
              <div class="button-container">
                <button type="button" class="button" id="presetButton">Presets</button>
                <button type="reset" class="reset">Clear</button>
                <button type="submit" class="button">Submit</button>
              </div>
            </div>
          </form>
        `;
    
        const presetValues = {
            "numPointsYin": 2000,
            "numPointsYang": 2000,
            "radius": 2
          };
      
          // Event listener to populate inputs with preset values
          this.shadowRoot.querySelector("#presetButton").addEventListener("click", () => {
            Object.keys(presetValues).forEach(id => {
              const input = this.shadowRoot.getElementById(id);
              if (input) input.value = presetValues[id];
            });
          });
        }
}

customElements.define('mu-cov-two', MuCovTwo);
customElements.define('mu-cov-four', MuCovFour);
customElements.define('mu-cov-toroidal', MuCovToroidal);
customElements.define('num-pts-yinyang', NumPtsYinYang);