const express = require("express");
const courseController = require("../controllers/coursesController");
const authController = require("./../controllers/authController");
const modulesRouter = require("../routes/modules");
const uploadToCloudinary = require("../middlewares/uploadToCloudinary");
const examRouter = require("../routes/exams");

const router = express.Router();
router.use(authController.protect);
router.use("/:courseId/modules", modulesRouter);
router.use("/:courseId/exams", examRouter);

router.get(
  "/coursesPerStudent",
  authController.restrictTo("student"),
  courseController.getCoursesPerStudent
);

router.get(
  "/coursesForStudent",
  authController.restrictTo("student"),
  courseController.getCoursesForStudent
);

router.get(
  "/pending",
  authController.restrictTo("admin", "super admin"),
  courseController.getPendingRegistrations
);

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(
    authController.restrictTo("admin", "super admin"),
    courseController.uploadCoursePhoto,
    courseController.resizeCoursePhoto,
    uploadToCloudinary,
    courseController.createCourse
  );

router
  .route("/:id")
  .get(courseController.getCourse)
  .patch(
    authController.restrictTo("admin", "super admin"),
    courseController.uploadCoursePhoto,
    courseController.resizeCoursePhoto,
    uploadToCloudinary,
    courseController.updateCourse
  )
  .delete(
    authController.restrictTo("admin", "super admin"),
    courseController.deleteRelatedData,
    courseController.deleteCourse
  );

router.patch(
  "/status/:id",
  authController.restrictTo("admin", "super admin"),
  courseController.changeStatus
);

router.post(
  "/register/:courseId",
  authController.restrictTo("student"),
  courseController.registerToCourse
);

router.post(
  "/assign",
  authController.restrictTo("admin", "super admin"),
  courseController.assignInstructor
);

router.patch(
  "/approve/:studentId/:courseId",
  authController.restrictTo("admin", "super admin"),
  courseController.approvedRegistration
);

router.patch(
  "/removeAllStudents/:id",
  authController.restrictTo("admin", "super admin"),
  courseController.deleteAllStudents
);

module.exports = router;
