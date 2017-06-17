var express=require ('express');
var mysql =require('mysql');
var bodyParser= require('body-parser');
var sessions = require ('express-session');
var studentSession,companySession,adminSession;
var app = express();
var mongoose = require('mongoose');
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
	

var conn=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'spc',
});	

conn.connect(function(error){
	if(!!error) console.log(error);
	else console.log("Connected to MYSQL");
});


app.get("/", function(req, res){
	res.sendFile(__dirname+"/index.html");
});


//Functions for Login........//

//*******************STUDENT**************************//
//reference for login taken from https://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js#answer-8003291
app.get("/student/login", function(req, res){
	var statusText="";
	var passedVariable = req.query.valid;
	if(passedVariable=='false') statusText="Sorry, That didn't work !";
	if(req.session.studentCheck==true) {
		res.redirect('/student/home');
	}
	else{
		// var stausText="Kindly fill in these fields";
		// if(req.params.status=="false") statusText="Wrong credentials";
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render(__dirname+"/views/student/login.ejs", {status:statusText});
	}
});

app.get("/student/home", function(req, res){
	if (req.session.studentCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.studentUser_id);
	    //res.send('Hi '+ req.session.studentUser_id + '<a href="/student/logout"> Logout</a>');
	    //res.sendFile(__dirname+"/index.ejs");
	    res.render('student/home.ejs', {studentName:req.session.studentName});		//argument to render function is a javascript objet
  	}
  	else {
	  	res.redirect('/student/login');
  	}
});

app.post('/student/login', function (req, res) {
	var post = req.body;
	var qry="SELECT * FROM students where ldap_id='"+post.xuser+"' and ldap_pass='"+post.xpass+"'";
	console.log(qry);
	conn.query(qry, function(error, rows, fields){
	// if(!!error)
	// 	console.log("Error in query");
	// else{
		//parse with your rows
		console.log("Length "+rows.length);
		if(rows.length==1){
			console.log("Successfull query\n" + rows[0].name);
			req.session.studentUser_id = post.xuser;
			req.session.studentName=rows[0].name;
			req.session.studentCheck=true;
			res.redirect('/student/home');
		}
		else {
			var str = encodeURIComponent('false');
  			//res.redirect('/?valid=' + string);
			res.redirect('/student/login/?valid=' +str);
		}
	});
});

app.get('/student/logout', function (req, res) {
	console.log("logging out "+ req.session.studentUser_id);
	delete req.session.studentUser_id;
	delete req.session.studentName;
	req.session.studentCheck=false;
	res.redirect('/student/login');
}); 


//*******************COMPANY*************************************//

app.get("/company/login", function(req, res){
	var statusText="";
	var passedVariable = req.query.valid;
	if(passedVariable=='false') statusText="Sorry, That didn't work !";
	if(req.session.companyCheck==true) {
		res.redirect('/company/home');
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render(__dirname+"/views/company/login.ejs", {status:statusText});
	}
});

app.get("/company/home", function(req, res){
	if (req.session.companyCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.companyUser_id);
	    //res.send('Hi '+ req.session.companyUser_id + '<a href="/company/logout"> Logout</a>');
	    res.render('company/home.ejs', {companyName:req.session.companyName});		//argument to render function is a javascript objet
  	}
  	else {
	  	res.redirect('/company/login');
  	}
});

app.post('/company/login', function (req, res) {
	var post = req.body;
	var qry="SELECT * FROM company where email='"+post.xuser+"' and password ='"+post.xpass+"'";
	console.log(qry);
	conn.query(qry, function(error, rows, fields){
	// if(!!error)
	// 	console.log("Error in query");
	// else{
		//parse with your rows
		console.log("Length "+rows.length);
		if(rows.length==1){
			console.log("Successfull query\n" + rows[0].name);
			req.session.companyUser_id = post.xuser;
			req.session.companyCheck=true;
			req.session.companyName=rows[0].name;
			res.redirect('/company/home');
		} 
		else{
			var str = encodeURIComponent('false');
			res.redirect('/company/login/?valid='+str);
		}
	});
});

app.get('/company/logout', function (req, res) {
	console.log("logging out "+ req.session.companyUser_id);
	delete req.session.companyUser_id;
	delete req.session.companyName;
	req.session.companyCheck=false;
	res.redirect('/company/login');
}); 


//*******************ADMIN***************************************//
app.get("/admin/login", function(req, res){
	var statusText="";
	var passedVariable = req.query.valid;
	if(passedVariable=='false') statusText="Sorry, That didn't work !";
	if(req.session.adminCheck==true) {
		res.redirect('/admin/home');
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render(__dirname+"/views/admin/login.ejs",  {status:statusText});
	}
});

app.get("/admin/home", function(req, res){
	if (req.session.adminCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.adminUser_id);
	    //res.send('Hi '+ req.session.user_id + '<a href="/admin/logout"> Logout</a>');
	    res.render('admin/home.ejs', {adminName:req.session.adminName});		//argument to render function is a javascript objet
  	}
  	else {
	  	res.redirect('/admin/login');
  	}
});

app.post('/admin/login', function (req, res) {
  	var post = req.body;
	var qry="SELECT * FROM admin where id='"+post.xuser+"' and password ='"+post.xpass+"'";
	console.log(qry);
	conn.query(qry, function(error, rows, fields){
	// if(!!error)
	// 	console.log("Error in query");
	// else{
		//parse with your rows
		console.log("Length "+rows.length);
		if(rows.length==1){
			console.log("Successfull query\n" + rows[0].name);
			req.session.adminUser_id = post.xuser;
			req.session.adminCheck=true;
			req.session.adminName=rows[0].name;
			res.redirect('/admin/home');
		} 
		else{
			var str = encodeURIComponent('false');
			res.redirect('/admin/login/?valid='+str);
		}
	});
  /*var post = req.body;
  if (post.xuser == 'admin1' && post.xpass == 'passwd1') {
    req.session.user_id = post.xuser;
    req.session.check=true;
    res.redirect('/admin/home');
  } else {
    res.redirect('/admin/login');
  }*/

});

app.get('/admin/logout', function (req, res) {
	console.log("logging out "+ req.session.adminUser_id);
	delete req.session.adminUser_id;
	req.session.adminCheck=false;
	res.redirect('/admin/login');
}); 

//Functions for Login........ FINISHED//

//.............COMPANY REGISTER.......................................//
app.get('/company/register', function (req, res) {
	res.render(__dirname+"/views/company/register.ejs");
});
app.listen(3000, function(){
	console.log("Server is running on port 3000.");
});