//writing all the routes taking controller functions as callback;

var express=require('express');
var router=express.Router();

var student_controller=require('../controllers/student');

router.get("/login", student_controller.getLogin);

router.get("/home", student_controller.getHome);

router.post('/login', student_controller.postLogin);

router.get('/logout',student_controller.getLogout); 

router.get('/uploadResume',student_controller.getUploadResume); 

router.post('/uploadResume',student_controller.postUploadResume); 

router.get('/editDetails',student_controller.getEditDetails);

router.post('/editDetails',student_controller.postEditDetails); 

module.exports = router;