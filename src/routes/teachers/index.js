const express = require("express");
const teachers = require("../../controller/teachers");
const router = express.Router();


router.get("/", teachers.all);
router.get("/add", teachers.add);
router.post("/add", teachers.doAdd);
router.get('/edit',teachers.edit);
router.post("/edit", teachers.doEdit);
router.get("/delete", teachers.delete);

module.exports = router;
