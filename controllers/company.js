var conn=require('../db.js');

exports.getLogin=function(req, res){
	var statusText="";
	var passedVariable = req.query.valid;
	if(passedVariable=='false') statusText="Sorry, That didn't work !";
	if(req.session.companyCheck==true) {
		res.redirect('/company/home');
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("../views/company/login.ejs", {status:statusText});
	}
};

exports.getHome=function(req, res){
	if (req.session.companyCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.companyUser_id);
	    //res.send('Hi '+ req.session.companyUser_id + '<a href="/company/logout"> Logout</a>');
	    res.render('company/home.ejs', {companyName:req.session.companyName});		//argument to render function is a javascript objet
  	}
  	else {
	  	res.redirect('/company/login');
  	}
};

exports.postLogin=function (req, res) {
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
};

exports.getLogout=function (req, res) {
	console.log("logging out "+ req.session.companyUser_id);
	delete req.session.companyUser_id;
	delete req.session.companyName;
	req.session.companyCheck=false;
	res.redirect('/company/login');
};

exports.getRegister=function (req, res) {
	res.render("../views/company/register.ejs");
};

