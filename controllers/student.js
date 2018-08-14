//writing all the callback of the routes here
// var express = require('express');
// var app = express();
var bodyParser = require('body-parser');
// var formidable = require('formidable');
// var path = require('path');
// var fs = require('fs-extra');
// var conn = require('../db.js');
var Busboy = require('busboy');
var conn=require('../db.js');
var nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');
var today = new Date();
var flash = require('express-flash-messages');
var multer  = require('multer')
var upload = multer({ dest: 'temp/' })
var fs = require('fs');
var path = require('path');
var process = require( "process" );


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
    if (passedVariable == 'false') statusText = "Not Registered or Wrong credentials";
    if (passedVariable == 'false2') statusText = "Wrong Captcha. Try Again !";
    if (req.session.studentCheck == true) {
        res.redirect('/student/home');
    }
    else {
        // var stausText="Kindly fill in these fields";
        // if(req.params.status=="false") statusText="Wrong credentials";
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        //res.render(__dirname+"/views/student/login.ejs", {status:statusText});
        res.render("../views/student/login.ejs", { status: statusText, captchaVal: str, captchaAns: ans });
    }
};

exports.getHome = function(req, res) {
    console.log(req.session.studentFilledDetails);
    if (req.session.studentCheck == true && req.session.studentFilledDetails == 1) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        //console.log("logged in as " + req.session.studentUser_id);
        //res.send('Hi '+ req.session.studentUser_id + '<a href="/student/logout"> Logout</a>');
        //res.sendFile(__dirname+"/index.ejs");
        res.render('student/home.ejs', { studentName: req.session.studentName }); //argument to render function is a javascript objet
    } 
    else if(req.session.studentFilledDetails == 0){
        var str = encodeURIComponent('false');
        res.redirect('/student/editDetails/?valid=' + str);
    }
    else {
        console.log("here2");
        res.redirect('/student/login');
    }
};
exports.postLogin = function(req, res) {
    var post = req.body;
    var qry = "SELECT * FROM students where ldap_id='" + post.xuser + "' and ldap_pass='" + post.xpass + "'";
    console.log(qry);
    if (post.xcaptchaansbot != post.xcaptchaansuser) {
        var str = encodeURIComponent('false2');
        res.redirect('/student/login/?valid=' + str);
        return;
    }
    conn.query(qry, function(error, rows, fields) {
        //console.log("Length " + rows.length);
        if(error){
        	var str = encodeURIComponent('false');
            res.redirect('/student/login/?valid=' + str);
        }
        else if (rows.length == 1) {
            console.log("Successfull query");
            req.session.studentUser_id = rows[0].ldap_id;
            req.session.studentName = rows[0].name;
            req.session.studentBranch = rows[0].branch;
            req.session.studentFilledDetails=rows[0].details_status;
            req.session.resumeStatus = [rows[0].resume1, rows[0].resume2, rows[0].resume3, rows[0].resume4, rows[0].resume5];
            req.session.studentCheck = true;
            req.session.studentYear = rows[0].year;
            req.session.studentYear = rows[0].year;
            req.session.studentCpi = rows[0].cpi;
            res.redirect('/student/home');
        } else {
            var str = encodeURIComponent('false');
            res.redirect('/student/login/?valid=' + str);
        }
    });
};

exports.getRegister=function (req, res) {
    var statusText = "";
    var passedVariable = req.query.valid;
    if (passedVariable == 'false') statusText = "Roll Number Incorrect";
    if (passedVariable == 'already_registered') statusText = "You are already registered";
    if (passedVariable == 'passwords_not_matching') statusText = "Both passwords are not matching";
    if (passedVariable == 'error') statusText = "Sorry, That didn't work !";
    if (req.session.studentCheck == true) {
        res.redirect('/student/home');
    }
    else{
        res.render("../views/student/register.ejs", { status: statusText });
    }
};




exports.Register=function (req, res) {
    if (req.session.studentCheck == true) {
        res.redirect('/student/home');
    }
    else{
        var post=req.body;
        var roll_no=post.xuser;
        var qry = "SELECT * FROM eligible_students where roll_no='" + post.xuser + "'";
        console.log(qry);
        conn.query(qry, function(error, rows, fields) {
            console.log("Length " + post.xuser);
            if (rows.length == 1) {
                if(rows[0].status==0){
                    if(post.xpass==post.cxpass){
                        var uqry = "UPDATE eligible_students SET status = 1 WHERE roll_no='" +post.xuser+ "' ";
                        console.log(uqry);

                        conn.query(uqry, function(error0, rows0, fields) {
                            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                            if (!error0) {
                                var insertQry="INSERT INTO students (ldap_id,roll_no,ldap_pass,year,name,branch)" + " VALUES('"+rows[0].roll_no+"','"+rows[0].roll_no+"','"+post.xpass+
                                "','"+rows[0].year+"','"+post.xname+"','"+rows[0].branch+"')";
                                conn.query(insertQry, function(error1, rows1, fields) {
                                    if(error1){
                                        console.log("Error in query");
                                        var str = encodeURIComponent('error');
                                        res.redirect('/student/register/?valid=' + str);
                                    }
                                    else{
                                        req.session.studentUser_id = rows[0].roll_no;
                                        //req.session.studentName = rows[0].name;
                                        req.session.studentBranch = rows[0].branch;
                                        req.session.studentFilledDetails = 0;
                                        req.session.resumeStatus = [0,0,0,0,0];
                                        req.session.studentCheck = true;
                                        req.session.studentYear = rows[0].year;
                                        res.redirect('/student/home');
                                    }
                                });
                            } 
                            else {
                                console.log("Error in uquery");
                                var str = encodeURIComponent('error');
                                res.redirect('/student/register/?valid=' + str);  
                            }
                        });
                    }
                    else{
                        var str = encodeURIComponent('passwords_not_matching');
                        res.redirect('/student/register/?valid=' + str);
                    }
                }
                else{
                    var str = encodeURIComponent('already_registered');
                    res.redirect('/student/register/?valid=' + str);
                }
            } 
            else {
                var str = encodeURIComponent('false');
                res.redirect('/student/register/?valid=' + str);
            }
        });
    }
};

exports.getUploadResume = function(req, res) {
    var statusText = "";
    var statusColor = "red";
    var passedVariable = req.query.valid;
    if (passedVariable == 'false') {
        statusText = "Sorry, That didn't work !";
    } 
    else if (passedVariable == 'true') {
        statusText = "Resume Successfully Uploaded";
        statusColor = "green";
    }
    else if(passedVariable == 'limitExceed'){
        statusText = "Cannot Upload more resumes";
    }
    else if(passedVariable == 'typeError'){
        statusText = "File must be pdf";
    }
    if (req.session.studentCheck == true && req.session.studentFilledDetails == 1) {
        var qry = "SELECT * FROM students where ldap_id='" + req.session.studentUser_id +"'";
        conn.query(qry, function(error, rows, fields) {
            console.log("Length " + rows.length);
            if (rows.length == 1) {
                console.log("Successfull query\n" + rows[0].name);
                req.session.resumeStatus = [rows[0].resume1, rows[0].resume2, rows[0].resume3, rows[0].resume4, rows[0].resume5];
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                console.log("logged in as " + req.session.studentUser_id);
                res.render('student/uploadResume.ejs', { status: statusText, userName: req.session.studentUser_id,colour: statusColor, data: req.session.resumeStatus, verified: "Verified", uploaded: "Uploaded", notUploaded: "Not Uploaded" });
            } 
            else {
                //var str = encodeURIComponent('false');
                res.redirect('/student/login');
            }
        });
    }
    else if(req.session.studentFilledDetails == 0){
        var str = encodeURIComponent('false');
        res.redirect('/student/editDetails/?valid=' + str);
    } 
    else {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.redirect('/student/login');
    }
};

exports.postUploadResume=function(req, res){
    if (req.session.studentCheck == true && req.session.studentFilledDetails == 1) {
        var qry = "SELECT * FROM students where ldap_id='" + req.session.studentUser_id +"'";
        conn.query(qry, function(error, rows3, fields) {
            console.log("Length " + rows3.length);
            if (rows3.length == 1) {
                console.log("Successfull query\n" + rows3[0].name);
                req.session.resumeStatus = [rows3[0].resume1, rows3[0].resume2, rows3[0].resume3, rows3[0].resume4, rows3[0].resume5];
                //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                //console.log("logged in as " + req.session.studentUser_id);
                //res.render('student/uploadResume.ejs', { status: statusText, colour: statusColor, data: req.session.resumeStatus, verified: "Verified", uploaded: "Uploaded", notUploaded: "Not Uploaded" });
                var index;
                for (index = 0; index < 5; index++) {
                    if (req.session.resumeStatus[index] == 0) {
                        break;
                    }
                }
                index++;
                console.log("index "+index);
                if(index==6){
                    var str = encodeURIComponent('limitExceed');
                    res.redirect('/student/uploadResume/?valid=' + str);
                }
                else{
                    var moveTo = (path.join(__dirname, '../resume/'+req.session.studentUser_id));
                    if (!fs.existsSync(moveTo))
                        fs.mkdirSync(moveTo);
                    console.log(moveTo);
                    var busboy = new Busboy({ headers: req.headers });
                    busboy.on('field', function(fieldname, val) {
                      req.body[fieldname] = val;
                    });
                    console.log("break1");
                    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                        fstream = fs.createWriteStream(moveTo+"/resume"+index+".pdf");
                        file.pipe(fstream);
                        fstream.on('close', function(){
                           file.resume();
                        });
                    });
                    req.session.resumeStatus[index - 1]++;
                    console.log("break2");
                    var qry = "UPDATE students SET resume" + index + "='" + req.session.resumeStatus[index - 1] + "' WHERE ldap_id='" + req.session.studentUser_id + "'";
                    console.log(qry);
                    conn.query(qry, function(error, rows, fields) {
                        if (!error) {
                            console.log("success");
                        } else {
                            console.log("Unsuccess");
                        }

                    });
                    var str = encodeURIComponent('true');
                    res.redirect('/student/uploadResume/?valid=' + str);
                    return req.pipe(busboy);
                }   
            } 
            else {
                //var str = encodeURIComponent('false');
                res.redirect('/student/login');
            }
        });
    }
    else if(req.session.studentFilledDetails == 0){
        var str = encodeURIComponent('false');
        res.redirect('/student/editDetails/?valid=' + str);
    }
    else {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.redirect('/student/login');
    }
};

/*exports.postUploadResume = function(req, res) {
    console.log(req.files, 'files');
    if (req.session.studentCheck == true) {
        var index;
        for (index = 0; index < 5; index++) {
            if (req.session.resumeStatus[index] == 0) {
                break;
            }
        }
        index++;
        //var index2=index+1;
        console.log(index);
        var form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
            fs.stat("resume/" + req.session.studentUser_id, function(err, stats) {
                if (err) {
                    fs.mkdir("resume/" + req.session.studentUser_id);
                    console.log("making folder");
                }
                console.log(files.fileUploaded.path);
                req.session.resumeStatus[index - 1]++;
                fs.rename(files.fileUploaded.path, 'resume/' + req.session.studentUser_id + '/' + 'resume' + index + '.pdf', function(err) {
                    if (err) {
                        req.session.resumeStatus[index - 1]--;
                        var str = encodeURIComponent('false');
                        res.redirect('/student/uploadResume/?valid=' + str);
                    } 
                    else {
                        console.log("Inserting file");
                        var qry = "UPDATE students SET resume" + index + "='" + req.session.resumeStatus[index - 1] + "' WHERE ldap_id='" + req.session.studentUser_id + "'";
                        console.log(qry);
                        conn.query(qry, function(error, rows, fields) {
                            if (!error) {
                                console.log("success");
                            } else {
                                console.log("Unsuccess");
                            }

                        });
                        var str = encodeURIComponent('true');
                        res.redirect('/student/uploadResume/?valid=' + str);
                    }
                });
            });
        });
    }
    else {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.redirect('/student/login');
    }
};*/

exports.getEditDetails = function(req, res) {
    console.log("inside");
    var statusText = "None";
    var statusColor = "red";
    var passedVariable = req.query.valid;
    if (passedVariable == 'false') {
        statusText = "Fill your details first !";
    } 
    else if (passedVariable == 'true') {
        statusText = "Changes Successfully Saved";
        statusColor = "green";
    }
    else{
        statusText = "None";
    }
    if (req.session.studentCheck == true) {
        var qry = "SELECT * FROM students where ldap_id='" + req.session.studentUser_id + "'";
        console.log(qry);
        conn.query(qry, function(error, rows, fields) {
            console.log("Length " + rows.length);
            if(rows.length == 1 && statusText == "None"){
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                console.log("first case");
                res.render('student/editDetails.ejs', { status:"", colour: statusColor, data: rows });
            }
            else if (rows.length == 1 && ( (rows[0].details_status==1 && passedVariable == 'true') || (rows[0].details_status==0 && passedVariable == 'false') )  ){
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                console.log("logged in as " + req.session.studentUser_id);
                res.render('student/editDetails.ejs', { status: statusText, colour: statusColor, data: rows });
                //res.redirect('/student/home');
            }
            else if(rows.length == 1 && rows[0].details_status==0 && passedVariable == 'true'){
                var str = encodeURIComponent('false');
                res.redirect('/student/editDetails/?valid=' + str);
            } 
            else if(rows.length == 1 && rows[0].details_status==1 && passedVariable == 'false'){
                var str = encodeURIComponent('true');
                res.redirect('/student/editDetails/?valid=' + str);
            }
            else {
                res.redirect('/student/logout');
            }
        });
    }
    else {
        res.redirect('/student/login');
    }
};

exports.postEditDetails = function(req, res) {
    if (req.session.studentCheck == true) {
        if (req.body.hasOwnProperty("cancel")) {
            console.log("Cancel button clicked");
            res.redirect('/student/home');
        } else {
            var post = req.body;
            var name = post.xName;
            var phn = post.xphone;
            var mail = post.xmail;
            var parentName = post.xparentsName;
            var dob = post.xdob;
            //var cpi = post.xcpi;
            var cpi = "0";
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
                permanentAddress, currentAddress, xYear, xBoardName, xPercentage, xiiYear, xiiBoardName, xiiPercentage , cpi , name , phn , mail
            ];
            //"', cpi = '" + data[17] +
            var qry = "UPDATE students SET parents_name = '" + data[0] + "', details_status = 1, phone = '" + data[19] + "', email = '" + data[20] + "', name = '" + data[18] + 
                "',dob = '" + data[1] + "', category = '" + data[2] + "', bgroup = '" + data[3] +"', hobbies = '" + data[6] + "' ,jee_air = '" + data[4] + "', room_no =  '" + data[5] + "'," +
                " nationality = '" + data[7] + "', pd_status = '" + data[8] + "', permanent_address = '" + data[9] + "', current_address = '" + data[10] + "', x_year = '" + data[11] + "', x_board_name = '" + data[12] + "'," +
                " x_percentage = '" + data[13] + "',  xii_year = '" + data[14] + "', xii_board_name = '" + data[15] + "', xii_percentage = '" + data[16] + "'" +
                "WHERE ldap_id='" + req.session.studentUser_id + "' ";
            console.log(qry);

            conn.query(qry, function(error, rows, fields) {
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                if (!error) {
                    console.log("success");
                    req.session.studentFilledDetails = 1;
                    req.session.studentName = name;
                    req.session.studentCpi = data[17];
                    var str = encodeURIComponent('true');
                    res.redirect('/student/editDetails/?valid=' + str);
                } else {
                    console.log("Unsuccess");
                    var str = encodeURIComponent('false');
                    res.redirect('/student/editDetails/?valid=' + str);
                }
            });
        }
    }
    else {
        console.log("eft");
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.redirect('/student/login');
    }

};

exports.getViewOffers = function(req, res) {
    console.log("get");
    if (req.session.studentCheck == true && req.session.studentFilledDetails == 1) {
        var statusText = "";
        var passedVariable = req.query.valid;
        if (passedVariable == 'false') {
            statusText = "Sorry, That didn't work !";
        }
        var qry1 = "SELECT * FROM offer WHERE " + req.session.studentBranch + " = 1 and admin_verify = 1 and open = 1 and type='" + req.session.studentYear + "'";
        //var qry="SELECT * FROM students where ldap_id='"+req.session.studentUser_id+"'";
        console.log(qry1);
        conn.query(qry1, function(error, rows1, fields) {
            //console.log("dwa " + rows1.length);
            if(rows1){
                var qry2 = "SELECT * FROM applications where student_id='" + req.session.studentUser_id + "'";
                console.log(qry2);
                conn.query(qry2, function(error, rows2, fields) {
                    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    console.log("dwwa " + rows2.length + req.session.studentName + rows1.length);
                    // console.log("Minm student cpi\t\t\t"+ req.session.studentCpi);
                    // console.log("Minm cpi\t\t\t"+ rows1[0].min_cpi);
                    res.render('student/viewoffer.ejs', { studentCpi:req.session.studentCpi,status: statusText, studentName: req.session.studentName, data1: rows1, data2: rows2, len1: rows1.length, len2: rows2.length });
                    //res.render('student/login.ejs');
                });
            }
            else{
                var rows2;
                res.render('student/viewoffer.ejs', { studentCpi:req.session.studentCpi,status: statusText, studentName: req.session.studentName, data1: rows1, data2: rows2, len1: 0, len2: 0 });
            }
        });
    }
    else if(req.session.studentFilledDetails == 0){
        var str = encodeURIComponent('false');
        res.redirect('/student/editDetails/?valid=' + str);
    } 
    else {
        res.redirect('/student/login');
    }
};



exports.getApplyOffer = function(req, res) {
    console.log("fsc");
    if (req.session.studentCheck == true && req.session.studentFilledDetails == 1) {
        //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        var cond = req.params.status;
        var uniqid = req.params.uniq_id;
        var statusText = "";
        var rnumber;
        var passedVariable = req.query.valid;
        var flag=1;
        //console.log(flag);
        if (passedVariable == 'false' && cond == "applyNow") {
            statusText = "Please select resume before applying for the offer";
        } else if (cond == "applied") {
            statusText = "You have applied for this offer";
        }
        else if(cond=="applyNow"){

        }
        else {
            flag=0;
        }
        console.log(flag);
        if(flag==1){
            var qry = "SELECT * FROM students where ldap_id='" + req.session.studentUser_id +"'";
            conn.query(qry, function(error, rows, fields) {
                console.log("Length " + rows.length);
                if (rows.length == 1) {
                    console.log("Successfull query\n" + rows[0].name);
                    req.session.resumeStatus = [rows[0].resume1, rows[0].resume2, rows[0].resume3, rows[0].resume4, rows[0].resume5];
                    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    console.log("bye");
                    var i = 0;
                    for (i = 0; i < 5; i++) {
                        if (req.session.resumeStatus[i] == 2) {
                            break;
                        }
                    }
                    if (i == 5) {
                        statusText = "None of your resume is verified, so you are not allowed to apply for this offer";
                    }
                    var qry = "SELECT * FROM offer where unq_id='" + uniqid + "'";
                    console.log(uniqid);
                    conn.query(qry, function(error, rows, fields) {
                        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                        if (rows.length == 1) {
                            var qry1 = "SELECT * FROM applications where uniq_id='" + uniqid + "' and student_id= '" + req.session.studentUser_id + "'";
                            console.log(cond);
                            var flag;
                            conn.query(qry1, function(error, rows1, fields) {
                                if (rows1.length == 1) {
                                    rnumber = rows1[0].resume_selected;

                                    if (cond == "applyNow") {
                                        console.log("herdsfgsdfe");
                                        res.redirect('/student/viewOffer/' + uniqid + '/applied');
                                    } 
                                    else {
                                        console.log("herdsfgsdfedwq");
                                        res.render('student/particularOffer.ejs', { studentName: req.session.studentName,resume_selected: rnumber, it: i, status: statusText, data: rows, student_id: req.session.studentUser_id, uniq_id: uniqid, condition: cond, resumeStatus: req.session.resumeStatus });

                                    }
                                } 
                                else {
                                    if (cond == "applied") {
                                        console.log("herdsfgsdfe");
                                        res.redirect('/student/viewOffer/' + uniqid + '/applNow');
                                    } 
                                    else {
                                        //console.log("herdsfgsdfedwq");
                                        //res.render('student/particularOffer.ejs', { resume_selected: rnumber, it: i, status: statusText, data: rows, student_id: req.session.studentUser_id, uniq_id: uniqid, condition: cond, resumeStatus: req.session.resumeStatus });
                                        console.log("csas " + rows[0].bond);
                                    res.render('student/particularOffer.ejs', { studentName: req.session.studentName,resume_selected: rnumber, it: i, status: statusText, data: rows, student_id: req.session.studentUser_id, uniq_id: uniqid, condition: cond, resumeStatus: req.session.resumeStatus });
                                    }
                                    
                                }
                            });
                            //console.log("csas "+rows[0].bond);
                            //res.render('student/particularOffer.ejs',{resume_selected:rnumber,it:i,status:statusText,data:rows,student_id:req.session.studentUser_id,uniq_id:uniqid,condition:cond,resumeStatus:req.session.resumeStatus});
                        } else {
                            res.status(404).send('404 Page not found');
                        }
                    });
                    //console.log("logged in as " + req.session.studentUser_id);
                    //res.render('student/uploadResume.ejs', { status: statusText, colour: statusColor, data: req.session.resumeStatus, verified: "Verified", uploaded: "Uploaded", notUploaded: "Not Uploaded" });
                } 
                else {
                    res.status(404).send('404 Page not found');
                }
            });
        }
        else{
            res.status(404).send('404 Page not found');
        }
        //console.log(rnumber);
        

    }
    else if(req.session.studentFilledDetails == 0){
        var str = encodeURIComponent('false');
        res.redirect('/student/editDetails/?valid=' + str);
    } 
    else {
        res.redirect('/student/login');
    }
}

exports.postApplyOffer = function(req, res) {
    if (req.session.studentCheck == true && req.session.studentFilledDetails == 1) {
        var studentid = req.body.student_id;
        var uniqid = req.body.uniq_id;
        var rnumber = req.body.resumeNumber;
        var oname = req.body.name;
        console.log(rnumber);
        var insertQry = "INSERT INTO applications (student_id , uniq_id,name, resume_selected,status,result)" +
            " VALUES('" + studentid + "','" + uniqid + "','" + oname + "'," + rnumber + "," + 0 + "," + 0 + ")";
        console.log(insertQry);
        //console.log(values[0]);
        conn.query(insertQry, function(error, rows, fields) {
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            if (error) {
                console.log("Error in query");
                res.redirect('/student/viewOffers/?valid=false');
            } else {
                res.redirect('/student/viewOffer/' + uniqid + '/' + 'applied');
            }
        });
    }
    else if(req.session.studentFilledDetails == 0){
        var str = encodeURIComponent('false');
        res.redirect('/student/editDetails/?valid=' + str);
    }
    else {
        res.redirect('/student/login');
    }
}

exports.getViewSelectedResume = function(req, res) {
    console.log("get");
    if (req.session.studentCheck == true && req.session.studentUser_id == req.params.student_id) {
        var rnumber = req.params.resumeNumber;
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        console.log(req.params.resumeNumber);
        if (rnumber == "allVerifiedResumes") {
            res.render('student/viewVerifiedResumes.ejs', { userName: req.session.studentUser_id, data: req.session.resumeStatus });
        } else {
            var file = fs.createReadStream('resume/' + req.session.studentUser_id + '/' + rnumber + '.pdf');
            var stat = fs.statSync('resume/' + req.session.studentUser_id + '/' + rnumber + '.pdf');
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf');
            file.pipe(res);
        }
    }
    else if(req.session.studentFilledDetails == 0){
        var str = encodeURIComponent('false');
        res.redirect('/student/editDetails/?valid=' + str);
    } 
    else {
        res.redirect('/student/login');
    }
};

exports.getLogout = function(req, res) {
    console.log("logging out " + req.session.studentUser_id);
    delete req.session.studentUser_id;
    delete req.session.studentName;
    req.session.studentCheck = false;
    res.redirect('/student/login');
};


exports.get404 = function(req, res) {
    res.status(404).send('404 Page not found');
}

// console.log(index);
                    // var form = new formidable.IncomingForm();
                    // form.keepExtensions = true;
                    // form.parse(req, function(err, fields, files) {
                    //     fs.stat("resume/" + req.session.studentUser_id, function(err, stats) {
                    //         if (err) {
                    //             fs.mkdir("resume/" + req.session.studentUser_id);
                    //             console.log("making folder");
                    //         }
                    //         var file_ext = files.fileUploaded.name.split('.').pop();
                    //         var size = files.fileUploaded.size;
                    //         console.log(size);
                    //         if(file_ext=="pdf"){
                    //             req.session.resumeStatus[index - 1]++;
                    //             fs.rename(files.fileUploaded.path, 'resume/' + req.session.studentUser_id + '/' + 'resume' + index + '.pdf', function(err) {
                    //                 if (err) {
                    //                     req.session.resumeStatus[index - 1]--;
                    //                     var str = encodeURIComponent('false');
                    //                     res.redirect('/student/uploadResume/?valid=' + str);
                    //                 } 
                    //                 else {
                    //                     console.log("Inserting file");
                    //                     var qry = "UPDATE students SET resume" + index + "='" + req.session.resumeStatus[index - 1] + "' WHERE ldap_id='" + req.session.studentUser_id + "'";
                    //                     console.log(qry);
                    //                     conn.query(qry, function(error, rows, fields) {
                    //                         if (!error) {
                    //                             console.log("success");
                    //                         } else {
                    //                             console.log("Unsuccess");
                    //                         }

                    //                     });
                    //                     var str = encodeURIComponent('true');
                    //                     res.redirect('/student/uploadResume/?valid=' + str);
                    //                 }
                    //             });
                    //         }
                    //         else{
                    //             var str = encodeURIComponent('typeError');
                    //             res.redirect('/student/uploadResume/?valid=' + str);
                    //         }
                    //     });
                    // });
                