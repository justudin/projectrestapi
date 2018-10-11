 /**
    Coded by justudin <www.github.com/justudin>
    Release under MIT @ 2018
 **/

var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

// route middleware to verify a token
module.exports = function(req,res,next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['authorization'];
  //console.log(req.headers);
  
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {      

      if (err) {
        return res.status(401).send({ 
            success: false, 
            message: 'Failed to authenticate token.' 
        });        
      } else { 
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
            
        next(); // make sure we go to the next routes and don't stop here
      }
    });

  } else {

    // if there is no token
    // return an HTTP response of 403 (access forbidden) and an error message
    return res.status(401).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
}