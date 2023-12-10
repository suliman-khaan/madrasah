const express = require("express");
const mark = require("../../controller/mark");
const router = express.Router();


// router.get("/", mark.all);
router.get("/", mark.byClasses);
router.get("/add", mark.add);
router.get("/class/:id", mark.classById);
router.get("/view", mark.viewMarks);
router.get("/add/:id", mark.addMarkStudent);
router.post("/add/:id", mark.doAddMarkStudent);
router.get('/edit/:id',mark.edit);
router.post("/edit/:id", mark.doAddMarkStudent);

// API route
router.post("/student-marks", mark.getStudentMarks);

module.exports = router;
