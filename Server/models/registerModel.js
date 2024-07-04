const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const registerSchema = new Schema(
  {
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course", // Should match the model name exactly
      required: true,
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Should match the model name exactly
      required: true,
    },
    grades: [
      {
        examId: {
          type: String,
          required: true,
        },
        nameOfExam: {
          type: String,
          required: true,
        },
        grade: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["passed", "absent", "failed"],
          default: "passed",
        },
      },
    ],
    status: {
      type: Boolean,
      default: false,
    },
    prograss: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

registerSchema.index({ course: 1, student: 1 }, { unique: true });

registerSchema.pre(/^find/, function (next) {
  this.populate({
    path: "student",
    select: "firstName lastName email _id file",
  }).populate({
    path: "course",
    select: "name description file status duration instructors -active ", // Specify fields to include and exclude
  });

  next();
});

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;
