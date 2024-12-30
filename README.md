# LOCAL INSTRUCTIONS:

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

## INSTRUCTIONS:

  ### 1. Create Python virtual environment
		
    If you are using Anaconda:
      1. conda create --name imld
      2. conda activate imld
      3. conda install pip
      4. pip install -r requirements.txt

    If you are using virtualenv
      1. python -m venv .imld
      2. source .imld/bin/activate
      3. pip install -r requirements

  ### 2. run 'python imld.py'
  ### 3. open 'http://localhost:5000' on the browser 

<br><br>

# DEPLOYING INSTRUCTIONS (Apache):

If you are interested in deploying this application to a web
server, please read the instructions below. Gunicorn is used
to deploy this Python Flask app because it can be easy used
with different reverse proxy servers such as Apache and Nginx.
	
Gunicorn is a Python WSGI HTTP server designed to run Python 
web appications. Gunicorn acts as an intermediary between a
Python application (Flask in this case) and the client by
serving HTTP requests and passing them to the application for
processing.

Gunicorn is easy to use, while having strong out of the box
performance. Gunicorn has these built in features:

1. Multi-Process Handling: Multiple Gunicorn workers can
	 be used to handle request simultaneously. This allows
	 the application to be scaled efficiently when needed.

2. Decoupled from Web Server: Gunicorn runs independently
	 from the dedicated reverse proxy web server (Apache),
	 streamlining debugging and improving importance.

3. Cross-Platform Support: Gunicorn works independently,
	 meaning it outputs to a system's localhost port. If
	 a reverse proxy web server is used, the server can simple
	 reroute the Gunicorn port to its server. Therefore,
	 any web server that reports reverse proxy (Apache, Nginx, etc..)
	 is supported.

In the case of IMLD and the Neuronix server, Gunicorn is much easier
to setup on Apache. An alternative route is to use the Apache WSGI
module. While this method works, it is difficult to set up when using
Python environments. Gunicorn is as easy as installing a Python module
and running a single command.

## INSTRUCTIONS:

### 1. Create Python virtual environment
			
	If you are using Anaconda:
	  1. conda create --name imld
	  2. conda activate imld
	  3. conda install pip
	  4. pip install -r requirements.txt

	If you are using virtualenv
	  1. python -m venv .imld
	  2. source .imld/bin/activate
	  3. pip install -r requirements

	  - note: Gunicorn is included in the requirements.txt

### 2. Test Gunicorn

	From the imld application folder where the file imld.py
	is located, run the following command:

	gunicorn --workers 1 --bind 127.0.0.1:8000 imld:app

	This will run a Gunicorn instance using 1 worker on the
	machines localhost port 8000. This command will look into
	the users workering directory for a file named imld.py (imld:),
	and start the Flask application with the variable name app
	(:app). You can test this connection by opening 
	http://127.0.0.1:8000 on your machines browser.

	Additionally, you can change the localhost port you wish to
	serve the application on. The rest of this guide will assume
	localhost:8000 is being used.

### 3. Download Apache modules

	Download the following apache modules to allow the Apache
	server to handle reverse proxy.

	- sudo a2enmod proxy
	- sudo a2enmod proxy_http

### 4. Create Apache Virtual Host Configuration

	At the location of your Apache sites-available directory
	(/etc/apache2/sites-available or /etc/httpd/conf.d), please
	create a new configuration file called imld.conf. An example
	of the file is shown below:

		# change the port for your system
		<VirtualHost *:80>

			# add a domain name, but make sure it is in the
			# /etc/hosts file. this is not necessary if you
			# want to run of the localhost
			ServerName imld.local

			# the server admin email address
			ServerAdmin webmaster@localhost

			# proxy to Gunicorn. make sure it is the localhost
			# port Gunicorn is running on
			ProxyPass / http://127.0.0.1:8000/
			ProxyPassReverse / http://127.0.0.1:8000/

			# logs
			ErrorLog ${APACHE_LOG_DIR}/imld_error.log
			CustomLog ${APACHE_LOG_DIR}/imld_access.log combined

		</VirtualHost>

### 5. Enable the Site and restart Apache:

	Start the IMLD Apache site using the following command:
	  - sudo a2ensite imld.conf

	Restart the Apache server using the following command:
	  - sudo systemctl restart apache2

	With a Gunicorn job running, you now should be able to access the
	app through the specified port or server name (from imld.conf) on 
	your system's browser.

### 6. Create a Gunicorn Service (Optional):

	For production environments, you will want to create a system service
	that will start the Gunicorn instance every time the system boots.
	This can be done in various ways and with various tools. This tutorial 
	will create a systemd service:

    1. Create a Gunicorn Service File: 
       Create the file /etc/systemd/system/imld.service, with the following content:

        [Unit]
        Description=Gunicorn instance to serve IMLD through Apache server
        After=network.target

        [Service]
        User=your_user
        Group=www-data
        WorkingDirectory=/var/www/imld
        Environment="PATH=/path/to/anaconda3/envs/flaskenv/bin"
        ExecStart=/path/to/anaconda3/envs/flaskenv/bin/gunicorn --workers 1 --bind 127.0.0.1:8000 imld:app

        [Install]
        WantedBy=multi-user.target

       This file is just an example and will likely have to be
       modifed or extended based on the system.

    2. Reload systemd and enable service:
       Run this command to reload systemd
       - sudo systemctl daemon-reload

       Run this command to start the imld service
       - sudo systemctl start imld

       Run this command to enable the imld service 
       - sudo systemctl enable imld

       You can then verify the service is running using this command
       - sudo systemctl status imld

<br>

With all these steps complete, the IMLD Flask app should now be accesible
through the Apache server as the location provided in the imld.conf file.