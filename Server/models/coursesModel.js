const mongoose = require("mongoose");

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
    photo: {
      type: String,
      default: "default.jpg",
    },
    materials: [
      {
        type: String,
        required: false,
        trim: true,
      },
    ],
    numberOfStudents: {
      type: Number,
      required: false,
    },
    instructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",
        required: [true, "Instructor is required!"],
      },
    ],
    active: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

courseSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
