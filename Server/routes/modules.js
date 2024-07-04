const express = require("express");
const modulesController = require("../controllers/modulesController");
const authController = require("./../controllers/authController");
const uploadToCloudinary = require("../middlewares/uploadToCloudinary");

const router = express.Router({ mergeParams: true }); //to get access to params in courses router

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("instructor"),
    modulesController.uploadCourseModules,
    uploadToCloudinary, // Ensure this middleware is before creating the material
    modulesController.setCourseUserIds,
    modulesController.createModule
  )
  .get(modulesController.getAllModules);

router
  .route("/:id")
  .get(modulesController.getModule)
  .patch(
    authController.restrictTo("instructor"),
    modulesController.uploadCourseModules,
    uploadToCloudinary, // Ensure this middleware is before creating the material
    modulesController.updateModule
  )
  .delete(
    authController.restrictTo("instructor"),
    modulesController.deleteModule
  );

router.patch("/prograss/:courseId/:moduleId", modulesController.addprograss);

router.patch("/decprograss/:courseId/:moduleId", modulesController.decprograss);

router.get("/getPrograss/:courseId", modulesController.getprograss);

module.exports = router;
