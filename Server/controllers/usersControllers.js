const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");
const cloudinary = require("../utils/cloudinary");
const Email = require("../utils/email");
const Course = require("../models/coursesModel");
const Exam = require("../models/examsModel");
const Register = require("../models/registerModel");
const Cheating = require("../models/cheatingModel");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 });
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /UpdateMyPassword.",
        400
      )
    );
  }
  const user = await User.findById(req.user.id);
  if (req.file) {
    req.body.file = req.cloudinaryResult.secure_url;
    const publicId = user.file.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  }
  const filterdBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "file"
  );

  //2) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.changeStatus = factory.changeStatus(User);

exports.deleteUser = factory.deleteOne(User);

// Don't update the user Password
exports.updateUser = factory.updateOne(User);

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.getStatistics = catchAsync(async (req, res, next) => {
  const numberOfCourses = await Course.countDocuments();

  // Get the number of students
  const numberOfStudents = await User.countDocuments({ role: "student" });

  // Get the number of instructors
  const numberOfInstructors = await User.countDocuments({ role: "instructor" });

  // Get the number of exams
  const numberOfExams = await Exam.countDocuments();

  // Get the average of grades on all courses
  const averageGrades = await Register.aggregate([
    { $unwind: "$grades" },
    {
      $group: {
        _id: null,
        averageGrade: { $avg: "$grades.grade" },
      },
    },
  ]);

  // Get the number of students who passed, failed, and were absent
  const statusCounts = await Register.aggregate([
    { $unwind: "$grades" },
    {
      $group: {
        _id: "$grades.status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusCountsMap = statusCounts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  const passedCount = statusCountsMap.passed || 0;
  const failedCount = statusCountsMap.failed || 0;
  const absentCount = statusCountsMap.absent || 0;

  // Get the average number of cheating incidents
  const cheatingCounts = await Cheating.aggregate([
    {
      $group: {
        _id: null,
        averageCheatingIncidents: { $avg: { $size: "$cheatingDetalis" } },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      numberOfCourses,
      numberOfStudents,
      numberOfInstructors,
      numberOfExams,
      averageGrade:
        averageGrades.length > 0 ? averageGrades[0].averageGrade : 0,
      passedCount,
      failedCount,
      absentCount,
      averageCheatingIncidents:
        cheatingCounts.length > 0
          ? cheatingCounts[0].averageCheatingIncidents
          : 0,
    },
  });
});
