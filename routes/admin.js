var express=require('express');
var router=express.Router();

var admin_controller=require('../controllers/admin');

router.get("/login", admin_controller.getLogin);

router.get("/home", admin_controller.getHome);

router.post('/login', admin_controller.postLogin);

router.get('/logout', admin_controller.getLogout); 

module.exports=router;