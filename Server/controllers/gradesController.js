const Register = require("../models/registerModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Exam = require("../models/examsModel");

exports.getGradesforstudent = catchAsync(async (req, res, next) => {
  const gradesData = await Register.findOne({
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

  if (!gradesData) {
    return res.status(200).json({
      message: "No grades found for this student in this course.",
    });
  }

  // Extract the grades array
  const grades = gradesData.grades;

  // Calculate the total grade
  const totalGrade = grades.reduce((sum, grade) => sum + grade.grade, 0);

  res.status(200).json({
    status: "success",
    data: {
      grades,
      totalGrade,
    },
  });
});

exports.getGradesforCourse = catchAsync(async (req, res, next) => {
  const grades = await Register.find({ course: req.params.courseId });

  // Calculate total grades for each student
  const studentsWithTotalGrades = grades.map((grade) => {
    const totalGrade = grade.grades.reduce((acc, curr) => acc + curr.grade, 0);
    return {
      _id: grade.student._id,
      firstName: grade.student.firstName,
      lastName: grade.student.lastName,
      email: grade.student.email,
      id: grade.student.id,
      totalGrade: totalGrade,
    };
  });

  res.status(200).json({
    status: "success",
    results: studentsWithTotalGrades.length,
    data: {
      data: studentsWithTotalGrades,
    },
  });
});

exports.getGradesforExam = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;
  const examId = req.params.examId;

  // Fetch the exam details
  const exam = await Exam.findById(examId).lean();
  if (!exam) {
    return res.status(404).json({
      status: "fail",
      message: "Exam not found",
    });
  }

  // Find all students registered for the course
  const registrations = await Register.find({ course: courseId })
    .populate({
      path: "student",
      select: "firstName lastName email file", // Selecting the necessary fields
    })
    .lean();

  const results = await Promise.all(
    registrations.map(async (reg) => {
      if (!reg.student) {
        // Skip this registration if student is null
        return null;
      }

      const gradeEntry = reg.grades.find((grade) => grade.examId === examId);
      let status, grade;

      if (gradeEntry) {
        grade = gradeEntry.grade;
        status = gradeEntry.status;
      } else {
        grade = 0;
        status = "absent";

        // Push a new entry to the grades array
        await Register.updateOne(
          { _id: reg._id },
          {
            $push: {
              grades: {
                examId: examId,
                nameOfExam: exam.title, // Assuming exam has a title field
                grade: 0,
                status: "absent",
              },
            },
          }
        );
      }

      return {
        student: {
          _id: reg.student._id,
          firstName: reg.student.firstName,
          lastName: reg.student.lastName,
          email: reg.student.email,
          file: reg.student.file, // Assuming the file field contains the image
        },
        grade,
        status,
      };
    })
  );

  // Filter out any null results
  const filteredResults = results.filter(result => result !== null);

  res.status(200).json({
    status: "success",
    results: filteredResults.length,
    data: {
      grades: filteredResults,
    },
  });
});

exports.addGrades = catchAsync(async (req, res, next) => {
  const { courseId, studentId, examId } = req.params;
  const { grade } = req.body;

  const updatedRegister = await Register.findOneAndUpdate(
    { course: courseId, student: studentId, "grades.examId": examId },
    { $set: { "grades.$.grade": grade } },
    {
      new: true,
      upsert: true, // If registration does not exist, create a new one
      runValidators: true,
    }
  );

  // If the grade for the exam doesn't exist, add it to the grades array
  if (!updatedRegister) {
    await Register.findOneAndUpdate(
      { course: courseId, student: studentId },
      { $push: { grades: { examId, grade } } },
      { new: true, upsert: true, runValidators: true }
    );
  }

  res.status(200).json({
    status: "success",
  });
});

exports.getGradesExamStudent = catchAsync(async (req, res, next) => {
  const examId = req.params.examId;
  const grades = await Register.findOne({
    student: req.user.id,
    "grades.examId": examId,
  });

  if (!grades) {
    return res.status(404).json({
      status: "fail",
      message: "No grades found for the provided examId",
    });
  }

  const grade = grades.grades.find((grade) => grade.examId === examId);

  if (!grade) {
    return res.status(404).json({
      status: "fail",
      message: "No grade found for the provided examId",
    });
  }

  res.status(200).json({
    status: "success",
    data: grade,
  });
});

// exports.update = catchAsync(async (req, res, next) => {
//   const grade = await Register.findByIdAndUpdate({grades: grade.})
// });
