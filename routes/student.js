//writing all the routes taking controller functions as callback;

var express=require('express');
var router=express.Router();

var student_controller=require('../controllers/student');

router.get("/login", student_controller.getLogin);

router.get("/home", student_controller.getHome);

router.post('/login', student_controller.postLogin);

router.get('/logout',student_controller.getLogout); 

module.exports = router;