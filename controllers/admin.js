var conn=require('../db.js');
var path = require('path');
var fs =require('fs-extra');
var bodyParser = require('body-parser');
var Archiver = require('archiver');



exports.getDownloadZip=function(req, res){
	if (req.session.adminCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		var uniqid = req.params.unq_id;
    	console.log("dfscx");
    	var qry="SELECT * FROM applications where uniq_id='"+uniqid+"'";
		console.log(qry);
		conn.query(qry, function(error, rows, fields){
			if(error)
				console.log("Error in query 1");
			else if(rows.length==0)
				console.log("No Applications");
			else{
				
					len=rows.length;
					var zip = Archiver('zip');
					zip.pipe(res);
					for(var i=0;i<rows.length;i++){
						var pathFile = 'resume/'+rows[i].student_id+'/resume'+rows[i].resume_selected+'.pdf';
						var nameFile = uniqid+'/'+rows[i].name+'_IIT_Jodhpur.pdf';
						zip.file(pathFile, { name: nameFile });
					}
					zip.finalize();
			}
		});				
  	}
  	else {
  		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
};
exports.getLogin = function (req, res) {
	var num1 = Math.floor(Math.random() * 99) + 1;
	var num2 = Math.floor(Math.random() * 99) + 1;
	var operator = Math.floor(Math.random() * 2) + 0;
	var op = '';
	var ans = 0;
	if (operator == 0) {
		op = '+';
		ans = num1 + num2;
	}
	else {
		op = '-';
		ans = num1 - num2;
	}
	var str = String(num1) + op + String(num2);
	console.log(num1);
	console.log(num2);
	console.log(operator);
	console.log(str);
	console.log(ans);
	var statusText = "";
	var passedVariable = req.query.valid;
	if (passedVariable == 'false') statusText = "Sorry, That didn't work !";
	if (passedVariable == 'false2') statusText = "Wrong Captcha. Try Again !";
	if (req.session.adminCheck == true) {
		res.redirect('/admin/home');
	}
	else {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("../views/admin/login.ejs", { status: statusText, captchaVal: str, captchaAns: ans });
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
  		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
};

exports.getRegister=function (req, res) {
    var statusText = "";
    var passedVariable = req.query.valid;
    if (passedVariable == 'false') statusText = "Both passwords are not matching";
    if (passedVariable == 'error') statusText = "Sorry, That didn't work !";
    if (req.session.adminCheck == true) {
        res.redirect('/admin/home');
    }
    else{
        res.render("../views/admin/register.ejs", { status: statusText });
    }
};

exports.Register=function (req, res) {
	if (req.session.adminCheck==true) {
		res.redirect('/admin/home');
	}
	else{
		var post=req.body;
		console.log(post.xpass);
		var pass = post.xpass;
		var cpass = post.cxpass;
	    if (req.session.adminCheck == true) {
	        res.redirect('/admin/home');
	    }
	    else if(pass==cpass){
	        var insertQry="INSERT INTO admin (name,id,password)" + " VALUES('"+post.xname+"','"+post.xuser+"',MD5('"+post.xpass+"'))";
	        conn.query(insertQry, function(error1, rows1, fields) {
	            if(!error1){
	            	req.session.adminUser_id = post.xuser;
					req.session.adminCheck=true;
					req.session.adminName=post.xname;
	                res.redirect('/admin/home');
	            }
	            else{
	            	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	            	var str = encodeURIComponent('error');
	        		res.redirect('/admin/register/?valid=' + str);
	            }
	        });
	    }
	    else{
	    	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	    	var str = encodeURIComponent('false');
	        res.redirect('/admin/register/?valid=' + str);
	    }
	}
};

exports.getViewStudentsCredentials=function(req, res){
	if (req.session.adminCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.adminUser_id);
    	var qry="SELECT * FROM students where 1";
	    conn.query(qry, function(error, rows, fields){
			console.log("Length "+rows.length);
			if(!error){
				res.render("../views/admin/credentials.ejs",{data:rows});
			}
		});
	    
  	}
  	else {
  		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
};

exports.getViewPlacedStudents=function(req, res){
	if (req.session.adminCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.adminUser_id);
    	var qry="SELECT * FROM students where placed=1";
	    conn.query(qry, function(error, rows, fields){
			console.log("Length "+rows.length);
			if(!error){
				res.render("../views/admin/viewPlacedStudents.ejs",{data:rows});
			}
		});
	    
  	}
  	else {
  		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
};

exports.postLogin=function (req, res) {
  	var post = req.body;
	var qry="SELECT * FROM admin where id='"+post.xuser+"' and password =MD5('"+post.xpass+"')";
	console.log(qry);
	if (post.xcaptchaansbot != post.xcaptchaansuser) {
		var str = encodeURIComponent('false2');
		res.redirect('/admin/login/?valid=' + str);
		return;
	}
	conn.query(qry, function(error, rows, fields){
	// if(!!error)
	// 	console.log("Error in query");
	// else{
		//parse with your rows
		if(error){
        	var str = encodeURIComponent('false');
            res.redirect('/admin/login/?valid=' + str);
        }
        else if(rows.length==1){
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
  		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
};

exports.postVerifyResume=function(req, res){
	if (req.session.adminCheck==true) {
		var post = req.body;
		var user = post.xUser;
		res.redirect('/admin/verifyResume/'+user);
	}
	else {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
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
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('admin/resumeByUserName.ejs', {data:resumeStatus,userName:user});
			} 
			else{
				res.redirect('/admin/home');
			}
		});
	    
  	}
  	else {
  		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
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
		var filepath = ('resume/'+user+'/'+resumeName+'.pdf');
        if (fs.existsSync(filepath)){
        	var file = fs.createReadStream('resume/'+user+'/'+resumeName+'.pdf');
			var stat = fs.statSync('resume/'+user+'/'+resumeName+'.pdf');
			res.setHeader('Content-Length', stat.size);
			res.setHeader('Content-Type', 'application/pdf');
			file.pipe(res);
		console.log("here");
        }
        else{
			res.status(404).send('File Does Not Exist');
		}
  	}
  	else {
  		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
};

exports.postVerification=function(req, res){
	if (req.session.adminCheck==true) {
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
		else if(result=="no"){
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
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.redirect('/admin/verifyResume/'+user);
	}
	else {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
};

exports.getLogout=function (req, res) {
	console.log("logging out "+ req.session.adminUser_id);
	delete req.session.adminUser_id;
	req.session.adminCheck=false;
	res.redirect('/admin/login');
};

exports.viewCompany=function(req, res){
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if (req.session.adminCheck==true) {
		var qry="SELECT * FROM company";
		console.log(qry);
		conn.query(qry, function(error, rows, fields){
			if(!!error)
				console.log("Error in query");
			var string=JSON.stringify(rows);
			var json =  JSON.parse(string);
			console.log(json);
	        res.render('admin/viewCompany.ejs',{data:rows, adminName:req.session.adminName});
		});
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');		
	}
};

exports.getViewOffers=function(req, res){
	if (req.session.adminCheck==true) {
		var unqid= req.params.unqid;
		var companyRow;
		var qry1="SELECT * FROM offer where company_id='"+unqid+"'";	
		var qry2="SELECT * FROM company where unq_id='"+unqid+"'";	
		console.log(qry1);
		conn.query(qry1, function(error, rows1, fields){
			if(!!error)
				console.log("Error in query 1");
			var string=JSON.stringify(rows1);
			var json =  JSON.parse(string);
			console.log(json);
			conn.query(qry2, function(error, rows2, fields){
				if(!!error)
				console.log("Error in query 2");
				string=JSON.stringify(rows2);
				json =  JSON.parse(string);
				console.log(json);
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	        	res.render('admin/viewOffer.ejs',{data:rows1, data2:rows2, adminName:req.session.adminName, unqid:unqid});		
			});
		});
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');	
	}
};

exports.approveOffer=function(req, res){
	if(req.session.adminCheck==true){
		var unqid=req.params.unqid;
		console.log("Admin approval for offer id : "+ unqid);
		var qry="UPDATE offer SET admin_verify=1 WHERE unq_id='"+unqid+"'";
		console.log(qry);
		conn.query(qry, function(error, rows, fields){
			if(!!error)
				console.log("Error in query");
		});	
		var qry2="SELECT * FROM offer where unq_id='"+unqid+"'";
		conn.query(qry2, function(error, rows2, fields){
				if(!!error)
					console.log("Error in query 2");
				var string=JSON.stringify(rows2);
				var json =  JSON.parse(string);
				console.log(json);
	        	res.redirect('/admin/viewOffers/'+json[0].company_id);
		});	
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.redirect('/admin/login');
	}
};

exports.getViewStudentApplied=function(req, res){
	if (req.session.adminCheck==true) {
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
				
		        res.render('admin/viewStudents.ejs',{data2:rows2,data:rows, companyName:req.session.companyName, unqid:uniqid});
			});
	        //res.render('company/viewStudents.ejs',{data:rows, companyName:req.session.companyName, unqid:uniqid});
		});
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.redirect('/admin/login');
	}	
};

exports.getViewSelectedResume=function(req, res){
	if (req.session.adminCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log(req.params.resumeNumber);
    	var user = req.params.student_id;
    	var resumeName = req.params.resumeNumber;
		//res.render('resume/'+user+'/'+resumeName+'.pdf');
		var file = fs.createReadStream('resume/'+user+'/'+resumeName+'.pdf');
		var stat = fs.statSync('resume/'+user+'/'+resumeName+'.pdf');
		res.setHeader('Content-Length', stat.size);
		res.setHeader('Content-Type', 'application/pdf');
		file.pipe(res);
  	}
  	else {
  		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
};

exports.openOffer=function(req, res){
	if(req.session.adminCheck==true){
		var unqid=req.params.unqid;
		console.log("Opening offer id : "+ unqid);
		var qry="UPDATE offer SET open=1, admin_verify=1 WHERE unq_id='"+unqid+"'";
		console.log(qry);
		conn.query(qry, function(error, rows, fields){
			if(!!error)
				console.log("Error in query");
		});
		var qry2="SELECT * FROM offer where unq_id='"+unqid+"'";
		conn.query(qry2, function(error, rows2, fields){
				if(!!error)
					console.log("Error in query 2");
				var string=JSON.stringify(rows2);
				var json =  JSON.parse(string);
				console.log(json);
	        	res.redirect('/admin/viewOffers/'+json[0].company_id);
		});	
	}
	else{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.redirect('/admin/login');
	}
};

exports.getPlaceStudent=function(req, res){
	if (req.session.adminCheck==true) {
		var qry="SELECT * FROM students where placed=0";
		console.log(qry);
		conn.query(qry, function(error, rows, fields){
			//console.log("Length "+rows.length);
			if(error){
						
			}
			else if(rows.length>0){
				var qry2="SELECT * FROM offer where 1";
				console.log(qry2);
				conn.query(qry2, function(error2, rows2, fields){
					//console.log("Length "+rows2.length);
					if(error2){

					}
					else if(rows2.length>0){
						
						res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		    			console.log("logged in as "+req.session.adminUser_id);
			    		res.render('admin/placeStudent.ejs', {adminName:req.session.adminName,studentData:rows,offerData:rows2});
					} 
					else{
						res.redirect('/admin/home');
					}
				});
			} 
			else{
				res.redirect('/admin/home');
			}
		});
				//argument to render function is a javascript objet
  	}
  	else {
  		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
};

exports.postPlaceStudent=function(req, res){
	if (req.session.adminCheck==true) {
		var post = req.body;
		var userData = post.xUser;
		var offerData = post.xOffer;
		//console.log(offer);
		//console.log(user);
		var temp = "";
		var offer = [];
		for(var i=0;i<offerData.length;i++){
			if(offerData[i]=="^"){
				offer.push(temp);
				temp="";
			}
			else{
				temp = temp + offerData[i];
			}
		}
		offer.push(temp);
		var user = [];
		temp="";
		for(var i=0;i<userData.length;i++){
			if(userData[i]=="^"){
				user.push(temp);
				temp="";
			}
			else{
				temp = temp + userData[i];
			}
		}
		user.push(temp);
		if(offer[1]==user[1]){
			var qry = "UPDATE students SET placed ='"+1+"', company_name = '"+offer[2]+"', ctc = '"+offer[3]+"' WHERE ldap_id='"+user[0]+"' ";
			console.log(qry);
			conn.query(qry,function(error, rows, fields){
				if(!error){
					console.log("success");
					var str = encodeURIComponent('true');
					res.redirect('/admin/home');
				}
				else{
					console.log("Unsuccess");
					var str = encodeURIComponent('true');
					res.redirect('/admin/verifyResume');
				}
			});
		}
		else{
			console.log("NOT Matched");
			console.log(offer[1]);
		}
		console.log(offer);
		console.log(user);
  	}
  	else {
  		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  	res.redirect('/admin/login');
  	}
};


exports.get404 = function(req, res) {
    res.status(404).send('404 Page not found');
};