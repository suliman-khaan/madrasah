const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    enum: ["لڑکوں", "لڑکیوں"],
    required: true,
  },
  status: {
    type: String,
    default: "publish",
  },
});

const ClassModel = mongoose.model("Class", classSchema);

module.exports = ClassModel;
