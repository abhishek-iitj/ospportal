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

router.get('/viewOffers',student_controller.getViewOffers);

router.get('/viewOffer/:uniq_id/:status', student_controller.getApplyOffer);

router.post('/viewOffer/:uniq_id/:applied', student_controller.postApplyOffer);

module.exports = router;

/*
<%if(condition=="applied"){%>
			<p align="right" style="color:green;text-align:center"><%= status %></p>
		<%}else if(it!=5){%>
			<p align="right" style="color:green;text-align:center"><%= status %></p>
		<%}else{%>
			<p align="right" style="color:red;text-align:center"><%= status %></p>
		<%}%>
*/