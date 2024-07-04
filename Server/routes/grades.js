const express = require("express");
var router = express.Router();
const gradesController = require("../controllers/gradesController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.get(
  "/student/:courseId",
  authController.restrictTo("student"),
  gradesController.getGradesforstudent
);

router.get(
  "/course/:courseId",
  authController.restrictTo("instructor"),
  gradesController.getGradesforCourse
);

router.get(
  "/oneExam/:courseId/:examId",
  authController.restrictTo("instructor"),
  gradesController.getGradesforExam
);

router.patch(
  "/addGrade/:courseId/:studentId/:examId",
  authController.restrictTo("instructor"),
  gradesController.addGrades
);

router.get("/gradesForExam/:examId", gradesController.getGradesExamStudent);

module.exports = router;
