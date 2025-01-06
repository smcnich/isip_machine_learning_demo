// create an EventBus to handle all events, removing the
// need to use the window to pass events
//
export const EventBus = new EventTarget();

// URL definitions
//
const TRAIN_URL = `${baseURL}api/train/`;

// get the component instances from the HTML document
//
const trainPlot = document.getElementById('train-plot');
const processLog = document.getElementById('process-log');

// Listen for the 'train' event emitted from AlgoTool Component
//
EventBus.addEventListener('train', (event) => {

    // get the current time for benchmarking purposes
    //
    const start = Date.now()

    // get the data from the event
    //
    const params = event.detail.params;
    const algo = event.detail.algo;
    const userID = event.detail.userID;

    // get the training data from the training plot
    //
    const plotData = trainPlot.getData();

    // send the data to the server
    // and get the response
    //
    fetch (TRAIN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userID': userID,
            'algo': algo,
            'params': params,
            'plotData': plotData
        })
    })

    // parse the response
    //
    .then((response) => {

        // if the response is ok, return the json
        //
        if (response.ok) {
            return response.json();
        }

        // otherwise, throw an error
        //
        else {
            processLog.writePlain('Model could not be trained due to a server error. Please try again.');
            throw new Error('Network response was not ok.');
        }
    })

    // get the data from the response
    //
    .then((data) => {

        // plot the decision surface on the training plot
        //
        trainPlot.decision_surface(data.decision_surface);

        // write the metrics to the process log
        //
        processLog.writeMetrics('Train', data.metrics);
    })

    // capture the time for benchmarking purposes
    //
    const end = Date.now()
    
    // log the time taken to train the model
    //
    console.log(`Train Time: ${end - start} ms`)
});
//
// end of event listener