 /**
	Coded by justudin <www.github.com/justudin>
	Release under MIT @ 2018
 **/

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Content     = require('../models/content');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var authonly = require('../middlewares/tokenverification');


// super secret for creating tokens
var superSecret = config.secret;

// on routes that end in /contents/:content_id
// ----------------------------------------------------
router.route('/:content_id')

	// update the content with content_id
	.patch(authonly, function(req, res) {
		Content.findById(req.params.content_id, function(err, content) {

			if (err) res.send(err);

			// no content with that id was found
		    if (!content) {
		      res.status(404).json({ 
		      	success: false, 
		      	message: 'Content not found.' 
		    	});
		    } else if (content) {

		      // check if user_id is matches with in the content
		      if (content.user_id != req.decoded.user_id) {
		        res.status(403).json({ 
		        	success: false, 
		        	message: 'Permission Denied. You cannot update the content which does not belong to you.' 
		      	});

		      } else {

		        // matched with the content ownership
		        // set the new content information
				content.title = req.body.title;
				content.type = req.body.type;
				content.updated_at = Date.now();

				// save the credit
				content.save(function(err, content) {
					if (err) res.send(err);

					var dataReturned = {
			        	"id": content.id,
			        	"type":  "contents",
			        	"attributes": {
			        		"project_id": content.project_id,
			        		"title": content.title,
			        		"type": content.type,
			        		"created_at": content.created_at,
			        		"updated_at": content.updated_at
			        	}
			        }
			        
					// return a message
					res.status(201).json({ data: dataReturned });
				});

		      }   

		    }
		});
	})

	// delete the content with content_id
	.delete(authonly, function(req, res) {
		Content.findById(req.params.content_id, function(err, content) {

			if (err) res.send(err);

			// no content with that id was found
		    if (!content) {
		      res.status(404).json({ 
		      	success: false, 
		      	message: 'Content not found.' 
		    	});
		    } else if (content) {

		      // check if user_id is matches with in the content
		      if (content.user_id != req.decoded.user_id) {
		        res.status(403).json({ 
		        	success: false, 
		        	message: 'Permission Denied. You cannot delete the content which does not belong to you.' 
		      	});

		      } else {

		        //matched with the content ownership
		        Content.remove({
					_id: req.params.content_id
				}, function(err, content) {
					if (err) res.send(err);
					res.status(204).json({ 
						success: true,
						message: 'Successfully deleted' 
					});
				});
		      }   

		    }
		});
	});


module.exports = router;