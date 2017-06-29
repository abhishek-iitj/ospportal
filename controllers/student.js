//writing all the callback of the routes here
var express = require('express');   
var app = express();
var bodyParser = require('body-parser'); 
var formidable = require('formidable');
var path = require('path');
var fs =require('fs-extra');
var conn=require('../db.js');

exports.getLogin = function(req, res){
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
};

exports.getHome=function(req, res){
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
};
//var resumeStatus;
exports.postLogin=function (req, res){
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
			req.session.resumeStatus = [ rows[0].resume1, rows[0].resume2, rows[0].resume3, rows[0].resume4, rows[0].resume5 ];
			//req.session.resume_uploaded=rows[0].resume_uploaded;
			//req.session.resume_verified=rows[0].resume_verified;
			req.session.studentCheck=true;
			res.redirect('/student/home');
		}
		else {
			var str = encodeURIComponent('false');
			res.redirect('/student/login/?valid=' +str);
		}
	});
};

exports.getUploadResume=function(req, res){
	var statusText="";
	var statusColor="red";
	var passedVariable = req.query.valid;
	if(passedVariable=='false'){
		statusText="Sorry, That didn't work !";
	}
	else if(passedVariable=='true'){
		statusText="Resume Successfully Uploaded";
		statusColor="green";
	}
	if (req.session.studentCheck==true) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    	console.log("logged in as "+req.session.studentUser_id);
	    res.render('student/uploadResume.ejs', {status:statusText,colour:statusColor,data:req.session.resumeStatus,verified:"Verified",uploaded:"Uploaded",notUploaded:"Not Uploaded"});
  	}
  	else {
	  	res.redirect('/student/login');
  	}
};

exports.postUploadResume=function (req, res){
	var index;
	for(index=0;index<5;index++){
		if(req.session.resumeStatus[index]==0){
			break;
		}
	}
	index++;
	console.log(index);
	var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
    	fs.stat("resume/" + req.session.studentUser_id, function (err, stats){
        	if(err){
          		fs.mkdir("resume/" + req.session.studentUser_id);
          		console.log("making folder");
	        }
	        req.session.resumeStatus[index-1]++;
	        fs.rename(files.fileUploaded.path, 'resume/' +req.session.studentUser_id+'/'+'resume'+index+'.pdf', function(err) {
		        if (err){
		        	req.session.resumeStatus[index-1]--;
		            var str = encodeURIComponent('false');
					res.redirect('/student/uploadResume/?valid=' +str);
		        }
		        else{
		        	console.log("Inserting file");
		        	var qry = "UPDATE students SET resume"+index+"='"+req.session.resumeStatus[index-1]+"' WHERE ldap_id='"+req.session.studentUser_id+"'";
		        	console.log(qry);
		        	conn.query(qry, function(error, rows, fields){
		        		if(!error){
		        			console.log("success");
		        		}
		        		else{
		        			console.log("Unsuccess");
		        		}
	
		        	});
		        	var str = encodeURIComponent('true');
					res.redirect('/student/uploadResume/?valid=' +str);
		        }
        	});
      	});
    });
};

exports.getEditDetails=function(req, res){
	var statusText="";
	var statusColor="red";
	var passedVariable = req.query.valid;
	if(passedVariable=='false'){
		statusText="Sorry, That didn't work !";
	}
	else if(passedVariable=='true'){
		statusText="Changes Successfully Saved";
		statusColor="green";
	}
	if (req.session.studentCheck==true) {
		var qry="SELECT * FROM students where ldap_id='"+req.session.studentUser_id+"'";
		console.log(qry);
		conn.query(qry, function(error, rows, fields){
			console.log("Length "+rows.length);
			if(rows.length==1){
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    			console.log("logged in as "+req.session.studentUser_id);
				res.render('student/editDetails.ejs', {status:statusText,colour:statusColor,data:rows});
				//res.redirect('/student/home');
			}
			else{
				res.redirect('/student/logout');
			}
		});
  	}
  	else {
	  	res.redirect('/student/login');
  	}
};

exports.postEditDetails=function(req, res){
	if(req.body.hasOwnProperty("cancel")){
     	console.log("Cancel button clicked");
     	res.redirect('/student/home');
  	}
  	else{
		var post = req.body;
		var parentName = post.xparentsName;
		var dob = post.xdob;
		var category = post.xcategory;
		var bloodGroup = post.xbloodGroup;
		var jeeRank = post.xjeeRank;
		var roomNumber = post.xroomNumber;
		var hobbies = post.xhobbies;
		var nationality = post.xnationality;
		var pdStatus = post.xpdStatus;
		var permanentAddress = post.xpermanentAddress;
		var currentAddress = post.xcurrentAddress;
		var xYear = post.xYear;
		var xBoardName = post.xBoardName;
		var xPercentage = post.xPercentage;
		var xiiYear = post.xiiYear;
		var xiiBoardName = post.xiiBoardName;
		var xiiPercentage = post.xiiPercentage;
		
		var data = [parentName, dob, category, bloodGroup, jeeRank, roomNumber, hobbies, nationality, pdStatus,
					permanentAddress, currentAddress, xYear, xBoardName, xPercentage,  xiiYear, xiiBoardName, xiiPercentage ];
		
		var qry = "UPDATE students SET parents_name = '"+data[0]+"', dob = '"+data[1]+"', category = '"+data[2]+"', bgroup = '"+data[3]+"', hobbies = '"+data[6]+"' ,jee_air = '"+data[4]+"', room_no =  '"+data[5]+"',"+ 
					" nationality = '"+data[7]+"', pd_status = '"+data[8]+"', permanent_address = '"+data[9]+"', current_address = '"+data[10]+"', x_year = '"+data[11]+"', x_board_name = '"+data[12]+"',"+
					" x_percentage = '"+data[13]+"',  xii_year = '"+data[14]+"', xii_board_name = '"+data[15]+"', xii_percentage = '"+data[16]+"'" + 
					"WHERE ldap_id='"+req.session.studentUser_id+"' ";
		console.log(qry);
		
		conn.query(qry,function(error, rows, fields){
			if(!error){
				console.log("success");
				var str = encodeURIComponent('true');
				res.redirect('/student/editDetails/?valid=' +str);
			}
			else{
				console.log("Unsuccess");
				var str = encodeURIComponent('false');
				res.redirect('/student/editDetails/?valid=' +str);
			}
		});
	}

};

exports.getLogout= function (req, res) {
	console.log("logging out "+ req.session.studentUser_id);
	delete req.session.studentUser_id;
	delete req.session.studentName;
	req.session.studentCheck=false;
	res.redirect('/student/login');
};