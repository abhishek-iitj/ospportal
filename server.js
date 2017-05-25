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


/*get requests to difft pages*/

app.get("/", function(req, res){
	res.sendFile(__dirname+"/index.html");
});

app.get("/student/login", function(req, res){
	res.sendFile(__dirname+"/student/login.html");
});

app.get("/company/login", function(req, res){
	res.sendFile(__dirname+"/company/login.html");
});
app.get("/admin/login", function(req, res){
	res.sendFile(__dirname+"/admin/login.html");
});


app.get("/student/home", function(req, res){
	// if(studentSession.uid)
	// 	res.redirect('/studentRedirect');
	res.sendFile(__dirname+"/student/home.html");
});
app.get("/company/home", function(req, res){
	// if(companySession.uid) 
	// 	res.redirect('/companyRedirect');
	res.sendFile(__dirname+"/company/home.html");
});
app.get("/admin/home", function(req, res){
	// if(adminSession.uid)
	// 	res.redirect('/adminRedirect');
	res.sendFile(__dirname+"/admin/home.html");
});


/*post requests to difft pages*/
app.post('/student/login', function(req, res){
	studentSession=req.session;
	if(studentSession.uid)
		res.redirect('/studentRedirect');
	//res.end(JSON.stringify(req.body));
	if(req.body.xuser == 'student1' && req.body.xpass=='passwd1'){
		studentSession.uid=req.body.xuser;
	}
	res.redirect('/studentRedirect');
});

app.post('/company/login', function(req, res){
	companySession=req.session;
	if(companySession.uid) 
		res.redirect('/companyRedirect');
	if(req.body.xuser == 'company1' && req.body.xpass=='passwd1'){
		companySession.uid=req.body.xuser;
	}
	res.redirect('/companyRedirect');
});

app.post('/admin/login', function(req, res){
	//res.end(JSON.stringify(req.body));
	adminSession=req.session;
	if(adminSession.uid)
		res.redirect('/adminRedirect');
	if(req.body.xuser == 'admin1' && req.body.xpass=='passwd1'){
		adminSession.uid=req.body.xuser;
	}
	res.redirect('/adminRedirect');
});


app.get('/studentRedirect', function(req, res){
	studentSession=req.session;
	console.log(studentSession.uid);
	if (studentSession.uid) {
		res.redirect('/student/home');
	}
	else res.end('Who are you');
});


app.get('/companyRedirect', function(req, res){
	companySession=req.session;
	console.log(companySession.uid);
	if (companySession.uid) {
		res.redirect('/company/home');
	}
	else res.end('Who are you');
});

app.get('/adminRedirect', function(req, res){
	adminSession=req.session;
	//console.log(session.uid);
	if (adminSession.uid) {
		res.redirect('/admin/home');
	}
	else res.end('Who are you');
});

app.listen(3000, function(){
	console.log("Server is running on port 3000...");
});