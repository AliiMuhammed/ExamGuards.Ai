const mongoose = require("mongoose");
const User = require("./userModel");
const Course = require("./coursesModel");

const modulesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
    },
    file: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course", // Should match the model name exactly
      required: [true, "Modules must belong to a course"],
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Should match the model name exactly
      required: true,
    },
    prograss: [
      {
        studentId: {
          type: String,
          required: true,
        },
        status: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Moved timestamps into the same object
  }
);

// modulesSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "instructor",
//     select: "firstName lastName",
//   }); // here to make the output contains the details of the instructor we should write populating

//   next();
// });
const Modules = mongoose.model("Modules", modulesSchema);

module.exports = Modules;
