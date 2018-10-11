 /**
	Coded by justudin <www.github.com/justudin>
	Release under MIT @ 2018
 **/
 
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User       = require('../models/user');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

// route to register new user
router.post('/signup',function(req, res) {

		var user = new User();		// create a new instance of the User model
		user.name = req.body.name;  // set the users name (comes from the request)
		user.email = req.body.email; // set the users email
		user.password = req.body.password;  // set the users password (comes from the request)

		user.save(function(err, user) {
			if (err) {
				// duplicate entry
				if (err.code == 11000) 
					return res.json({ success: false, message: 'A user with that email already exists. '});
				else 
					return res.send(err);
			}

			// create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	user_id: user.id,
	        	email: user.email
	        }, superSecret, {
	          expiresIn: '8760h' // expires in 1 year
	        });

	        var today = new Date().toISOString();

	        var dataReturned = {
	        	"id": user._id,
	        	"type":  "users",
	        	"attributes": {
	        		"token": token,
	        		"email": user.email,
	        		"name": user.name,
	        		"created_at": today,
	        		"updated_at": today
	        	}
	        }

			// return a message
			res.status(201).json({ data: dataReturned });
		});

	});

// route to authenticate a user
router.post('/signin', function(req, res) {

  // find the user
  User.findOne({
    email: req.body.email
  }).select('_id name email password').exec(function(err, user) {

    if (err) throw err;

    // no user with that email was found
    if (!user) {
      res.status(404).json({ 
      	success: false, 
      	message: 'Authentication failed. User not found.' 
    	});
    } else if (user) {

      // check if password matches
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.status(403).json({ 
        	success: false, 
        	message: 'Authentication failed. Wrong password.' 
      	});
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign({
        	name: user.name,
        	user_id: user.id,
        	email: user.email
        }, superSecret, {
          expiresIn: '8760h' // expires in 1 year
        });

        var today = new Date().toISOString();

        var dataReturned = {
        	"id": user.id,
        	"type":  "users",
        	"attributes": {
        		"token": token,
        		"email": user.email,
        		"name": user.name,
        		"created_at": today,
        		"updated_at": today
        	}
        }

        // return the information including token as JSON
        res.status(201).json({ data: dataReturned });

      }   

    }

  });
});

module.exports = router;