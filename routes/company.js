var express=require('express');
var router=express.Router();

var company_controller=require('../controllers/company');

router.get("/login", company_controller.getLogin);

router.get("/home", company_controller.getHome);

router.post('/login', company_controller.postLogin);

router.get('/logout', company_controller.getLogout); 

router.get('/register', company_controller.getRegister);

router.post('/register', company_controller.Register);

router.get('/addoffer', company_controller.addoffer);

module.exports=router;