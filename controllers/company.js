var conn=require('../db.js');
var nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');
var today = new Date();
var flash = require('express-flash-messages');
var multer  = require('multer')
var upload = multer({ dest: 'temp/' })
var fs = require( 'fs' );
var path = require( 'path' );
// In newer Node.js versions where process is already global this isn't necessary.
var process = require( "process" );

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
	var values=[unq_id, name, type, email, password, URL, city, state, country, zip,
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
	console.log("Post to add offer called");
	console.log(req.body, 'Body');
  	console.log(req.files, 'files');
	var post=req.body;
	//console.log(req.body.cse);
	//console.log("________________________________________________\n"+req.body);
	
	var company_email=req.session.companyUser_id;
	var company_name=req.session.companyName;
	var company_unq_id=req.session.companyUnqId;
	var unq_id=uuidv4();
	if(req.body.apttest==null)	req.body.apttest=0;
	if(req.body.tint==null) 	req.body.tint=0;
	if(req.body.intvwrounds==null) 	req.body.intvwrounds=0;
	if(req.body.file1==null) req.body.file1="a";
	if(req.body.file2==null) req.body.file2="";
	if(req.body.file3==null) req.body.file3="";
	if(req.body.file4==null) req.body.file4="";
	if(req.body.file5==null) req.body.file5="";
	
	req.body.file=req.body.file1+req.body.file2+req.body.file3+req.body.file4+req.body.file5;

	if(req.body.groupdsc==null) req.body.groupdsc=0;
	if(req.body.medical==null)	req.body.medical=0;

	if(req.body.resume==null) req.body.resume=0;
	if(req.body.resumedescrp==null) req.body.resumedescrp="";

	if(req.body.hrintvw==null)	req.body.hrintvw=0;
	if(req.body.techtest==null) req.body.techtest=0;

	if(req.body.rooms==null)	req.body.rooms=0;
	if(req.body.members==null)	req.body.members=0;
	if(req.body.other==null)	req.body.other="";

	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;

	var dateAdded=dateTime;
	
	if(req.body.bonus==null) req.body.bonus="";
	if(req.body.bond==null) req.body.bond=0;
	if(req.body.bonddescrp==null) req.body.bonddescrp="";

	if(req.body.cpi==null)		req.body.cpi="";

	if(req.body.cse==null)		req.body.cse=0;
	if(req.body.ee==null)		req.body.ee=0;
	if(req.body.me==null)		req.body.me=0;
	if(req.body.ss==null)		req.body.ss=0;
	if(req.body.sscse==null)	req.body.sscse=0;
	if(req.body.ssee==null)		req.body.ssee=0;
	if(req.body.ssme==null) 	req.body.ssme=0;
	if(req.body.biss==null)		req.body.biss=0;
	if(req.body.bisscse==null) 	req.body.bisscse=0;
	if(req.body.bissee==null)	req.body.bissee=0;
	if(req.body.bissme==null)	req.body.bissme=0;
	if(req.body.mme==null)		req.body.mme=0;
	if(req.body.mee==null)		req.body.mee=0;
	if(req.body.mscphy==null)	req.body.mscphy=0;
	if(req.body.mscche==null)	req.body.mscche=0;
	if(req.body.mscmath==null)	req.body.mscmath=0;

	var values=[unq_id, company_unq_id, company_name, company_email, req.body.jobdesg, req.body.jobdescrp, req.body.joindate,
			req.body.jobloc, req.body.apttest, req.body.tint, req.body.intvwrounds, req.body.groupdsc, req.body.medical, 
			req.body.resume, req.body.resumedescrp, req.body.hrintvw, req.body.techtest, req.body.cpi, req.body.rooms, req.body.members, req.body.other,
			dateAdded, req.body.ctc, req.body.gross, req.body.bonus, req.body.bond, req.body.bonddescrp, req.body.cse, req.body.ee, req.body.me, 
			req.body.ss, req.body.sscse, req.body.ssee, req.body.ssme, req.body.biss, req.body.bisscse, req.body.bissee, req.body.bissme,req.body.mme, 
			req.body.mee, req.body.mscphy, req.body.mscche, req.body.mscmath, 0, 1];

	console.log(values);
	// console.log(values.length);

	var insertqry="INSERT INTO offer (unq_id, company_id, company_name, company_email, job_desg, job_description, joining_date, job_location, aptitude_test, technical_interview, rounds, group_discussion, medical_req, shortlist_resume, shortlist_resume_specify, hr_interview, technical_test, min_cpi, rooms, members, others_logistics, date_added, salary, gross, bonus, bond, bond_description, cse, ee, me, ss, sscse, ssee, ssme, biss, bisscse, bissee, bissme, mme, mee, mscphy, mscche, mscmath, admin_verify, open) VALUES('"
					+unq_id+"','"+company_unq_id+"','"+company_name+"','"+company_email+"','"+
					String(req.body.jobdesg)+"','"+String(req.body.jobdescrp)+"','"+String(req.body.joindate)+"','"+String(req.body.jobloc)+"',"+String(req.body.apttest)+","+String(req.body.tint)+","+
					String(req.body.intvwrounds)+","+String(req.body.groupdsc)+","+String(req.body.medical)+","+String(req.body.resume)+",'"+String(req.body.resumedescrp)+"',"+String(req.body.hrintvw)+","+
					String(req.body.techtest)+",'"+String(req.body.cpi)+"','"+String(req.body.rooms)+"','"+String(req.body.members)+"','"+String(req.body.other)+"','"+
					String(dateAdded)+"',"+String(req.body.ctc)+","+String(req.body.gross)+",'"+String(req.body.bonus)+"',"+String(req.body.bond)+",'"+String(req.body.bonddescrp)+"',"+
					String(req.body.cse)+","+String(req.body.ee)+","+String(req.body.me)+","+String(req.body.ss)+","+String(req.body.sscse)+","+String(req.body.ssee)+","+
					String(req.body.ssme)+","+String(req.body.biss)+","+String(req.body.bisscse)+","+String(req.body.bissee)+","+String(req.body.bissme)+","+String(req.body.mme)+","+
					String(req.body.mee)+","+String(req.body.mscphy)+","+String(req.body.mscche)+","+String(req.body.mscmath)+","+String(0)+","+String(0)+")";

	console.log(insertqry);

	conn.query(insertqry, function(error, rows, fields){
		if(!!error)
			console.log("Error in query");
		else{
			console.log(company_email+" has added an offer with id "+ unq_id);
			res.send("You have successfully added a Job Offer. It will shown to concerned students after getting verified from Placement Cell.");
			
			//req.flash('notify', 'You have successfully added a Job Offer. It will shown to concerned students after getting verified from Placement Cell.');
    		//res.render('/company/home/');

			/*.............Sending email here on for offer confirmation..........//
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
				subject: 'Job Application Form successfully Added.';
				text: ''
			};

			transporter.sendMail(mailOptions, function(error, info){
				if (error) 
				console.log(error);
				else 
				console.log('Email sent: ' + info.response);
			}); */
		}
	});
	//.............uploading files to new directory...........//
	var moveFrom = (path.join(__dirname, '../temp/'));
	var moveTo = (path.join(__dirname, '../companyUpload/'+company_email));
	if (!fs.existsSync(moveTo))
	    fs.mkdirSync(moveTo);
	moveTo=moveTo+"/"+unq_id;
	if (!fs.existsSync(moveTo))
	    fs.mkdirSync(moveTo);
	console.log("moving from"+moveFrom);		
	console.log("moving to"+moveTo);
	// Loop through all the files in the temp directory
	fs.readdir( moveFrom, function( err, files ) {
        if( err ) {
            console.error( "Could not list the directory.", err );
            process.exit( 1 );
        } 
        files.forEach( function( file, index ) {
                // Make one pass and make the file complete
                var fromPath = path.join( moveFrom, file );
                var toPath = path.join( moveTo, file );

                fs.stat( fromPath, function( error, stat ) {
                    if( error ) {
                        console.error( "Error stating file.", error );
                        return;
                    }
                    if( stat.isFile() )
                        console.log( "'%s' is a file.", fromPath );
                    else if( stat.isDirectory() )
                        console.log( "'%s' is a directory.", fromPath );

                    fs.rename( fromPath, toPath, function( error ) {
                        if( error ) 
                            console.error( "File moving error.", error );
                        else 
                            console.log( "Moved file '%s' to '%s'.", fromPath, toPath );  
                    });
                });
        });
	});		
};

exports.viewOffer=function(req, res){
	if (req.session.companyCheck==true) {
		var unqid=req.params.unq_id;
		var qry="SELECT * FROM offer where unq_id='"+unqid+"'";
		console.log(qry);
		conn.query(qry, function(error, rows, fields){
			if(!!error)
				console.log("Error in query 1");
			var string=JSON.stringify(rows);
			var json =  JSON.parse(string);
			console.log(json);
	        res.render('company/viewoffer.ejs',{data:rows, companyName:req.session.companyName, unqid:unqid});
		});
	}
	else{
		console.log("session not found");
		res.redirect('/company/login');
	}	
};

exports.getViewStudentApplied=function(req, res){
	if (req.session.companyCheck==true) {
		var uniqid = req.params.unq_id;
		var qry="SELECT * FROM applications where uniq_id='"+uniqid+"'";
		console.log(qry);
		conn.query(qry, function(error, rows, fields){
			if(!!error)
				console.log("Error in query 1");
			var string=JSON.stringify(rows);
			var json =  JSON.parse(string);
			console.log(json);
			var qry2="SELECT * FROM offer where unq_id='"+uniqid+"'";
			console.log(qry2);
			conn.query(qry2, function(error, rows2, fields){
				if(!!error)
					console.log("Error in query 2");
				
		        res.render('company/viewStudents.ejs',{data2:rows2,data:rows, companyName:req.session.companyName, unqid:uniqid});
			});
	        //res.render('company/viewStudents.ejs',{data:rows, companyName:req.session.companyName, unqid:uniqid});
		});
	}
	else{
		console.log("session not found");
		res.redirect('/company/login');
	}	
};

exports.postViewResume=function(req, res){
	var rnumber = req.body.rnumber;
	var uniqid = req.params.unq_id;
	var studentid = req.params.student_id;
	var qry="SELECT * FROM applications where uniq_id='"+uniqid+"' and student_id = '"+studentid+"' ";
	console.log(rnumber);
	conn.query(qry, function(error, rows, fields){
		if(rows.length==1){
			var file = fs.createReadStream('resume/'+studentid+'/resume'+rnumber+'.pdf');
			var stat = fs.statSync('resume/'+studentid+'/resume'+rnumber+'.pdf');
			res.setHeader('Content-Length', stat.size);
			res.setHeader('Content-Type', 'application/pdf');
			file.pipe(res);
		}
	});
};

exports.get404 = function(req, res) {
    res.status(404).send('404 Page not found');
};