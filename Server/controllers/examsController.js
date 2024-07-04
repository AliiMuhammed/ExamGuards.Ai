const Exam = require("../models/examsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const Register = require("../models/registerModel");
const Course = require("../models/coursesModel");
const mongoose = require("mongoose");

exports.setuserId = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  next();
});

exports.createExam = factory.createOne(Exam);

exports.updateExam = factory.updateOne(Exam);

exports.getExam = catchAsync(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(new AppError("No document found with that ID", 404));
  }

  await exam.updateStatus();

  res.status(200).json({
    status: "success",
    data: {
      data: exam,
    },
  });
});

exports.deleteExam = factory.deleteOne(Exam);

exports.getAllExam = factory.getAll(Exam);

exports.autoGrade = catchAsync(async (req, res, next) => {
  let grade = 0;
  const data = req.body.Questions;

  // Sort the questions by numberOfQuestion
  data.sort((a, b) => a.numberOfQuestion - b.numberOfQuestion);

  // Find the exam by ID and convert it to JSON
  const exam = await Exam.findById(req.params.id).lean();

  for (let i = 0; i < data.length; i++) {
    const correctAnswers = exam.Questions[i].Answers.filter(
      (answer) => answer.correct
    );
    const userAnswer = data[i].Answer.toLowerCase(); // Convert user's answer to lowercase for case-insensitive comparison

    // Check if user's answer is correct
    if (
      correctAnswers.some((answer) => answer.body.toLowerCase() === userAnswer)
    ) {
      grade += Number(data[i].Points);
    }
  }
  const totalPoints = exam.totalpoints;
  const passThreshold = totalPoints / 2;
  let status = grade >= passThreshold ? "passed" : "failed";

  const filter = { student: req.user.id, course: req.body.course };
  const update = {
    $push: {
      grades: {
        examId: req.params.id,
        nameOfExam: req.body.title,
        grade: grade,
        status: status,
      },
    },
  };
  await Register.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
    upsert: true, // Create the document if it doesn't exist
  });

  res.status(200).json({
    status: "success",
    results: { grade, status }, // Total grade
  });
});

exports.examInfo = catchAsync(async (req, res, next) => {
  const examId = req.params.id;

  // Fetch the exam details
  const exam = await Exam.findById(examId).lean();
  if (!exam) {
    return res.status(404).json({
      status: "fail",
      message: "Exam not found",
    });
  }

  // Calculate the total points of the exam
  const totalPoints = exam.totalpoints;
  const passThreshold = totalPoints / 2;

  // Fetch all registrations related to the course of the exam
  const registrations = await Register.find({ course: exam.course }).lean();

  let totalRegisteredStudents = registrations.length;
  let studentsAttended = 0;
  let studentsPassed = 0;
  let studentsFailed = 0;
  let studentsAbsent = 0;

  // Calculate the number of students who attended, passed, and failed the exam
  registrations.forEach((reg) => {
    const gradeEntry = reg.grades.find((grade) => grade.examId === examId);
    if (gradeEntry.status == "absent") {
      studentsAbsent++;
    } else if (gradeEntry.status == "passed") {
      studentsPassed++;
      studentsAttended++;
    } else {
      studentsFailed++;
      studentsAttended++;
    }
  });

  res.status(200).json({
    status: "success",
    data: {
      totalRegisteredStudents,
      studentsAttended,
      studentsPassed,
      studentsFailed,
      studentsAbsent,
      totalPoints,
      passThreshold,
    },
  });
});

exports.checkStudentTookExam = catchAsync(async (req, res, next) => {
  const check = await Register.findOne({
    student: req.user.id,
    "grades.examId": req.params.examId,
  });

  if (check) {
    return res.status(200).json({
      massage: false,
    });
  } else {
    return res.status(200).json({
      massage: true,
    });
  }
});
