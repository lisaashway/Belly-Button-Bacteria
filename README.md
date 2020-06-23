# Interactive-Dashboard


In this directory, you will find files that create an interactive dashboard that displays visualzations on bacteria found in a variety of test subjects' belly buttons. This project uses plotly for javascript to display the graphs, bootstrap css, d3, and flask to run the webpage as a python app deployed on heroku. 

The set-up of the directory is as follows:

    ~app.py: Python file that uses flask to run the index.html page on deployment
    ~Procfile: this file tells Heroku how to run the app
    ~requirements.txt: this is a list of python libraries needed to run app

    ~static folder: 
        ~css folder: 
            ~bootstrap.min.css: file which contains the bootstrap 'mint' theme
        ~js folder: 
            ~app.js: javascript code running the plots using d3 and plotly
        ~samples.json: json file with all of the data for the plots
    
    templates folder:
        ~contains index.html file referenced in app.py
        `


