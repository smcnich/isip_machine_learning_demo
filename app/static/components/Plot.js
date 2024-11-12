class Plot extends HTMLElement {
  /*
  class: Plot

  description:
   This class is designed to serve as a template for creating custom web components.
   It extends the HTMLElement class and creates a shadow root for encapsulation.

   To create a new component, copy this template and adjust the class and file names 
   to match the desired component. Also, change the custom element name at the 
   end of this file.

   Additional methods and properties may be added as needed.
  */

  constructor() {
    /*
    method: Plot::constructor

    args:
     None

    returns:
     Plot instance

    description:
     This is the constructor for the Plot class. It initializes the component, 
     creating a shadow root and getting the class name for reference.
    */

    // Call the parent constructor (HTMLElement)
    //
    super();

    // get the name of the class
    //
    this.name = this.constructor.name;
  }
  //
  // end of method

  async connectedCallback() {
    /*
    method: Plot::connectedCallback

    args:
     None

    return:
     None

    description:
     This method is called when the component is added to the DOM. It renders the
     component and sets up event listeners for plot creation and updates.
    */

    // Render the component to the webpage
    //
    this.render();
    this.plotId = this.getAttribute('plotId');

    // Add event listener to create an empty plot when the website loads
    //
    window.addEventListener('DOMContentLoaded', () => {
      this.plot_empty();
    })

    // Add event listener to plot data when a file is loaded
    //
    window.addEventListener('file-loaded', (event) => {
      if(event.detail.plotId == this.plotId) {
        this.plot(event.detail);
      }
    });

    // Event listener for resizing the plot
    //
    window.addEventListener('resize', () => {
      const update = {
        width: this.parentElement.clientWidth - 50,
        height: this.parentElement.clientHeight - 50
      };
      Plotly.relayout(update);
    });
  }
  //
  // end of method

  plot_empty() {
    /*
    method: Plot::plot_empty

    args:
     None
    
    return:
     None

    desciption:
     creates an empty plotly plot.
    */

    // Get the plot div element
    //
    const plotDiv = this.querySelector('#plot');

    // Set configuration data for Plotly
    //
    const config = {
      displayLogo: false,
      modeBarButtonsToRemove: ['zoom2d', 'select2d', 'lasso2d', 'toggleSpikelines', 
                               'hoverClosestCartesian', 'hoverCompareCartesian',
                               'autoScale2d'],
      responsive: true,
      showLink: false,
      cursor: 'pointer'
    };

    // Set layout data for Plotly
    //
    const layout = {
      autosize: true,
      dragmode: false,
      xaxis: {
        range: [-1, 1],
        dtick: 0.25,
        zeroline: false,
        showline: true,
      },
      yaxis: {
        range: [-1, 1],
        dtick: 0.25,
        zeroline: false,
        showline: true,
      },
      margin: { 
        t: 10,
        b: 64, // this value perfectly makes the bottom margin equal to when the legend is there
        l: 40,
        r: 10
      },
      width: this.parentElement.clientWidth - 50,
      height: this.parentElement.clientHeight - 50
    };

    // Create the empty plot
    //
    Plotly.newPlot(plotDiv, [], layout, config);
  }

  plot(data) {
    /*
    method: Plot::plot

    args:
     data (Object): an object containing the data to plot.
                    ex: 
                        {
                          labels: ['label1', 'label2'],
                          x: [[1, 2, 3], [4, 5, 6]],
                          y: [[1, 2, 3], [4, 5, 6]]
                        }
    
    return:
     None

    desciption:
     creates a plotly plot with the data provided.
    */

    // Get the plot div element
    //
    const plotDiv = this.querySelector('#plot');

    // Prepare plot data by creating a trace for each label
    //
    let plot_data = []
    for (let i = 0; i < data.labels.length; i++) {
      const trace = {
        x: data.x[i],
        y: data.y[i],
        mode: 'markers',
        type: 'scattergl',
        name: data.labels[i],
        marker: { size: 2 },
        hoverinfo: 'none'
      }

      plot_data.push(trace);
    };

    // Set configuration data for Plotly
    //
    const config = {
      displayLogo: false,
      modeBarButtonsToRemove: ['zoom2d', 'select2d', 'lasso2d', 'toggleSpikelines', 
                               'hoverClosestCartesian', 'hoverCompareCartesian',
                               'autoScale2d'],
      responsive: true,
      showLink: false,
      cursor: 'pointer'
    };

    // Set layout data for Plotly
    //
    const layout = {
      autosize: true,
      dragmode: false,
      xaxis: {
        range: [-1, 1],
        dtick: 0.25,
        zeroline: false,
        showline: true,
      },
      yaxis: {
        range: [-1, 1],
        dtick: 0.25,
        zeroline: false,
        showline: true,
      },
      legend: {
        x: 0.5,
        y: -0.2,
        xanchor: 'center',
        yanchor: 'bottom',
        orientation: 'h'
      },
      margin: { 
        t: 10,
        b: 10,
        l: 40,
        r: 10
      },
      width: this.parentElement.clientWidth - 50,
      height: this.parentElement.clientHeight - 50
    };

    // Create the plot with data
    //
    Plotly.newPlot(plotDiv, plot_data, layout, config);
  }
//
// end of method

  render() {
    /*
    method: Plot::render
    
    args:
     None

    return:
     None

    description:
     This method renders the component to the webpage by setting the innerHTML of the
     shadow root with the defined HTML and CSS content.
    */

    // Define HTML and CSS structure for the component
    //
    this.innerHTML = `
      <style>
        .js-plotly-plot .plotly .cursor-crosshair {
          cursor: default;
        }

        .modebar {
          display: flex;
          flex-direction: row;
        }
      </style>

      <div id="plot"></div>
    `;
  }
  //
  // end of method

}
//
// end of class

// Register the custom element
//
customElements.define('plot-card', Plot); 