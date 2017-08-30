var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var studentSession, companySession, adminSession;
var flash = require('express-flash-messages')
var app = express();
var mongoose = require('mongoose');
var conn = require('./db.js');
if (!mongoose.connect('mongodb://localhost/my_database')) console.log("Erot");

app.set('view-engine', 'ejs');
app.use('/public', express.static(__dirname + '/public')); //to use css files
//app.use('/resume/:userName', express.static(__dirname + '/resume/:userName'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
    secret: '*7(7987*@#&$%(*&#)(*$',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());



app.get('/', function(req, res){
	/*var r = "B14BS0";
	for(var i=10;i<=40;i++){
		var ty = r+i;
		var b="biss";
		var insertQry="INSERT INTO eligible_students (roll_no,branch)" + " VALUES('"+ty+"','"+b+"')";
		console.log(insertQry);
		conn.query(insertQry, function(error1, rows1, fields) {
		    if(error1){
		        console.log("Error in query");
		        //break;
		    }
		    else{
		        console.log(ty);
		    }
		});
	}*/
	res.sendFile(__dirname + "/index.html");
});

app.get('*', function(req, res){
  res.status(404).send('404 Page not found');
});
app.listen(4000, function() {
    console.log("Server is running on port 4000.");
});