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

    // get the plotId from the attribute to determine what data the specific instance plots
    //
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

      // get the axis of the layout to send
      //
      this.data.layout = {
        xaxis: this.layout.xaxis.range,
        yaxis: this.layout.yaxis.range
      };

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
      } else {
        return;
      }

      const end = Date.now()
      const start = event.detail.data.start
      console.log(`Load Time: ${end - start} ms`)
    });

    window.addEventListener('clearPlot', (event) => {
    
      // empty the plot when the clear buttons are selected
      //
      if ((event.detail.plotId == this.plotId) || (event.detail.plotId == null)) {
        
        // clear entire plot if select data or all
        //
        if ((event.detail.type == 'all') || event.detail.type == 'data'){
          this.plot_empty();
        }
        // clear just decision surface if select results
        if (event.detail.type == 'results'){
          this.clear_decision_surface();
        }
      }
    
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
    let defaultColors = null;

    // old default colors
    //

    if (data.colors == null) {

      // Create a mapping for unique labels to colors
      //
      let colorMapping = {};
      let colorArray = [];
      let colorIndex = 0;

      // get default color values from plotly
      //
      const category10 = Plotly.d3.scale.category10();

      // create array format of default colors
      //
      for (let i = 0; i < 10; i++) {
        colorArray.push(category10(i));
      }

      // Assign a unique color to each label
      //
      data.labels.forEach((label) => {
          if (!(label in colorMapping)) {
              colorMapping[label] = colorArray[colorIndex % colorArray.length];
              colorIndex++;
          }
      });

      // Define the defaultColors function to return the color for a label
      //
      defaultColors = (label) => colorMapping[label];

      // set plot colors value
      //
      this.data.colors = colorArray.slice(0, Object.keys(colorMapping).length);

    } else {

      // create a mapping for unique labels to colors
      //
      let colorMapping = {};
      let colorIndex = 0;

      // create color array and filter out empty strings
      //
      let colorArray = data.colors;
      
      // Filter out empty strings
      if (Array.isArray(colorArray)) {
        colorArray = colorArray.filter(color => color !== '');
      }

      // get the number of unique labels
      //
      let numUniqueLabels = new Set(data.labels).size;

      // if not enough colors assigned (equal or less than unique labels),
      // use the default colors instead
      //
      if (colorArray.length < numUniqueLabels) {
        // get default color values from plotly
        //
        const category10 = Plotly.d3.scale.category10();

        // create array format of default colors
        //
        for (let i = 0; i < numUniqueLabels; i++) {
          colorArray.push(category10(i));
        }
      }

      // assign a unique color to each label
      //
      data.labels.forEach((label) => {
        if (!(label in colorMapping)) {
          colorMapping[label] = colorArray[colorIndex % colorArray.length];
          colorIndex++;
        }
      })

      // set the default colors to the header colors
      //
      defaultColors = (label) => colorMapping[label];

      // set plot colors value
      //
      this.data.colors = this.data.colors.slice(0, Object.keys(colorMapping).length);
    }
    
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
            color: defaultColors(label)
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

    // dispatch an event to the algoTool to update the plot status
    // of the current plot. this will effect which buttons are enabled
    // in the algoTool
    //
    window.dispatchEvent(new CustomEvent('plotChange', {
      detail: {
        plotId: this.plotId,
        status: false
      }
    }));
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

    // check if the layout data is null, if so, use the default layout values
    //
    if (this.data.layout != null) {
      // get the axis values from the data
      //
      const xaxis = this.data.layout.xaxis;
      const yaxis = this.data.layout.yaxis;

      // update this.layout with new axis values
      //
      this.layout.xaxis.range = xaxis;
      this.layout.yaxis.range = yaxis;
    }

    // Create the plot with data
    //
    Plotly.newPlot(plotDiv, this.plotData, this.layout, this.config);

    // dispatch an event to the algoTool to update the plot status
    // of the current plot
    //
    window.dispatchEvent(new CustomEvent('plotChange', {
      detail: {
        plotId: this.plotId,
        status: true
      }
    }));
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

    // clear the decision surface
    //
    this.clear_decision_surface();

    // Get the plot div element
    //
    const plotDiv = this.querySelector('#plot');

    // Retrieve colors from scatter plots
    //
    let colorScale = []
    for (let i = 0; i < this.plotData.length; i++) {

      // Get the color of the marker and convert it to RGBA to make it transparent
      // then add to the custom color scale
      //
      let color = hexToRGBA(this.plotData[i].marker.color, 0.2);
      colorScale.push(color);
    }

    // Data for the contour plot
    //
    const contourData = {
      z: data.z,
      x: data.x,
      y: data.y,
      type: 'contour',
      contours: {
        coloring: 'heatmap',
      },
      line: {
        smoothing: 1
      },
      name: 'Decision Surface',
      showscale: false,
      hoverinfo: 'none',
      colorscale: colorScale.map((color, index) => [index / (colorScale.length - 1), color]),
      showlegend: true
    };

    // add the contour data to the plot data
    //
    this.plotData = this.plotData.concat(contourData);

    // update the plot to add the decision surface
    //
    Plotly.react(plotDiv, this.plotData, this.layout, this.config);
  }

  get_decision_surface() {
    /*
    method: Plot::get_decision_surface

    args:
     None

    return:
     z (Array): the z values of the decision surface
     x (Array): the x values of the decision surface
     y (Array): the y values of the decision surface

    description:
     This method returns the z, x, and y values of the decision surface.
     This is useful for saving the decision surface to a file or replotting
     the surface on another plot
    */

    // Get the contour trace from the plot data
    //
    const contourTrace = this.plotData.find(trace => trace.type === 'contour');

    // If the contour trace is not found, return null
    //
    if (!contourTrace) {
      return null;
    }

    // Return the z, x, and y values of the contour trace
    //
    return {
      z: contourTrace.z,
      x: contourTrace.x,
      y: contourTrace.y
    };
  }
  //
  // end of method

  clear_decision_surface() {
    /*
    method: Plot::clear_decision_surface

    args:
    None

    return:
    None

    description:
    This method removes the decision surface from the plot.
    */

    // Get the plot div element
    //
    const plotDiv = this.querySelector('#plot');

    // remove the contour data from the plot data
    //
    this.plotData = this.plotData.filter(trace => trace.type !== 'contour');

    // update the plot to remove the decision surface
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

function hexToRGBA(hex, alpha) {
  // Ensure the input hex starts with #
  if (!hex.startsWith("#")) {
      throw new Error("Invalid hex color format. It must start with #.");
  }

  // Clamp alpha between 0 and 1
  alpha = Math.min(1, Math.max(0, alpha));

  // Expand shorthand hex (e.g., #RGB to #RRGGBB)
  if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  // Convert hex to RGB
  const num = parseInt(hex.slice(1), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  // Return RGBA string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Register the custom element
//
customElements.define('plot-card', Plot); 