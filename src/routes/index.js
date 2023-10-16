const express = require("express");
const { dashboard } = require("../controller");
const router = express.Router();
const studentsRoutes = require("./students");
const teachersRoutes = require("./teachers");
const classRoutes = require("./class");

router.get("/", dashboard);
router.use("/students", studentsRoutes);
router.use('/teachers', teachersRoutes);
router.use('/class', classRoutes);
router.get('*',(req,res)=>res.render('utils/404'))

module.exports = router;
