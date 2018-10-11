 /**
	Coded by justudin <www.github.com/justudin>
	Release under MIT @ 2018
 **/

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// project schema 
var ProjectSchema   = new Schema({
	title: { type: String, required: true },
	user_id: { type: String, required: true},
	description: { type: String },
	thumbnail: { type: String},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
