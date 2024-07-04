const Modules = require("../models/modulesModel");
const catchAsync = require("./../utils/catchAsync");
const Register = require("../models/registerModel");
const multer = require("multer");
const factory = require("./handlerFactory");
const APIFeatures = require("./../utils/apiFeatures");

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

exports.uploadCourseModules = upload.single("file");

exports.getModule = factory.getOne(Modules);

exports.setCourseUserIds = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.instructor) req.body.instructor = req.user.id;
  next();
};

exports.createModule = factory.createOne(Modules);

exports.updateModule = factory.updateOne(Modules);

exports.getAllModules = catchAsync(async (req, res, next) => {
  let filter = {};
  let docs;
  if (req.params.courseId) filter = { course: req.params.courseId };

  const features = new APIFeatures(Modules.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let documents = await features.query;
  let totalPages;
  if (req.query.limit) {
    docs = await Modules.find();
    totalPages = Math.ceil(docs.length / req.query.limit);
  } else {
    totalPages = 0;
    docs = 0;
  }

  // Filter prograss based on student
  const studentId = req.user.id;
  documents = documents.map((module) => {
    const studentPrograss = module.prograss.filter(
      (progress) => progress.studentId.toString() === studentId
    );
    return { ...module._doc, prograss: studentPrograss };
  });

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    totalDocs: docs.length,
    totalPages,
    results: documents.length,
    data: {
      data: documents,
    },
  });
});

exports.deleteModule = factory.deleteOne(Modules);

exports.addprograss = catchAsync(async (req, res, next) => {
  const module = req.params.moduleId;
  const filter = { student: req.user.id, course: req.params.courseId };
  const update = { $inc: { prograss: 1 } }; // Use $inc to increment the prograss field
  await Register.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
    upsert: true, // Create the document if it doesn't exist
  });

  const updateModule = {
    $push: {
      prograss: {
        studentId: req.user.id,
        status: true,
      },
    },
  };
  await Modules.findByIdAndUpdate(module, updateModule, {
    new: true,
    runValidators: true,
    upsert: true, // Create the document if it doesn't exist
  });

  res.status(200).json({
    status: "success",
  });
});

exports.decprograss = catchAsync(async (req, res, next) => {
  const filter = { student: req.user.id, course: req.params.courseId };
  const update = { $inc: { prograss: -1 } }; // Use $inc with -1 to decrement the prograss field

  await Register.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
    upsert: true, // Create the document if it doesn't exist
  });

  const module = req.params.moduleId; // Assuming moduleId is passed as a URL parameter
  const updateModule = {
    $set: {
      "prograss.$[elem].status": false, // Use positional operator to update the correct element
    },
  };
  const arrayFilters = [{ "elem.studentId": req.user.id }]; // Match the element with the correct studentId

  await Modules.findByIdAndUpdate(module, updateModule, {
    new: true,
    runValidators: true,
    upsert: true, // Create the document if it doesn't exist
    arrayFilters, // Pass array filters to identify the correct array element
  });

  res.status(200).json({
    status: "success",
  });
});

exports.getprograss = catchAsync(async (req, res, next) => {
  const course = req.params.courseId;
  const getPrograss = await Register.findOne({
    student: req.user.id,
    course: req.params.courseId,
  })
    .populate({
      path: "student",
      select: "-firstName -lastName -email -file",
    })
    .populate({
      path: "course",
      select: "-name -description -file",
    });

  const modules = await Modules.find({ course });

  res.status(200).json({
    status: "success",
    finshed: getPrograss.prograss,
    allModules: modules.length,
  });
});
