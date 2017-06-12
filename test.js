var mongoose = require('mongoose');
var express=require ('express');
var app = express();
mongoose.connect('mongodb://localhost/users_test');
app.get("/", function(req, res){
	res.send("Hi there");
});

app.listen(3000, function(){
	console.log("Server is running on port 3000.");
});
