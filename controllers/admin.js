var conn=require('../db.js');

exports.getLogin=function(req, res){
	var statusText="";
	var passedVariable = req.query.valid;
	if(passedVariable=='false') statusText="Sorry, That didn't work !";
	if(req.session.adminCheck==true) {
		res.redirect('/admin/home');
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("../views/admin/login.ejs",  {status:statusText});
	}
};

exports.getHome=function(req, res){
	if (req.session.adminCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.adminUser_id);
	    //res.send('Hi '+ req.session.user_id + '<a href="/admin/logout"> Logout</a>');
	    res.render('admin/home.ejs', {adminName:req.session.adminName});		//argument to render function is a javascript objet
  	}
  	else {
	  	res.redirect('/admin/login');
  	}
};

exports.postLogin=function (req, res) {
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

};

exports.getLogout=function (req, res) {
	console.log("logging out "+ req.session.adminUser_id);
	delete req.session.adminUser_id;
	req.session.adminCheck=false;
	res.redirect('/admin/login');
};
