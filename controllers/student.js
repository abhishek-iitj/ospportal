//writing all the callback of the routes here
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs-extra');
var conn = require('../db.js');

exports.getLogin = function(req, res) {
    var statusText = "";
    var passedVariable = req.query.valid;
    if (passedVariable == 'false') statusText = "Sorry, That didn't work !";
    if (req.session.studentCheck == true) {
        res.redirect('/student/home');
    } else {
        // var stausText="Kindly fill in these fields";
        // if(req.params.status=="false") statusText="Wrong credentials";
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        //res.render(__dirname+"/views/student/login.ejs", {status:statusText});
        res.render("../views/student/login.ejs", { status: statusText });
    }
};

exports.getHome = function(req, res) {
    if (req.session.studentCheck == true) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        console.log("logged in as " + req.session.studentUser_id);
        //res.send('Hi '+ req.session.studentUser_id + '<a href="/student/logout"> Logout</a>');
        //res.sendFile(__dirname+"/index.ejs");
        res.render('student/home.ejs', { studentName: req.session.studentName }); //argument to render function is a javascript objet
    } else {
        res.redirect('/student/login');
    }
};
//var resumeStatus;
exports.postLogin = function(req, res) {
    var post = req.body;
    var qry = "SELECT * FROM students where ldap_id='" + post.xuser + "' and ldap_pass='" + post.xpass + "'";
    console.log(qry);
    conn.query(qry, function(error, rows, fields) {
        // if(!!error)
        // 	console.log("Error in query");
        // else{
        //parse with your rows
        console.log("Length " + rows.length);
        if (rows.length == 1) {
            console.log("Successfull query\n" + rows[0].name);

            req.session.studentUser_id = post.xuser;
            req.session.studentName = rows[0].name;
            req.session.studentBranch = rows[0].branch;
            req.session.studentCpi = rows[0].cpi;
            req.session.resumeStatus = [rows[0].resume1, rows[0].resume2, rows[0].resume3, rows[0].resume4, rows[0].resume5];
            //req.session.resume_uploaded=rows[0].resume_uploaded;
            //req.session.resume_verified=rows[0].resume_verified;
            req.session.studentCheck = true;
            res.redirect('/student/home');
        } else {
            var str = encodeURIComponent('false');
            res.redirect('/student/login/?valid=' + str);
        }
    });
};

exports.getUploadResume = function(req, res) {
    var statusText = "";
    var statusColor = "red";
    var passedVariable = req.query.valid;
    if (passedVariable == 'false') {
        statusText = "Sorry, That didn't work !";
    } else if (passedVariable == 'true') {
        statusText = "Resume Successfully Uploaded";
        statusColor = "green";
    }
    if (req.session.studentCheck == true) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        console.log("logged in as " + req.session.studentUser_id);
        res.render('student/uploadResume.ejs', { status: statusText, colour: statusColor, data: req.session.resumeStatus, verified: "Verified", uploaded: "Uploaded", notUploaded: "Not Uploaded" });
    } else {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.redirect('/student/login');
    }
};

exports.postUploadResume = function(req, res) {
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
                } else {
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
};

exports.getEditDetails = function(req, res) {
    var statusText = "";
    var statusColor = "red";
    var passedVariable = req.query.valid;
    if (passedVariable == 'false') {
        statusText = "Sorry, That didn't work !";
    } else if (passedVariable == 'true') {
        statusText = "Changes Successfully Saved";
        statusColor = "green";
    }
    if (req.session.studentCheck == true) {
        var qry = "SELECT * FROM students where ldap_id='" + req.session.studentUser_id + "'";
        console.log(qry);
        conn.query(qry, function(error, rows, fields) {
            console.log("Length " + rows.length);
            if (rows.length == 1) {
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                console.log("logged in as " + req.session.studentUser_id);
                res.render('student/editDetails.ejs', { status: statusText, colour: statusColor, data: rows });
                //res.redirect('/student/home');
            } else {
                res.redirect('/student/logout');
            }
        });
    } else {
        res.redirect('/student/login');
    }
};

exports.postEditDetails = function(req, res) {
    if (req.body.hasOwnProperty("cancel")) {
        console.log("Cancel button clicked");
        res.redirect('/student/home');
    } else {
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
            permanentAddress, currentAddress, xYear, xBoardName, xPercentage, xiiYear, xiiBoardName, xiiPercentage
        ];

        var qry = "UPDATE students SET parents_name = '" + data[0] + "', dob = '" + data[1] + "', category = '" + data[2] + "', bgroup = '" + data[3] + "', hobbies = '" + data[6] + "' ,jee_air = '" + data[4] + "', room_no =  '" + data[5] + "'," +
            " nationality = '" + data[7] + "', pd_status = '" + data[8] + "', permanent_address = '" + data[9] + "', current_address = '" + data[10] + "', x_year = '" + data[11] + "', x_board_name = '" + data[12] + "'," +
            " x_percentage = '" + data[13] + "',  xii_year = '" + data[14] + "', xii_board_name = '" + data[15] + "', xii_percentage = '" + data[16] + "'" +
            "WHERE ldap_id='" + req.session.studentUser_id + "' ";
        console.log(qry);

        conn.query(qry, function(error, rows, fields) {
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            if (!error) {
                console.log("success");
                var str = encodeURIComponent('true');
                res.redirect('/student/editDetails/?valid=' + str);
            } else {
                console.log("Unsuccess");
                var str = encodeURIComponent('false');
                res.redirect('/student/editDetails/?valid=' + str);
            }
        });
    }

};

exports.getViewOffers = function(req, res) {
    console.log("get");
    if (req.session.studentCheck == true) {
        var statusText = "";
        var passedVariable = req.query.valid;
        if (passedVariable == 'false') {
            statusText = "Sorry, That didn't work !";
        }
        var qry1 = "SELECT * FROM offer WHERE " + req.session.studentBranch + " = 1 and admin_verify = 1 and open = 1";
        //var qry="SELECT * FROM students where ldap_id='"+req.session.studentUser_id+"'";
        console.log(qry1);
        conn.query(qry1, function(error, rows1, fields) {
            console.log("dwa " + rows1.length);
            var qry2 = "SELECT * FROM applications where student_id='" + req.session.studentUser_id + "'";
            console.log(qry2);
            conn.query(qry2, function(error, rows2, fields) {
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                console.log("dwwa " + rows2.length);
                res.render('student/viewoffer.ejs', { status: statusText, studentName: req.session.studentName, data1: rows1, data2: rows2, len1: rows1.length, len2: rows2.length });
                //res.render('student/login.ejs');
            });
        });
    } else {
        res.redirect('/student/login');
    }
};



exports.getApplyOffer = function(req, res) {
    console.log("fsc");
    if (req.session.studentCheck == true) {
        //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        var cond = req.params.status;
        var uniqid = req.params.uniq_id;
        var statusText = "";
        var rnumber;
        var passedVariable = req.query.valid;

        //console.log(flag);
        if (passedVariable == 'false' && cond == "applyNow") {
            statusText = "Please select resume before applying for the offer";
        } else if (cond == "applied") {
            statusText = "You have applied for this offer";
        } else {

        }
        //console.log(rnumber);


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
                        } else {
                            console.log("herdsfgsdfedwq");
                            res.render('student/particularOffer.ejs', { resume_selected: rnumber, it: i, status: statusText, data: rows, student_id: req.session.studentUser_id, uniq_id: uniqid, condition: cond, resumeStatus: req.session.resumeStatus });

                        }
                    } else {
                        console.log("csas " + rows[0].bond);
                        res.render('student/particularOffer.ejs', { resume_selected: rnumber, it: i, status: statusText, data: rows, student_id: req.session.studentUser_id, uniq_id: uniqid, condition: cond, resumeStatus: req.session.resumeStatus });
                    }
                });
                //console.log("csas "+rows[0].bond);
                //res.render('student/particularOffer.ejs',{resume_selected:rnumber,it:i,status:statusText,data:rows,student_id:req.session.studentUser_id,uniq_id:uniqid,condition:cond,resumeStatus:req.session.resumeStatus});
            } else {
                res.redirect('/student/login');
            }
        });

    } else {
        res.redirect('/student/login');
    }
}

exports.postApplyOffer = function(req, res) {
    var studentid = req.body.student_id;
    var uniqid = req.body.uniq_id;
    var rnumber = req.body.resumeNumber;
    console.log(rnumber);
    var insertQry = "INSERT INTO applications (student_id , uniq_id, resume_selected,status,result)" +
        " VALUES('" + studentid + "','" + uniqid + "'," + rnumber + "," + 0 + "," + 0 + ")";
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
    } else {
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