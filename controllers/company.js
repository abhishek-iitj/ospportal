var conn=require('../db.js');
var nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');
var date = require('date-and-time');

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
		var qry="SELECT * FROM company where email='"+req.session.companyUser_id+"'";
		console.log(qry);

		var compRow;		//to fetch the row from offers table for the logged in company

		conn.query(qry, function(error, rows, fields){
			if(!!error)
					console.log("Error in query 1");
			var string=JSON.stringify(rows);
			var json =  JSON.parse(string);
		
			console.log(json);
			var offerRow;
			var newQry='SELECT * FROM offer WHERE company_id='+"'"+json[0].unq_id+"'";
			console.log(newQry);
			conn.query(newQry,function(err,rows){
	        if(err)
	          console.log("Error Selecting : %s ",err );
	      	var string2=JSON.stringify(rows);
			var json2 =  JSON.parse(string);
	      	console.log(rows);
	        res.render('company/home.ejs',{data:rows, companyName:req.session.companyName});
		    //res.render('company/home.ejs', {companyName:req.session.companyName});		//argument to render function is a javascript objet
		    //also need to print the comapany offers rows
			});
		});
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
			req.session.companyUnqId=rows[0].unq_id;
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
	delete req.session.companyUnqId;
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
	var unq_id=uuidv4();
	var values=[unq_id, name, type, URL, email, password, city, state, country, zip,
				person1Name, person1Desg, person1Mob, person1Phone, person1Email, person1Fax,
				person2Name, person2Desg, person2Mob, person2Phone, person2Email, person2Fax,
				person3Name, person3Desg, person3Mob, person3Phone, person3Email, person3Fax, 
				offerCount];

				

	var insertQry="INSERT INTO company (unq_id, name, type, email, password, url, city, state, country, zip, person1_name, person1_desg, person1_mobile, person1_phone, person1_email, person1_fax, person2_name, person2_desg, person2_mobile, person2_phone, person2_email, person2_fax, person3_name, person3_desg, person3_mobile, person3_phone, person3_email, person3_fax, offerscount)" +
	 " VALUES('"+values[0]+"','"+values[1]+"','"+values[2]+"','"+values[3]+"','"+
					values[4]+"','"+values[5]+"','"+values[6]+"','"+values[7]+"','"+values[8]+"','"+values[9]+"','"+
					values[10]+"','"+values[11]+"','"+values[12]+"','"+values[13]+"','"+values[14]+"','"+values[15]+"','"+
					values[16]+"','"+values[17]+"','"+values[18]+"','"+values[19]+"','"+values[20]+"','"+values[21]+"','"+
					values[22]+"','"+values[23]+"','"+values[24]+"','"+values[25]+"','"+values[26]+"','"+values[27]+"','"+values[28]+"')";
	console.log(insertQry);
	console.log(values[0]);
	conn.query(insertQry, function(error, rows, fields){
		if(!!error)
			console.log("Error in query");
		else{
			console.log(name+" Has been inserted into DB");
			res.send("You have successfully registered with us. Kindly check your inbox for further instructions.");
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

exports.getAddoffer=function(req, res){
	if (req.session.companyCheck==true) {
		res.render("../views/company/addoffer.ejs",{companyName:req.session.companyName});
	}
	else{
		console.log("session not found");
		//res.send("You are not authorized to view this page.");
		res.redirect('/company/login');
	}
};

exports.postAddoffer=function(req, res){
	var post=req.body;
	//console.log(req.body.cse);
	console.log(req.body);

	var company_email=req.session.companyUser_id;
	var company_name=req.session.companyName;
	var company_unq_id=req.session.companyUnqId;
	var unq_id=uuidv4();

	if(post.apttest==null)	post.apttest=0;
	if(post.tint==null) 	post.tint=0;
	if(post.intvwrounds==null) 	post.intvwrounds=0;
	if(post.file1==null) post.file1="a";
	if(post.file2==null) post.file2="";
	if(post.file3==null) post.file3="";
	if(post.file4==null) post.file4="";
	if(post.file5==null) post.file5="";
	
	post.file=post.file1+post.file2+post.file3+post.file4+post.file5;

	if(post.gropudsc==null) post.gropudsc=0;
	if(post.medical==null)	post.medical=0;

	if(post.resume==null) post.resume=0;
	if(post.resumedescrp==null) post.resumedescrp="";

	if(post.hrintvw==null)	post.hrintvw=0;
	if(post.techtest==null) post.techtest=0;

	if(post.rooms==null)	post.rooms=0;
	if(post.members==null)	post.members=0;
	if(post.other==null)	post.other="";

	var dateAdded=getTime();
	
	if(post.bonus==null) post.bonus="";
	if(post.bond==null) post.bond=0;
	if(post.bonddescrp==null) post.bonddescrp="";

	if(post.cpi==null)		post.cpi="";

	if(post.cse==null)		post.cse=0;
	if(post.ee==null)		post.ee=0;
	if(post.me==null)		post.me=0;
	if(post.ss==null)		post.ss=0;
	if(post.sscse==null)	post.sscse=0;
	if(post.ssee==null)		post.ssee=0;
	if(post.ssme==null) 	post.ssme=0;
	if(post.biss==null)		post.biss=0;
	if(post.bisscse==null) 	post.bisscse=0;
	if(post.bissee==null)	post.bissee=0;
	if(post.bissme==null)	post.bissme=0;
	if(post.mme==null)		post.mme=0;
	if(post.mee==null)		post.mee=0;
	if(post.mscphy==null)	post.mscphy=0;
	if(post.mscche==null)	post.mscche=0;
	if(post.mscmath==null)	post.mscmath=0;



	var values=[unq_id, company_unq_id, company_name, company_email, post.jobdesg, post.jobdescrp, post.joindate,
			post.jobloc, post.apttest, post.tint, post.intvwrounds, post.gropudsc, post.medical, 
			post.resume, post.resumedescrp, post.hrintvw, post.techtest, post.cpi, post.file, post.rooms, post.members, post.other,
			dateAdded, post.ctc, post.gross, post.bonus, post.bond, post.bonddescrp, post.cse, post.ee, post.me, 
			post.ss, post.sscse, post.ssee, post.ssme, post.biss, post.bisscse, post.bissee, post.bissme,post.mme, 
			post.mee, post.mscphy, post.mscche, post.mscmath, 0, 1];

	// console.log(values);
	// console.log(values.length);

	var insertqry="INSERT INTO offer (unq_id, company_id, company_name, company_email, job_desg, job_description, joining_date, job_location, aptitude_test, technical_interview, rounds, group_discussion, medical_req, shortlist_resume, shortlist_resume_specify, hr_interview, technical_test, min_cpi, file, rooms, members, others_logistics, date_added, salary, gross, bonus, bond, bond_description, cse, ee, me, ss, sscse, ssee, ssme, biss, bisscse, bissee, bissme, mme, mee, mscphy, mscche, mscmath, admin_verify, open) VALUES('"
					+values[0]+"','"+values[1]+"','"+values[2]+"','"+values[3]+"','"+
					values[4]+"','"+values[5]+"','"+values[6]+"','"+values[7]+"',"+values[8]+","+values[9]+","+
					values[10]+","+values[11]+","+values[12]+","+values[13]+",'"+values[14]+"',"+values[15]+","+
					values[16]+",'"+values[17]+"',"+values[18]+","+values[19]+","+values[20]+",'"+values[21]+"','"+
					values[22]+"',"+values[23]+","+values[24]+",'"+values[25]+"',"+values[26]+",'"+values[27]+"',"+
					values[28]+","+values[29]+","+values[30]+","+values[31]+","+values[32]+","+values[33]+","+
					values[34]+","+values[35]+","+values[36]+","+values[37]+","+values[38]+","+values[39]+","+
					values[40]+","+values[41]+","+values[42]+","+values[43]+","+values[44]+","+values[45]+")";

	console.log(insertqry);
	
}
