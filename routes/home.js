var express = require('express');
var router = express.Router();

var home_controller = require('../controllers/home');

router.get("/gradeSystem", home_controller.gradeSystem);

router.get("/programs", home_controller.programs);

router.get("/rules", home_controller.rules);

router.get("/internships", home_controller.internships);

router.get("/placementProcedure", home_controller.placementProcedure);

router.get("/newBreed", home_controller.newBreed);

router.get("/coe", home_controller.coe);

router.get("/research", home_controller.research);

router.get("/facilities", home_controller.facilities);

router.get("/reachUs", home_controller.reachUs);

router.get("/contacts", home_controller.contacts);

module.exports = router;