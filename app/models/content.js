 /**
	Coded by justudin <www.github.com/justudin>
	Release under MIT @ 2018
 **/

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// content schema 
var ContentSchema   = new Schema({
	title: { type: String, required: true },
	project_id: { type: String, required: true},
	user_id: { type: String, required: true},
	type: { type: String, required: true},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);
