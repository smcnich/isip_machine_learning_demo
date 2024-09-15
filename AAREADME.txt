RUNNING INSTRUCTIONS:

    If you are interested in developing frontend features for
    this application, you will have to develop this repository
    from your local machine. The Flask web framework that this
    application uses makes use of the localhost to serve a 
    frontend to the browser. The localhost cannot be accessed
    through the Neuronix server, meaning that this application
    must be run locally.

    If you are interested in developing the backend and testing,
    you can work on the Nueronix server. If you do not need
    to work on the frontend, there is no need to copy the application
    locally.

    INSTRCTIONS:

        1. create Python virtual environment
        
            * If you are using Anaconda:
                1. conda create --name imld
                2. conda activate imld
                3. conda install pip
                4. pip install -r requirements.txt

            * If you are using virtualenv
                1. python -m venv .imld
                2. source .imld/bin/activate
                3. pip install -r requirements

        2. run 'python imld.py'
        3. open 'http://localhost:5000' on the browser