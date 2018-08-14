var express = require('express');
var router = express.Router();

var home_controller = require('../controllers/home');

router.get("/gradeSystem", home_controller.gradeSystem);

router.get("/programs", home_controller.programs);

router.get("/student_rules", home_controller.student_rules);
router.get("/company_rules", home_controller.company_rules);

//router.get("/internships", home_controller.internships);

router.get("/placementProcedure", home_controller.placementProcedure);

router.get("/newBreed", home_controller.newBreed);

router.get("/coe", home_controller.coe);

router.get("/research", home_controller.research);

router.get("/facilities", home_controller.facilities);

//router.get("/reachUs", home_controller.reachUs);

router.get("/feedback", home_controller.getFeedback);

router.post("/feedback", home_controller.postFeedback);

router.get("/contacts", home_controller.contacts);

router.get("/admissions", home_controller.admissions);

router.get("/achievements", home_controller.achievements);

router.get("/alumni", home_controller.alumni);

router.get("/brochure", home_controller.brochure);

router.get("/chrmn_msg", home_controller.chrmn_msg);

router.get("/dir_msg", home_controller.dir_msg);

router.get("/iaf", home_controller.iaf);

router.get("/invitation", home_controller.invitation);

router.get("/jaf", home_controller.jaf);

router.get("/profile", home_controller.profile);

router.get("/stats", home_controller.stats);

router.get("/summary", home_controller.summary);

router.get("/about", home_controller.about);

router.get("/reachus", home_controller.reachus);

router.get("/newindex", home_controller.newindex);

router.get("/past_recruiters", home_controller.past_rec);

router.get("/internships", home_controller.internships);

router.get("/aipc", home_controller.aipc);

module.exports = router;
