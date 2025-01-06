const trainPlot = document.querySelector('#train-plot');

// Listen for the 'train' event emitted from AlgoTool Component
window.addEventListener('train', (event) => {

    // get the data from the event
    //
    const data = event.detail.data;

    // send the data to the server
    // and get the response
    //
    fetch ('/train', {
        method: 'POST',
        body: JSON.stringify(data),
    })

    // parse the response
    //
    .then((data) => {
        trainPlot.plot(data)
    });

});