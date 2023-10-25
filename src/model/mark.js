const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  term: String,
  marksObtained: Number,
  totalMarks: Number,
});

module.exports = mongoose.model("Mark", markSchema);
