 /**
	Coded by justudin <www.github.com/justudin>
	Release under MIT @ 2018
 **/

// CALL THE PACKAGES --------------------
var express	= require('express');		// call express
var app		= express(); 				// define our app using express
var bodyParser	= require('body-parser'); 	// get body-parser
var morgan	= require('morgan'); 		// used to see requests
var mongoose	= require('mongoose');
var config 	= require('./config');
var path 	= require('path');

// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST','PATCH','DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console 
app.use(morgan('dev'));

// connect to our database (hosted on modulus.io)
mongoose.connect(config.database); 

// API ROUTES ------------------------
app.get('/', function(req, res){
    res.send('Welcome to the world');
});

// users
app.use('/users', require('./app/controllers/user'));

// projects
app.use('/projects', require('./app/controllers/project'));

// contents
app.use('/contents', require('./app/controllers/content'));

// not found error
//The 404 Route (ALWAYS Keep this as the last route)
app.use(function(req, res, next) {
  return res.status(404).send("Are you lost? "+req.url+" and/or "+req.method+" method is not found.");
});

// START THE SERVER
// ====================================
app.listen(config.port, 'localhost');
console.log('Magic happens on localhost:' + config.port);
