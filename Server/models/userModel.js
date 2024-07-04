const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Course = require("./coursesModel");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please tell us your name!"],
      maxlength: [15, "A  name must have less or equal then 10 characters"],
      minlength: [3, "A  name must have more or equal then 3 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please tell us your name!"],
      maxlength: [15, "A  name must have less or equal then 10 characters"],
      minlength: [3, "A  name must have more or equal then 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    file: {
      type: String,
      default: "https://teachable-58941829a392.herokuapp.com/user_1.png",
      required: [true, "Please provide a Photo"],
    },
    role: {
      type: String,
      enum: {
        values: ["student", "admin", "instructor", "super admin"],
        message: "role is either: admin, student, instructor",
      },
      default: "student",
    },
    phone: {
      type: String,
      validate: {
        validator: function (value) {
          return value.length === 11 && validator.isNumeric(value);
        },
        message: "Phone number must be exactly 11 digits",
      },
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    courses: [
      {
        type: mongoose.Schema.ObjectId, // identifiy to be a MongoDB ID
        ref: "Course",
        // grades: [
        //   {
        //     body: {
        //       type: String,
        //       required: true,
        //     },
        //     grade: {
        //       type: Number,
        //       required: true,
        //     },
        //   },
        // ],
      },
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: false,
    },
    rememberMe: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Moved timestamps into the same object
  }
);

userSchema.pre("save", async function (next) {
  // Only run this function if password has changed
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  //delete password Confirmation from database
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

// userSchema.pre(/^find/, function (next) {
//   //This point to current query
//   this.find({ active: { $ne: false } });
//   next();
// });

// this is virtual populate
userSchema.virtual("register", {
  ref: "Register",
  foreignField: "student",
  localField: "_id",
});

userSchema.virtual("assign", {
  ref: "Assign",
  foreignField: "instructor",
  localField: "_id",
});
userSchema.virtual("assignCourses", {
  ref: "Course",
  foreignField: "instructors",
  localField: "_id",
});
userSchema.virtual("registerCourses", {
  ref: "Course",
  foreignField: "students",
  localField: "_id",
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
