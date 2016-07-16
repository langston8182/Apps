var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('admin', new Schema({
	login: String,
	password: String
}));