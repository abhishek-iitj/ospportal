//writing all the routes taking controller functions as callback;

var express=require('express');
var router=express.Router();
var conn=require('../db.js');
//var student_controller=require('../controller/student');

router.get("/login", function(req, res){
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
		//res.render(__dirname+"/views/student/login.ejs", {status:statusText});
		res.render("../views/student/login.ejs", {status:statusText});
	}
});

router.get("/home", function(req, res){
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

router.post('/login', function (req, res) {
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

router.get('/logout', function (req, res) {
	console.log("logging out "+ req.session.studentUser_id);
	delete req.session.studentUser_id;
	delete req.session.studentName;
	req.session.studentCheck=false;
	res.redirect('/student/login');
}); 


module.exports = router;