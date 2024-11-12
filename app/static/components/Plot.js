class Plot extends HTMLElement {
    /*
    class: Template

    description:
     This class is meant to act as a template for creating custom web components.
     It extends the HTMLElement class and creates a shadow root for encapsulation.

     If you want to create a new component, copy this template and make your component
     with it. Just change the name of the class and the name of the file to match the
     name of your component. Also, make sure to change the name of the custom element
     at the end of this file.

     Feel free to add any additional methods or properties to your component as needed.
    */

    constructor() {
      /*
      method: Template::constructor

      args:
       None

      returns:
       Template instance

      description:
       This is the constructor for the Template class. It initializes the component 
       and creates a shadow root. It gets the HTML and CSS for the component that
       should be in the same directory as this file.
      */

      // Call the parent constructor (HTMLElement)
      super();

      // get the name of the class
      this.name = this.constructor.name;
    }
    //
    // end of method
  
    async connectedCallback() {
      /*
      method: Template::connectedCallback

      args:
       None

      return:
       None

      description:
       This method is called when the component is added to the DOM.
      */

      // render the component to the webpage
      this.render();

      // add event listener for when the website loads to create an empty
      // plot
      //
      window.addEventListener('DOMContentLoaded', () => {
        this.plot_empty();
      })

      // add an event listener for when a file is loaded to plot the data
      //
      window.addEventListener('file-loaded', (event) => {
        this.plot(event.detail);
      });

      // event listener for resizing the plot
      //
      window.addEventListener('resize', () => {
        const update = {
          width: this.parentElement.clientWidth - 50,
          height: this.parentElement.clientHeight - 50
        };
        Plotly.relayout(plotDiv, update);
      });
    }
    //
    // end of method

    plot_empty() {
      /*
      method: Plot::plot+empty

      args:
       None
      
      return:
       None

      desciption:
       creates an empty plotly plot.
      */

      // get the plot div
      //
      const plotDiv = this.querySelector('#plot');

      // set configuration data
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

      // set layout data
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

      // create the plot
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

      // get the plot div
      //
      const plotDiv = this.querySelector('#plot');

      // iterate over the data and create a trace for each label
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

      // set configuration data
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

      // set layout data
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

      // create the plot
      //
      Plotly.newPlot(plotDiv, plot_data, layout, config);
    }
  //
  // end of method
  
    render() {
      /*
      method: Template::render
      
      args:
       None

      return:
       None

      description:
       This method renders the component to the webpage by setting the innerHTML of the
       shadow root to what is in the string below.
      */

       // WRITE YOUR HTML AND CSS HERE
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

  // Register the custom element so it can be used in the wepage HTML
  customElements.define('plot-card', Plot); 