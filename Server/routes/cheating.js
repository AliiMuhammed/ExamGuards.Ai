const express = require("express");
const router = express.Router();
const cheatingController = require("../controllers/cheatingControllers");
const authController = require("../controllers/authController");
const multer = require("multer");

router.use(authController.protect);

// Define storage for multer
const upload = multer({ dest: "uploads/" });

router.post(
  "/:examId",
  upload.array("image_files"),
  cheatingController.eyeTracking
);

router.post(
  "/objects/:examId",
  upload.array("image_files"),
  cheatingController.objectDetection
);

router.post(
  "/faceRecognition/:examId",
  upload.array("image_files"),
  cheatingController.faceRecognition
);

router.post(
  "/voiceRecognition/:examId",
  upload.single("voice_file"),
  cheatingController.voiceRecognition
);

router.get("/fraudCases/:examId/:studentId", cheatingController.getCheatingsforExam);

router.post(
  "/addCheating/:examId",
  cheatingController.setIds,
  cheatingController.addCheating
);

module.exports = router;
