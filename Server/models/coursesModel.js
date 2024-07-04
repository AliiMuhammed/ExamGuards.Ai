const mongoose = require("mongoose");
const User = require("./userModel");
const Register = require("../models/registerModel");
const Exam = require("../models/examsModel");
const Modules = require("../models/modulesModel");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      unique: true,
      trim: true,
      maxlength: [40, "A  name must have less or equal then 40 characters"],
      minlength: [5, "A  name must have more or equal then 5 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
      maxlength: [
        300,
        "A  Description must have less or equal then 300 characters",
      ],
      minlength: [
        20,
        "A  Description must have more or equal then 20 characters",
      ],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "A Course must have a duration"],
    },
    file: {
      type: String,
      default: "default.jpg",
    },
    numberOfStudents: {
      type: Number,
      required: false,
    },
    instructors: [
      {
        type: mongoose.Schema.ObjectId, // identifiy to be a MongoDB ID
        ref: "User",
      },
    ],
    students: [
      {
        type: mongoose.Schema.ObjectId, // identifiy to be a MongoDB ID
        ref: "User",
      },
    ],
    active: {
      type: Boolean,
      default: false,
      select: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

// this is virtual populate
courseSchema.virtual("modules", {
  ref: "Modules",
  foreignField: "course",
  localField: "_id",
});

courseSchema.virtual("assignment", {
  ref: "Assignment",
  foreignField: "course",
  localField: "_id",
});

// this is virtual populate
courseSchema.virtual("register", {
  ref: "Register",
  foreignField: "course",
  localField: "_id",
});

courseSchema.virtual("registerStudents", {
  ref: "User",
  foreignField: "courses",
  localField: "_id",
});

// this is virtual populate
courseSchema.virtual("assign", {
  ref: "Assign",
  foreignField: "course",
  localField: "_id",
});

// courseSchema.pre("save", async function (next) {
//   const instructorsPromises = this.instructors.map(
//     async (id) => await User.findById(id)
//   );
//   this.instructors = await Promise.all(instructorsPromises);
// });

courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "instructors",
    select: "firstName lastName",
  }); // here to make the output contains the details of the instructor we should write populating

  next();
});

// courseSchema.virtual("durationWeeks").get(function () {
//   return Math.floor(this.duration / 7); // Use Math.floor to round down to the nearest integer
// });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
