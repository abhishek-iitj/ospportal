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

app.get("/admin/login", function(req, res){
	res.sendFile(__dirname+"/admin/login.html");
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
	if(req.session.check==true) res.redirect('/admin/home');
	else{
		var post = req.body;
		if (post.xuser == 'admin1' && post.xpass == 'passwd1') {
			req.session.user_id = post.xuser;
			req.session.check=true;
			res.redirect('/admin/home');
		} 
		else{
			res.redirect('/admin/login');
		}
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