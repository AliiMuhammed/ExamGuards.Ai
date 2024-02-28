var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);

router.post("/login", authController.login);



module.exports = router;
