var conn=require('../db.js');
var nodemailer = require('nodemailer');

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

exports.Register=function (req, res) {
	console.log("post called");
	var post=req.body;

	var name=post.xname;
	name=name.toLowerCase();		//all names in database are smaller case. Use https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
																			//to show back in title case.
	var type=post.xtype;
	var URL=post.xurl;			//captialised intentionally 
	
	var email=post.xuser;
	var password=post.xpass;
	var city=post.xcity;
	var state=post.xstate;
	var country=post.xcountry;
	var zip=post.xzip;

	var person1Name=post.xname1;
	var person1Desg=post.xdesg1;
	var person1Mob=post.xmob1;
	var person1Phone=post.xphone1;
	var person1Email=post.xemail1;
	var person1Fax=post.xfax1;

	var person2Name=post.xname2;
	var person2Desg=post.xdesg2;
	var person2Mob=post.xmob2;
	var person2Phone=post.xphone2;
	var person2Email=post.xemail2;
	var person2Fax=post.xfax2;

	var person3Name=post.xname3;
	var person3Desg=post.xdesg3;
	var person3Mob=post.xmob3;
	var person3Phone=post.xphone3;
	var person3Email=post.xemail3;
	var person3Fax=post.xfax3;

	var offerCount=0;
	/*....Validate if Company already exist....

	var qry="SELECT * FROM company where email='"+email+"' or url ='"+URL+"' or name='"+name+"'";
	console.log(qry);
	conn.query(qry, function(error, rows, fields){
	if(!!error)
		console.log("Error in query");
	else{
		parse with your rows
		console.log("Length "+rows.length);
		if(rows.length>0){
		
		}
		else{

		}
	}*/
	var values=[name, type, URL, email, password, city, state, country, zip,
				person1Name, person1Desg, person1Mob, person1Phone, person1Email, person1Fax,
				person2Name, person2Desg, person2Mob, person2Phone, person2Email, person2Fax,
				person3Name, person3Desg, person3Mob, person3Phone, person3Email, person3Fax, 
				offerCount];
	var insertQry="INSERT into company VALUES('"+values[0]+"','"+values[1]+"','"+values[2]+"','"+values[3]+"','"+
					values[4]+"','"+values[5]+"','"+values[6]+"','"+values[7]+"','"+values[8]+"','"+values[9]+"','"+
					values[10]+"','"+values[11]+"','"+values[12]+"','"+values[13]+"','"+values[14]+"','"+values[15]+"','"+
					values[16]+"','"+values[17]+"','"+values[18]+"','"+values[19]+"','"+values[20]+"','"+values[21]+"','"+
					values[22]+"','"+values[23]+"','"+values[24]+"','"+values[25]+"','"+values[26]+"','"+values[27]+"')";
	console.log(insertQry);
	conn.query(insertQry, function(error, rows, fields){
		if(!!error)
			console.log("Error in query");
		else{
			console.log(name+" Has been inserted into DB");
			res.send("you have successfully registered with us. Kindly check your inbox for further instructions.");
			//.............Sending email hereon..........//
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'abhi.sah.97@gmail.com',
					pass: 'virgo0609'
				}
			});

			var mailOptions = {
				from: 'placements@iitj.ac.in',
				to: email,
				subject: 'Registration confirmation from Office of Students'+"'"+' Placement, IIT Jodhpur',
				text: ''
			};

			transporter.sendMail(mailOptions, function(error, info){
				if (error) 
				console.log(error);
				else 
				console.log('Email sent: ' + info.response);
			}); 
		}
	});

};
