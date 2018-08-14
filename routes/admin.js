var express=require('express');
var router=express.Router();

var admin_controller=require('../controllers/admin');

router.get("/login", admin_controller.getLogin);

router.get("/home", admin_controller.getHome);

router.get('/register2s0p1c7_iitj', admin_controller.getRegister);

router.post('/register', admin_controller.Register);

router.get("/viewCredentials", admin_controller.getViewStudentsCredentials);

router.post('/login', admin_controller.postLogin);

router.get('/logout', admin_controller.getLogout); 

router.get("/verifyResume", admin_controller.getVerifyResume);

router.post("/verifyResume", admin_controller.postVerifyResume);

router.get("/verifyResume/:userName", admin_controller.getResumeByUser);

router.get("/verifyResume/:userName/:resumeNumber", admin_controller.getShowResume);

router.post("/verification", admin_controller.postVerification);

router.get('/viewCompany', admin_controller.viewCompany);

router.get('/viewOffers/:unqid', admin_controller.getViewOffers);

router.get('/approveOffer/:unqid', admin_controller.approveOffer);

router.get('/viewstudents/:unq_id', admin_controller.getViewStudentApplied);

router.get('/viewstudents/:unq_id/:student_id/:resumeNumber', admin_controller.getViewSelectedResume);

router.get('/viewstudents/:unq_id/downloadZip', admin_controller.getDownloadZip);

router.get('/openOffer/:unqid', admin_controller.openOffer);

router.get('/placeStudent', admin_controller.getPlaceStudent);

router.post('/placeStudent', admin_controller.postPlaceStudent);

router.get('/viewPlacedStudents', admin_controller.getViewPlacedStudents);

router.get('*', admin_controller.get404);

module.exports=router;