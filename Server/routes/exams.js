const express = require("express");
const examController = require("../controllers/examsController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true }); //to get access to params in courses router

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("instructor"),
    examController.setuserId,
    examController.createExam
  )
  .get(examController.getAllExam);

router
  .route("/:id")
  .patch(authController.restrictTo("instructor"), examController.updateExam)
  .get(authController.protect, examController.getExam)
  .delete(authController.restrictTo("instructor"), examController.deleteExam);

router.post("/autoGrade/:id", examController.autoGrade);

router.get("/examInfo/:id", examController.examInfo);

router.post("/check/:examId", examController.checkStudentTookExam);

module.exports = router;
