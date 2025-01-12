import { EventBus } from "./Events.js";

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
          this.clear_plot()
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

  getBounds() {
    /*
    method: Plot::getBounds

    args:
     None

    return:
     Object: an object containing the x and y axis bounds of the plot

    description:
     This method returns the x and y axis bounds of the plot as it currently appears
    */

    // get the x and y axis bounds
    //
    return {
      x: this.layout.xaxis.range,
      y: this.layout.yaxis.range
    }

  }
  //
  // end of method

  getData() {
    /*
    method: Plot::getData

    args:
      None

    return:
      Object: an object containing the data that was plotted

    description:  
      This method returns the data that was plotted on the plot. This is useful for saving
      the data to a file or sending it to the backend.
    */
    return this.data;
  }
  //
  // end of method

  getDecisionSurface() {
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

  createTraces(data, colorMappings) {

    // make the all the data labels are the same
    //
    if ((data.labels.length != data.x.length) ||
        (data.x.length != data.y.length) || 
        (data.y.length != data.labels.length)) {
          
          return null;
    }
    
    // iterate over each value in the data and create a trace for each label
    //
    let traces = {};
    for (let i = 0; i < data.labels.length; i++) {
      
      // get the label of the index
      //
      let label = data.labels[i].toLowerCase();

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
            color: colorMappings[label.toLowerCase()]
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

  plot(data, colorMappings) {
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
    this.plotData = this.createTraces(this.data, colorMappings);

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
    // of the current plot. this will effect which buttons are enabled
    // in the algoTool
    //
    EventBus.dispatchEvent(new CustomEvent('stateChange'));
  }
  //
  // end of method

  clear_plot() {
    /*
    method: Plot::clear_plot

    args:
     None

    return:
     None

    description:
     This method clears the plot by removing all traces from the plot.
    */

    // Get the plot div element
    //
    const plotDiv = this.querySelector('#plot');

    // remove all traces from the plot data
    //
    this.plotData = [];

    // update the plot to remove all traces
    //
    Plotly.react(plotDiv, this.plotData, this.layout, this.config);

    // dispatch an event to the algoTool to update the plot status
    // of the current plot. this will effect which buttons are enabled
    // in the algoTool
    //
    EventBus.dispatchEvent(new CustomEvent('stateChange'));
  }

  decision_surface(data, labels) {
    /*
    method: Plot::decision_surface

    args:
     data (Object): an object containing the decision surface data in the 
                    following format:

                      {
                        z: [[0, 0, 0], [0, 0, 1], [1, 1, 1]],
                        x: [0, 1, 2],
                        y: [0, 1, 2]
                      }
     labels (Array): an array of Label objects that contain the name and color
                     of each label in the label manager

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
      
    // get all of the unique labels in the data
    //
    let uniqLabels = Array.from(new Set(data.z.flat()));

    // create a color scale for the contour plot
    // iterate over each label in the label manager
    // if the label is in the data, add its color
    // to the scale
    //
    let colorScale = [];
    labels.forEach((label) => {
      if (uniqLabels.includes(label.mapping)) {
          colorScale.push(applyAlpha(label.color, 0.2));
      }
    });

    // ensure colorScale has at least two colors
    // duplicate the single color to create a gradient
    //
    if (colorScale.length === 1) {
      colorScale.push(colorScale[0]); 
    }

    // recreate the color scale to be in the format of:
    //  [[0, <color>], [0.25, <color], ..., [1, <color>]]
    // normalize the index of each color in the scale 
    // to be between 0 and 1 as this is required by plotly
    //
    // i am not entirely sure how this works as the normalized
    // colors do not match up to the colors and mappings of the
    // label manager. but it does work
    //
    colorScale = colorScale.map((color, index) => {
      return [index / (colorScale.length - 1), color]
    });

    // Data for the contour plot
    //
    const contourData = {

      // convert the z values to numerics based on the
      // mapping
      //
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
      colorscale: colorScale,
      showlegend: true
    };

    // add the contour data to the plot data
    //
    this.plotData = this.plotData.concat(contourData);

    // update the plot to add the decision surface
    //
    Plotly.react(plotDiv, this.plotData, this.layout, this.config);

    // dispatch an event to the algoTool to update the plot status
    // of the current plot. this will effect which buttons are enabled
    // in the algoTool
    //
    EventBus.dispatchEvent(new CustomEvent('stateChange'));
  }

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
    
    // dispatch an event to the algoTool to update the plot status
    //
    EventBus.dispatchEvent(new CustomEvent('stateChange'));
  }

  traces_to_data(traces=null) {
    /*
    method: Plot::traces_to_data

    args:
     traces (Array): an array of traces to convert to data. 
                     if null, use the current plot data [default = null]

    return:
     Object: an object containing the data from the plot with 
             the following format:
              {
                labels: ['label1', 'label1', 'label2', ...],
                x: [1, 2, 3, 4, 5, 6, ...],
                y: [1, 2, 3, 4, 5, 6, ...]
              }
    
    description: 
     this method converts the plot data to a raw data object
     that can be used to save the data to a file or send it to the backend.
    */

    // if no traces are provided, use the current plot data
    //
    const plotData = traces || this.plotData;

    // create empty arrays to store the data
    //
    const labels = [], x = [], y = [];

    // iterate over each trace in the plot data
    //
    plotData.forEach((trace) => {
      
      // if the trace is a scatter plot, add the data to the arrays
      //
      if (trace.type === 'scattergl') {
        
        // iterate over each point in the trace and add the data to the arrays
        //
        for (let i = 0; i < trace.x.length; i++) {
          labels.push(trace.name);
          x.push(trace.x[i]);
          y.push(trace.y[i]);
        }
      }
    });

    // create the data object
    //
    this.data = {
      'labels': labels,
      'x': x,
      'y': y
    }

    // return the data object
    //
    return this.data;
  }
  //
  // end of method

  delete_class(label) {
    /*
    method: Plot::delete_class

    args:
      label (String): the label of the class to delete

    return:
      None

    description:
      This method removes a class from the plot.
    */

    // remove any trace with the same name as the label
    //
    this.plotData = this.plotData.filter( (trace) => {
      return trace.name.toLowerCase() !== label.toLowerCase()
    });

    // make sure to change the raw data to reflect the removed class
    //
    this.data = this.traces_to_data();

    // clear the decision surface
    // this will also update the plot with the removed class
    //
    this.clear_decision_surface();
  }
  //
  // end of method

}
//
// end of class

function applyAlpha(hex, alpha) {
  /*
  function: applyAlpha

  args:
   hex (String): the hex color code to apply the alpha to
    alpha (Number): the alpha value to apply to the hex color code
                    must be between 0 and 1 (0 = transparent, 1 = opaque)

  return:
   String: the hex color code with the alpha value applied

  description:
   this function takes a hex color code and an alpha value and returns the 
   hex color code with the alpha value applied.
  */

  try {

    // Ensure the input HEX is valid
    //
    if (!/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex)) {
      throw new TypeError("Invalid HEX color code");
    }

    // Expand shorthand HEX code (#RGB -> #RRGGBB)
    //
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }

    // Ensure alpha is between 0 and 1
    //
    if (alpha < 0 || alpha > 1) {
      throw new Error("Alpha value must be between 0 and 1");
    }

    // Convert alpha to a two-digit HEX value
    //
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, "0");

    // Return the HEX color with the alpha channel appended
    //
    return `${hex}${alphaHex}`;
  }

  // catch a type error if the hex color code is not valid
  // most likely a color name was passed in
  // so convert the color name to a hex color code
  //
  catch (TypeError) {
    return applyAlpha(colorNameToHex(hex), alpha);
  }
}

function colorNameToHex(colorName) {
  /*
  function: colorNameToHex

  args:
   colorName (String): the name of the color to convert to a hex color code

  return:
   String: the hex color code of the color name

  description:
   this function takes a color name and returns the hex color code of the 
   color name. uses HTML and CSS exploit to convert the color name to a 
   hex color code.
  */

  // create a temporary element
  //
  const tempElement = document.createElement('div');
  tempElement.style.color = colorName;
  document.body.appendChild(tempElement);

  // get the computed color value
  //
  const computedColor = getComputedStyle(tempElement).color;

  // remove the temporary element
  //
  document.body.removeChild(tempElement);

  // convert RGB to Hex
  //
  const rgb = computedColor.match(/\d+/g);
  if (rgb.length === 3) {
      const r = parseInt(rgb[0]).toString(16).padStart(2, '0');
      const g = parseInt(rgb[1]).toString(16).padStart(2, '0');
      const b = parseInt(rgb[2]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
  }

  // return null if the conversion fails
  //
  return null;
}

// register the custom element
//
customElements.define('plot-card', Plot); 