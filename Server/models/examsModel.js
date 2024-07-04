const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    ExamType: {
      type: String,
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: [true, "Exam must belong to a course"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    startedAt: {
      type: String, // Changed type to String
      required: true,
      trim: true,
    },
    expiredAt: {
      type: String, // Changed type to String
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["coming-soon", "open", "ended"],
      default: "coming-soon",
    },
    title: {
      type: String,
    },
    totalpoints: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    visiable: {
      type: Boolean,
      required: true,
    },
    Questions: [
      {
        type: Object,
        enum: [
          {
            QuestionType: "WrittenQuestion",
            QuestionTitle: {
              type: String,
              required: true,
            },
            Answer: {
              type: String,
              required: true,
            },
            Points: {
              type: Number,
              required: true,
            },
            TextMatch: {
              type: Boolean,
              required: true,
            },
            KeyWords: [
              {
                type: String,
              },
            ],
          },
          {
            QuestionType: "ChooseQuestion",
            numberOfQuestion: Number,
            QuestionTitle: {
              type: String,
              required: true,
            },
            Points: {
              type: Number,
              required: true,
            },
            Answers: [
              {
                body: {
                  type: String,
                  required: true,
                },
                correct: {
                  type: Boolean,
                  required: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Modified updateStatus method to save the updated status
examSchema.methods.updateStatus = async function () {
  const now = new Date();

  const startedAtDate = new Date(this.startedAt);
  const expiredAtDate = new Date(this.expiredAt);

  if (isNaN(startedAtDate.getTime()) || isNaN(expiredAtDate.getTime())) {
    throw new Error("Invalid date format for startedAt or expiredAt");
  }

  if (now >= startedAtDate && now < expiredAtDate) {
    this.status = "open";
  } else if (now >= expiredAtDate) {
    this.status = "ended";
  } else {
    this.status = "coming-soon";
  }

  await this.save();
};

// Static method to update the status of a document
examSchema.statics.updateExamStatus = async function (examId) {
  const exam = await this.findById(examId);
  if (exam) {
    await exam.updateStatus();
  }
};

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
