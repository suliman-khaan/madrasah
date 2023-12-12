const result = require("../../controller/result");
const router = require("express").Router();

router.get("/", result.all);
router.get("/class", result.class);

module.exports = router