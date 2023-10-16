const express = require("express");
const fee = require("../../controller/fee");
const router = express.Router();


router.get("/", fee.all);
router.get("/add", fee.add);
router.post("/add", fee.doAdd);
router.get('/edit',fee.edit);
router.post("/edit", fee.doEdit);
router.get("/delete", fee.delete);

module.exports = router;
