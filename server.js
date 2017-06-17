var express=require ('express');
var mysql =require('mysql');
var bodyParser= require('body-parser');
var sessions = require ('express-session');
var studentSession,companySession,adminSession;
var app = express();
var mongoose = require('mongoose');
var conn=require('./db.js');
if(!mongoose.connect('mongodb://localhost/my_database')) console.log("Erot");

app.set('view-engine', 'ejs');
app.use('/public', express.static(__dirname+'/public'));		//to use css files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(sessions({
	secret:'*7(7987*@#&$%(*&#)(*$',
	resave:false,
	saveUninitialized:true
}));
	
app.get("/", function(req, res){
	res.sendFile(__dirname+"/index.html");
});

var student=require('./routes/student');
var company=require('./routes/company');
var admin=require('./routes/admin');

app.use('/student', student);
app.use('/company', company);
app.use('/admin', admin);

app.listen(3000, function(){
	console.log("Server is running on port 3000.");
});

