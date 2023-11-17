const express = require("express");
const { dashboard } = require("../controller");
const router = express.Router();
const studentsRoutes = require("./students");
const teachersRoutes = require("./teachers");
const feeRoutes = require("./fee");
const subjectRoutes = require("./subject");
const classRoutes = require("./class");
const markRoutes = require("./mark");

router.get("/", dashboard);
router.use("/students", studentsRoutes);
router.use("/teachers", teachersRoutes);
router.use("/class", classRoutes);
router.use("/fee", feeRoutes);
router.use("/subject", subjectRoutes);
router.use("/marks", markRoutes);
router.get("*", (req, res) => res.render("utils/404"));

module.exports = router;
