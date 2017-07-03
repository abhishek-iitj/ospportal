var express=require('express');
var router=express.Router();

var admin_controller=require('../controllers/admin');

router.get("/login", admin_controller.getLogin);

router.get("/home", admin_controller.getHome);

router.post('/login', admin_controller.postLogin);

router.get('/logout', admin_controller.getLogout); 

router.get("/verifyResume", admin_controller.getVerifyResume);

router.post("/verifyResume", admin_controller.postVerifyResume);

router.get("/verifyResume/:userName", admin_controller.getResumeByUser);

router.get("/verifyResume/:userName/:resumeNumber", admin_controller.getShowResume);

router.post("/verification", admin_controller.postVerification);

module.exports=router;