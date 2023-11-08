const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    term: String,
    session: String,
    marksObtained: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mark", markSchema);
