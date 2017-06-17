
var mongoose = require("mongoose");
//connect to database
var db = mongoose.connect('mongodb://127.0.0.1:27017/test');
//create schema for student
var studentSchema = new mongoose.Schema({
	name: String,
	branch: String,
	rollNo: String,
	//comments: [{ body: String, date: Date }],
	//dateofBirth: { type: Date, default: Date.now },
	hidden: Boolean,
	meta: {
		votes: Number,
		favs:  Number
	}
});

//compile schema to model
module.exports = db.model('blog', blogSchema)