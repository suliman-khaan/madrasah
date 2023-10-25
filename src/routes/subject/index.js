const express = require("express");
const subject = require("../../controller/subject");
const router = express.Router();


router.get("/", subject.all);
router.get("/add", subject.add);
router.post("/add", subject.doAdd);
router.get('/edit',subject.edit);
router.post("/edit", subject.doEdit);
router.get("/delete", subject.delete);

module.exports = router;
