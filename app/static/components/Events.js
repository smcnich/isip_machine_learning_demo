// create an EventBus to handle all events, removing the
// need to use the window to pass events
//
export const EventBus = new EventTarget();

// URL definitions
//
const TRAIN_URL = `${baseURL}api/train/`;
const EVAL_URL = `${baseURL}api/eval/`;
const LOADMODEL_URL = `${baseURL}api/load_model/`;

// get the component instances from the HTML document
//
const trainPlot = document.getElementById('train-plot');
const evalPlot = document.getElementById('eval-plot');
const processLog = document.getElementById('process-log');
const algoTool = document.getElementById('algo-tool');


// Listen for the 'train' event emitted from AlgoTool Component
//
EventBus.addEventListener('train', (event) => {
    /*
    eventListener: train

    dispatcher: AlgoTool::render

    args:
     event.detail.userID: the userID of the user

    description:
     this event listener is triggered when the user clicks the train button
     on the algo tool. the data from the train plot is sent to the server to
     be trained and the metrics are written to the process log
    */

    // get the current time for benchmarking purposes
    //
    const start = Date.now()

    // write to the process log
    //
    processLog.writePlain('Training model...');

    // get the data from the event
    //
    const params = event.detail.params;
    const algo = event.detail.algo;
    const userID = event.detail.userID;

    // get the training data from the training plot
    //
    const plotData = trainPlot.getData();

    // send the data to the server and get the response
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

        // capture the time for benchmarking purposes
        //
        const end = Date.now()
        
        // log the time taken to train the model
        //
        console.log(`Train Time: ${end - start} ms`)
    })
});
//
// end of event listener

// Listen for the 'eval' event emitted from AlgoTool Component
//
EventBus.addEventListener('eval', (event) => {
    /*
    eventListener: eval

    dispatcher: AlgoTool::render

    args:
     event.detail.userID: the userID of the user
     event.detail.params: the parameters of the algorithm
     event.detail.algo: the algorithm to be used

    description:
     this event listener is triggered when the user clicks the eval button
     on the algo tool. the data from the eval plot is sent to the server to
     be evaluated and the metrics are written to the process log
    */

    // get the current time for benchmarking purposes
    //
    const start = Date.now()

    // write to the process log
    //
    processLog.writePlain('Evaluating data...');

    // get userID from the event
    //
    const userID = event.detail.userID;

    // get the decision surface data from the train plot
    // if the data is null, print to the process log that the model could not 
    // be evaluated
    //
    const dsData = trainPlot.getDecisionSurface()
    if (dsData == null) {
        this.processLog.writePlain('Could not evaluate model. Please train the model first.');
        return null;
    }

    // plot the decision surface on the eval plot
    //
    evalPlot.decision_surface(dsData);

    // get the data from the eval plot
    //
    const plotData = evalPlot.getData();

    // send the data to the server and get the response
    //
    fetch (EVAL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userID': userID,
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
            processLog.writePlain('Data could not be evaluated due to a server error. Please try again.');
            throw new Error('Network response was not ok.');
        }
    })

    // get the data from the response
    //
    .then((data) => {

        // write the metrics to the process log
        //
        processLog.writeMetrics('Eval', data);

        // capture the time for benchmarking purposes
        //
        const end = Date.now()
        
        // log the time taken to train the model
        //
        console.log(`Train Time: ${end - start} ms`)
    });
});

EventBus.addEventListener('loadModel', (event) => {
    /*
    eventListener: loadModel

    dispatcher: ToolbarComponents::Toolbar_OpenFileButton::handleModelFileSelect

    args:
     event.detail.file: the file containing the model to be loaded

    description:
     this event listener is triggered when the user selects a model file
     to be loaded. the model file is sent to the server to be loaded and
     the decision surface is plotted on the train plot
    */

    // get the current time for benchmarking purposes
    //
    const start = Date.now()

    // get the selected model file
    //
    const file = event.detail.file;

    // if the file is valid
    if (file) {

        try {

            // write to the process log
            //
            processLog.writePlain('Loading model...');

            // clear the training plot
            //
            trainPlot.plot_empty();

            // create a new form
            // this is needed to send files to the backend
            //
            const request_body = new FormData();

            // get the x and y bounds of the plot
            //
            //
            const {x, y} = trainPlot.getBounds();

            // add the file, userID, and plot bounds to the request form
            //
            request_body.append('model', file);
            request_body.append('userID', userID);
            request_body.append('x', JSON.stringify(x));
            request_body.append('y', JSON.stringify(y));

            // send the data to the server and get the response
            //
            fetch(LOADMODEL_URL, {
                method: 'POST',
                body: request_body
            })

            // parse the response to make sure it is ok
            //
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } 
                else {
                    processLog.writePlain('Model could not be loaded due to a server error. Please try again.');
                    throw new Error('Network response was not ok.');
                }
            })

            // if the response is ok, plot the decision surface
            //
            .then((data) => {
                trainPlot.decision_surface(data);

                // write to the process log
                //
                processLog.writePlain('Model loaded successfully.');

                // capture the time for benchmarking purposes
                //
                const end = Date.now()
                
                // log the time taken to train the model
                //
                console.log(`Load Model Time: ${end - start} ms`)

                // dispatch a state change event to change the state of the
                // algo tool buttons
                //
                EventBus.dispatchEvent(new CustomEvent('stateChange'));
            });
        }

        // catch any errors
        //
        catch (error) {
            console.log('Error uploading model:', error);
        }
    }
});
//
// end of event listener

EventBus.addEventListener('stateChange', () => {
    /*
    eventListener: stateChange

    dispatcher: Plot, AlgoTool

    args:
     None

    description:
     this event is triggered when a state of one of the following
     is changed:
        1. Train Plot
        2. Eval Plot
        3. Algorithm Toolbar

     this event listener checks the states of the above components
     and changes the state of the algorithm toolbar buttons based
     on the states of the components
    */

    // initialize the states of the train and eval plots
    //
    let trainReady = false, evalReady = false;

    // if there is train data and an algorithm is selected
    // the train data can be trained
    //
    if (trainPlot.getData() && algoTool.get_algo()) {trainReady = true;}

    // if there is a decision surface and eval data, the eval data
    // can be evaluated
    //
    if (trainPlot.getDecisionSurface() && evalPlot.getData()) {evalReady = true;}

    // change the state of the algorithm toolbar buttons
    //
    algoTool.change_train_state(trainReady);
    algoTool.change_eval_state(evalReady);
});
//
// end of event listener

// Event listeners that depend on the website being loaded
// before being triggered
//
document.addEventListener('DOMContentLoaded', () => {

});