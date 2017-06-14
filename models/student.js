var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user=new Schema({
	name:string,
	username:string,
	password:string,
});