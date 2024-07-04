const express = require("express");
const router = express.Router();
const poseDetectController = require("../controllers/poseModelController");
const multer = require("multer");

const upload = multer({});

// Route to handle pose detection
router.post("/", upload.single("image"), poseDetectController.detectPose);

module.exports = router;
