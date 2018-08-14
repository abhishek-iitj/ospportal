var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs-extra');
var conn = require('../db.js');

exports.gradeSystem = function(req, res) {
    res.render("../views/home/gradesystem.ejs");
};

exports.programs = function(req, res) {
    res.render("../views/home/programs.ejs");
};

exports.student_rules = function(req, res) {
    res.render("../views/home/rules.ejs");
};
exports.company_rules = function(req, res) {
    res.render("../views/home/company_rules.ejs");
};

/*exports.internships = function(req, res) {
    res.render("../views/home/internships.ejs");
};*/

exports.placementProcedure = function(req, res) {
    res.render("../views/home/placementprocedure.ejs");
};

exports.newBreed = function(req, res) {
    res.render("../views/home/newbreed.ejs");
};

exports.coe = function(req, res) {
    res.render("../views/home/coe.ejs");
};

exports.research = function(req, res) {
    res.render("../views/home/research.ejs");
};

exports.facilities = function(req, res) {
    res.render("../views/home/facilities.ejs");
};

exports.achievements = function(req, res) {
    res.render("../views/home/achievements.ejs");
};

exports.getFeedback = function(req, res) {
    var statusText="None";
    var passedVariable = req.query.valid;
    if(passedVariable=='false') statusText="Sorry, That didn't work !";
    else if(passedVariable=='true') statusText="Feedback Received";
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render("../views/home/feedback.ejs",{status:statusText,condition:passedVariable});
};

exports.postFeedback = function(req, res) {
    var post=req.body;
    var name = req.body.companyName;
    var feed = req.body.feed;
    var insertqry="INSERT INTO companyFeedback (company_name, feedback) VALUES('"+name+"','"+feed+"')";
    conn.query(insertqry, function(error, rows, fields){
        if(error){
            console.log("Error in query");
            var str = encodeURIComponent('false');
            res.redirect('/feedback/?valid='+str);
        }
        else{
            console.log("Success");
            var str = encodeURIComponent('true');
            res.redirect('/feedback/?valid='+str);
        }
    });
};

/*exports.reachUs = function(req, res) {
    res.render("../views/home/reachus.ejs");
};*/

exports.contacts = function(req, res) {
    res.render("../views/home/contacts.ejs");
};

exports.admissions = function(req, res) {
    res.render("../views/home/admission.ejs");
};

exports.alumni = function(req, res) {
    res.render("../views/home/alumni.ejs");
};

exports.brochure = function(req, res) {
    res.render("../views/home/brochure.ejs");
};

exports.chrmn_msg = function(req, res) {
    res.render("../views/home/chrmn_msg.ejs");
};

exports.dir_msg = function(req, res) {
    res.render("../views/home/dir_msg.ejs");
};

exports.iaf = function(req, res) {
    res.render("../views/home/iaf.ejs");
};

exports.jaf = function(req, res) {
    res.render("../views/home/jaf.ejs");
};

exports.invitation = function(req, res) {
    res.render("../views/home/invitation.ejs");
};

exports.profile = function(req, res) {
    res.render("../views/home/profile.ejs");
};

exports.stats = function(req, res) {
    res.render("../views/home/stats.ejs");
};

exports.summary = function(req, res) {
    res.render("../views/home/summary.ejs");
};


exports.internships = function(req, res) {
    res.render("../views/home/internships.ejs");
};

exports.reachus = function(req, res) {
    res.render("../views/home/reachus.ejs");
};

exports.newindex = function(req, res) {
    res.render("../newindex.ejs");
};

exports.about = function(req, res) {
    res.render("../index.html");
};

exports.past_rec=function(req, res){
     res.render("../views/home/past_rec_list.ejs");
};


exports.aipc=function(req, res){
     res.render("../views/home/aipc.ejs");
};