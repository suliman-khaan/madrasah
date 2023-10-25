const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String,
});

module.exports = mongoose.model("Subject", subjectSchema);
