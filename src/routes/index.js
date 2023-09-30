const express = require("express");
const { dashboard } = require("../controller");
const router = express.Router();

router.get("/", dashboard);

module.exports = router;
