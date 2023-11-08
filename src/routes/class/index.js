const express = require("express");
const classController = require("../../controller/class");
const router = express.Router();


router.get("/", classController.all);
router.get("/add", classController.add);
router.post("/add", classController.doAdd);
router.get('/edit',classController.edit);
router.post("/edit", classController.doEdit);
router.get("/delete", classController.delete);

module.exports = router;
