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

    // create class atrributes for plotting
    //
    this.plotData = [];
    this.data = null;

    window.addEventListener('getData', (event) => {

      // if the plotId is not the same as this plotId, return nothing
      //
      const plotId = event.detail.plotId;
      if (plotId != this.plotId) {
        return;
      }

      // get the event sender so the data can be sent back to the correct component
      //
      const sender = event.detail.ref;

      // save the data to the sender, to it can be saved to a
      // csv
      //
      sender.data = this.data;
    });

    // Add event listener to create an empty plot when the website loads
    //
    window.addEventListener('DOMContentLoaded', () => {

      // Set configuration data for Plotly
      //
      this.config = {
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
      this.layout = {
        autosize: true,
        dragmode: false,
        xaxis: {
          range: [-1, 1],
          zeroline: false,
          showline: true,
        },
        yaxis: {
          range: [-1, 1],
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

      this.plot_empty();
    })

    // Add event listener to plot data when a file is loaded
    //
    window.addEventListener('fileLoaded', (event) => {
      if(event.detail.plotId == this.plotId) {
        this.plot(event.detail.data);
      }
    });

    window.addEventListener('clearPlot', (event) => {
    
      // empty the plot when the clear buttons are selected
      //
      if ((event.detail.plotId == this.plotId) || (event.detail.plotId == null)) {
        this.plot_empty();
      }

      // TODO: make logic to clear specific parts of the plot based on
      //       on what button is sent. use event.detail.type to determine
      //       what to clear (data, results, all). currently, there is no
      //       function to clear results, so this must be done first.
    
    });

    // Event listener for resizing the plot
    //
    window.addEventListener('resize', () => {
      const update = {
        width: this.parentElement.clientWidth - 50,
        height: this.parentElement.clientHeight - 50
      };
      Plotly.relayout(this.querySelector('#plot'), update);
    });

  }
  //
  // end of method

  createTraces(data) {

    // make the all the data labels are the same
    //
    if ((data.labels.length != data.x.length) ||
        (data.x.length != data.y.length) || 
        (data.y.length != data.labels.length)) {
          
          return null;
    }

    // set the default colors for the plot based on Plotly.js default
    // colors
    //
    const defaultColors = Plotly.d3.scale.category10();

    // iterate over each value in the data and create a trace for each label
    //
    let traces = {};
    for (let i = 0; i < data.labels.length; i++) {
      
      // get the label of the index
      //
      let label = data.labels[i]

      // if the label is not a already created
      //
      if (!(label in traces)) {

        traces[label] = {
          x: [],
          y: [],
          mode: 'markers',
          type: 'scattergl',
          name: label,
          marker: { 
            size: 2, 
            color: defaultColors(i)
          },
          hoverinfo: 'none'
        }
      }

      // add the x and y values to the trace
      //
      traces[label].x.push(data.x[i]);
      traces[label].y.push(data.y[i]);
    }

    // convert the object of objects tob an array of objects
    // then return
    //
    return Object.values(traces);
  }

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

    // save the data to as null because the plot is empty
    //
    this.data = null;
    this.plotData = [];

    const layout = this.layout;
    layout.margin = { 
      t: 10,
      b: 62,
      l: 40,
      r: 10
    }

    // Get the plot div element
    //
    const plotDiv = this.querySelector('#plot');

    // Create the empty plot
    //
    Plotly.newPlot(plotDiv, this.plotData, this.layout, this.config);
  }

  plot(data) {
    /*
    method: Plot::plot

    args:
     data (Object): an object containing the data to plot.
                    ex: 
                        {
                          labels: ['label1', 'label1', 'label2', ...],
                          x: [1, 2, 3, 4, 5, 6, ...],
                          y: [1, 2, 3, 4, 5, 6, ...]
                        }
    
    return:
     None

    desciption:
     creates a plotly plot with the data provided.
    */

    // save the data to the component so it can be saved to a file
    // or sent to the backend
    //
    this.data = data;

    // Get the plot div element
    //
    const plotDiv = this.querySelector('#plot');

    // Prepare plot data by creating a trace for each label
    //
    this.plotData = this.createTraces(this.data);

    // Create the plot with data
    //
    Plotly.newPlot(plotDiv, this.plotData, this.layout, this.config);
  }
//
// end of method

decision_surface(data) {
  /*
  method: Plot::decision_surface

  args:
   None

  return:
   None

  description:
   This method creates a decision surface plot using a contour plot given Z data.
  */

  // Get the plot div element
  //
  const plotDiv = this.querySelector('#plot');

  // Retrieve colors from scatter plots
  // const scatterColors = this.plotData.map(trace => trace.marker.color);

  console.log(`x length: ${data.xx.length}`);
  console.log(`y length: ${data.yy.length}`);
  console.log(`z dimensions: ${data.z.length}x${data.z[0].length}`);

  console.log(data.xx)

  // Data for the contour plot
  const contourData = {
    x: data.xx,
    y: data.yy,
    z: data.z,
    type: 'heatmap',
    showscale: false,
    hoverinfo: 'none',
    colorscale: [
      [0, 'blue'],      // Class -1
      [1, 'red']        // Class +1
    ],
  };

  // add the contour data to the plot data
  //
  this.plotData = this.plotData.concat(contourData);

  // update the plot to add the decision surface
  //
  Plotly.react(plotDiv, this.plotData, this.layout, this.config);
}

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