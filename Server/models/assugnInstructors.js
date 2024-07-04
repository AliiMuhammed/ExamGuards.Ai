const mongoose = require("mongoose");
const User = require("./userModel");
const Course = require("./coursesModel");

const assignSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course", // Should match the model name exactly
      required: true,
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Should match the model name exactly
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Moved timestamps into the same object
  }
);

assignSchema.index({ course: 1, instructor: 1 }, { unique: true });

const Assign = mongoose.model("Assign", assignSchema);

module.exports = Assign;
