const express = require("express");
const students = require("../../controller/students");
const router = express.Router();


router.get("/", students.all);
router.get("/add", students.add);
router.post("/add", students.doAdd);
router.get('/edit',students.edit);
router.post("/edit", students.doEdit);
router.get("/delete", students.delete);

module.exports = router;
