const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: String,
    code: String,
    totalMarks:Number,
    passingMarks:Number,
    status: { type: String, default: "publish" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", subjectSchema);
