const express = require("express");
const fee = require("../../controller/fee");
const router = express.Router();


router.get("/", fee.main);
// for exploring the class
router.get("/class/:id", fee.class);
// for fee portal
router.get("/portal", fee.portal);
router.get("/portal/class/:id", fee.portalClass);
// add fee form
router.post('/addfee', fee.addfee);
// find fee
router.get('/portal/:id', fee.findFee);

module.exports = router;
