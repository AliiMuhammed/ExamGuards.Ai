const express = require("express");
const courseController = require("../controllers/coursesController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, courseController.getAllCourses)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    courseController.createCourse
  );

router
  .route("/:id")
  .get(authController.protect, courseController.getCourse)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    courseController.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    courseController.deleteCourse
  );

module.exports = router;
