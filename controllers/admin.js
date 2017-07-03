var conn=require('../db.js');
var path = require('path');
var fs =require('fs-extra');

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

exports.getVerifyResume=function(req, res){
	if (req.session.adminCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.adminUser_id);
    	var qry="SELECT * FROM students where 1";
		console.log(qry);
		conn.query(qry, function(error, rows, fields){
			console.log("Length "+rows.length);
			if(rows.length>=1){
				res.render('admin/verifyResume.ejs', {data:rows,len:rows.length});
			} 
			else{
				res.redirect('/admin/home');
			}
		});
	    
  	}
  	else {
	  	res.redirect('/admin/login');
  	}
};

exports.postVerifyResume=function(req, res){
	var post = req.body;
	var user = post.xUser;
	res.redirect('/admin/verifyResume/'+user);
};

exports.getResumeByUser=function(req, res){
	if (req.session.adminCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log(req.params.userName);
    	var user = req.params.userName;
		var qry="SELECT * FROM students where ldap_id='"+user+"'";
		console.log(qry);
		conn.query(qry, function(error, rows, fields){
			console.log("Length "+rows.length);
			if(rows.length==1){
				resumeStatus = [ rows[0].resume1, rows[0].resume2, rows[0].resume3, rows[0].resume4, rows[0].resume5 ];
				res.render('admin/resumeByUserName.ejs', {data:resumeStatus,userName:user});
			} 
			else{
				res.redirect('/admin/home');
			}
		});
	    
  	}
  	else {
	  	res.redirect('/admin/login');
  	}
};

exports.getShowResume=function(req, res){
	if (req.session.adminCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log(req.params.resumeNumber);
    	var user = req.params.userName;
    	var resumeName = req.params.resumeNumber;
		//res.render('resume/'+user+'/'+resumeName+'.pdf');
		var file = fs.createReadStream('resume/'+user+'/'+resumeName+'.pdf');
		var stat = fs.statSync('resume/'+user+'/'+resumeName+'.pdf');
		res.setHeader('Content-Length', stat.size);
		res.setHeader('Content-Type', 'application/pdf');
		file.pipe(res);
  	}
  	else {
	  	res.redirect('/admin/login');
  	}
};

exports.postVerification=function(req, res){
	var post = req.body;
	var user = post.xUser;
	var resumeNumber = post.xResumeNumber;
	var result = post.verification;
	console.log(result);
	if(result=="yes"){
		var qry = "UPDATE students SET "+resumeNumber+" ='"+2+"'WHERE ldap_id='"+user+"' ";
		console.log(qry);
		conn.query(qry,function(error, rows, fields){
			if(!error){
				console.log("success");
				//var str = encodeURIComponent('true');
			//	res.redirect('/student/editDetails/?valid=' +str);
			}
			else{
				console.log("Unsuccess");
				//var str = encodeURIComponent('false');
			//	res.redirect('/student/editDetails/?valid=' +str);
			}
		});
	}
	else{
		var qry = "UPDATE students SET "+resumeNumber+" ='"+0+"'WHERE ldap_id='"+user+"' ";
		console.log(qry);
		conn.query(qry,function(error, rows, fields){
			if(!error){
				console.log("success");
				var filePath = 'resume/'+user+'/'+resumeNumber+'.pdf'; 
				fs.unlinkSync(filePath);
			}
			else{
				console.log("Unsuccess");
			}
		});
	}
	res.redirect('/admin/verifyResume/'+user);
};

exports.getLogout=function (req, res) {
	console.log("logging out "+ req.session.adminUser_id);
	delete req.session.adminUser_id;
	req.session.adminCheck=false;
	res.redirect('/admin/login');
};
