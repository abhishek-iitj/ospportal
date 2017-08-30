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

exports.rules = function(req, res) {
    res.render("../views/home/rules.ejs");
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

/*exports.reachUs = function(req, res) {
    res.render("../views/home/reachus.ejs");
};*/

exports.contacts = function(req, res) {
    res.render("../views/home/contacts.ejs");
};

