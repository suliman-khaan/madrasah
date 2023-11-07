const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      // required: true,
      // unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
    },
    nic: {
      type: String,
    },
    fatherNic: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    dob: {
      type: Date,
      required: true,
    },
    fatherPhone: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["عورت", "مرد"],
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    designation: {
      type: String,
    },
    education: {
      type: String,
      required: true,
    },
    admission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    status: {
      type: String,
      required: true,
      default: "publish",
    },
    // Add more fields as needed
  },
  {
    timestamp: true,
  }
);

userSchema.pre("save", async function (next) {
  const student = this;
  if (student.isNew && student.role == "student") {
    const currentYear = new Date().getFullYear();
    const count = await User.countDocuments({ role: "student" }).exec();

    student.rollNumber = `MDR${currentYear}${(count + 1)
      .toString()
      .padStart(4, "0")}`;
  }

  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
