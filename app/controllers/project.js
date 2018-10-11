 /**
	Coded by justudin <www.github.com/justudin>
	Release under MIT @ 2018
 **/

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Project      = require('../models/project');
var Content     = require('../models/content');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var authonly = require('../middlewares/tokenverification');

// super secret for creating tokens
var superSecret = config.secret;

// on routes that end in /projects
// ----------------------------------------------------
router.route('')

	// create a project
	.post(authonly, function(req, res) {
		
		var project = new Project();
		project.user_id = req.decoded.user_id; 
		project.title = req.body.title;
		project.description = req.body.description;
		project.thumbnail = req.body.thumbnail;

		project.save(function(err, project) {
			if (err) {
				return res.json({ success: false, message: err});
			}

			var today = new Date().toISOString();

	        var dataReturned = {
	        	"id": project.id,
	        	"type":  "projects",
	        	"attributes": {
	        		"title": project.title,
	        		"thumbnail": project.thumbnail,
	        		"description": project.description,
	        		"created_at": today,
	        		"updated_at": today
	        	}
	        }


			// return a message
			res.status(201).json({ data: dataReturned });
		});

	})

	// get all the projects without logged-in / no token checking
	.get(function(req, res) {

		Project.find({}, null, {sort: {created_at: -1}}, function(err, projects) {
			if (err) res.send(err);
			var dataArray = [];

			projects.forEach(function(project){
				var dataReturned = {
		        	"id": project._id,
		        	"type":  "projects",
		        	"attributes": {
		        		"title": project.title,
		        		"thumbnail": project.thumbnail,
		        		"description": project.description,
		        		"created_at": project.created_at,
		        		"updated_at": project.updated_at
		        	}
		        }

		        dataArray.push(dataReturned);

			});
			// return the projects
			res.status(200).json(dataArray);
		});
	});

// on routes that end in /projects/:project_id/contents
// ----------------------------------------------------
router.route('/:project_id/contents')
	
	// create a content
	.post(authonly, function(req, res) {
		
		var content = new Content();
		content.user_id = req.decoded.user_id; 
		content.title = req.body.title;
		content.type = req.body.type;
		content.project_id = req.params.project_id;

		content.save(function(err, content) {
			if (err) {
				return res.json({ success: false, message: err});
			}

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

	})

	// get all the contents without logged-in / no token checking
	.get(function(req, res) {

		Content.find({ project_id: req.params.project_id }, null, {sort: {created_at: -1}}, function(err, contents) {
			if (err) res.send(err);
			var dataArray = [];

			contents.forEach(function(content){
				
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

		        dataArray.push(dataReturned);
		        
			});
			// return the contents
			res.status(200).json(dataArray);
		});
	});


module.exports = router;