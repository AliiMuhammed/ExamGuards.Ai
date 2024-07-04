var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/usersControllers");
// const uploader = require("../middlewares/uploadImages");
const uploadToCloudinary = require("../middlewares/uploadToCloudinary");

router.post(
  "/signup",
  authController.uploadCoursePhoto,
  authController.resizeCoursePhoto,
  uploadToCloudinary,
  authController.signup
);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/updatePassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  uploadToCloudinary,
  userController.updateMe
);

router.get("/statistics", userController.getStatistics);

router.use(authController.restrictTo("admin", "super admin"));

router.patch("/activate/:id", userController.changeStatus);

router
  .route("/:id")
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

router.get("/", userController.getAllUsers);

module.exports = router;
