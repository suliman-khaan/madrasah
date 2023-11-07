const express = require("express");
const fee = require("../../controller/fee");
const router = express.Router();


router.get("/", fee.main);

module.exports = router;
