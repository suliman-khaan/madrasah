const express = require("express");
const mark = require("../../controller/mark");
const router = express.Router();


router.get("/", mark.all);
router.get("/add", mark.add);
router.post("/add", mark.doAdd);
router.get('/edit',mark.edit);
router.post("/edit", mark.doEdit);
router.get("/delete", mark.delete);

module.exports = router;
