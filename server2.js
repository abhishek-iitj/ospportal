var express=require ('express');

var bodyParser= require('body-parser');
var sessions = require ('express-session');
var studentSession,companySession,adminSession;
var app = express();
		
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

//*******************STUDENT**************************//
app.get("/student/login", function(req, res){
	if(req.session.studentCheck==true) {
		res.redirect('/student/home');
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.sendFile(__dirname+"/student/login.html");
	}
});

app.get("/student/home", function(req, res){
	if (req.session.studentCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.studentUser_id);
	    res.send('Hi '+ req.session.studentUser_id + '<a href="/student/logout"> Logout</a>');
  	}
  	else {
	  	res.redirect('/student/login');
  	}
});

app.post('/student/login', function (req, res) {
  var post = req.body;
  if (post.xuser == 'student1' && post.xpass == 'passwd1') {
    req.session.studentUser_id = post.xuser;
    req.session.studentCheck=true;
    res.redirect('/student/home');
  } else {
    res.redirect('/student/login');
  }
});

app.get('/student/logout', function (req, res) {
	console.log("logging out "+ req.session.studentUser_id);
  delete req.session.studentUser_id;
  req.session.studentCheck=false;
  res.redirect('/student/login');
}); 


//*******************COMPANY*************************************//

app.get("/company/login", function(req, res){
	if(req.session.companyCheck==true) {
		res.redirect('/company/home');
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.sendFile(__dirname+"/company/login.html");
	}
});

app.get("/company/home", function(req, res){
	if (req.session.companyCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.companyUser_id);
	    res.send('Hi '+ req.session.companyUser_id + '<a href="/company/logout"> Logout</a>');
  	}
  	else {
	  	res.redirect('/company/login');
  	}
});

app.post('/company/login', function (req, res) {
  var post = req.body;
  if (post.xuser == 'company1' && post.xpass == 'passwd1') {
    req.session.companyUser_id = post.xuser;
    req.session.companyCheck=true;
    res.redirect('/company/home');
  } else {
    res.redirect('/company/login');
  }
});

app.get('/company/logout', function (req, res) {
	console.log("logging out "+ req.session.companyUser_id);
  delete req.session.companyUser_id;
  req.session.companyCheck=false;
  res.redirect('/company/login');
}); 


//*******************ADMIN***************************************//

app.get("/admin/login", function(req, res){
	if(req.session.check==true) {
		res.redirect('/admin/home');
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.sendFile(__dirname+"/admin/login.html");
	}
});

app.get("/admin/home", function(req, res){
	if (req.session.check==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.user_id);
	    res.send('Hi '+ req.session.user_id + '<a href="/admin/logout"> Logout</a>');
  	}
  	else {
	  	res.redirect('/admin/login');
  	}
});

app.post('/admin/login', function (req, res) {
  var post = req.body;
  if (post.xuser == 'admin1' && post.xpass == 'passwd1') {
    req.session.user_id = post.xuser;
    req.session.check=true;
    res.redirect('/admin/home');
  } else {
    res.redirect('/admin/login');
  }
});

app.get('/admin/logout', function (req, res) {
	console.log("logging out "+ req.session.user_id);
  delete req.session.user_id;
  req.session.check=false;
  res.redirect('/admin/login');
}); 

app.listen(3000, function(){
	console.log("Server is running on port 3000...");
});