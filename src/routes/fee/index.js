const express = require("express");
const fee = require("../../controller/fee");
const router = express.Router();


router.get("/", fee.main);
// for exploring the class
router.get("/class/:id", fee.class);

module.exports = router;
