const express = require("express");
const { dashboard } = require("../controller");
const router = express.Router();
const studentsRoutes = require("./students");

router.get("/", dashboard);
router.use("/students", studentsRoutes);

module.exports = router;
