const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sent: {
    type: Boolean,
    default: false
  },
  section: {
    type: String,
    enum: ["لڑکوں", "لڑکیوں"],
    required: true,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  fee: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fee'
  }],
  status: {
    type: String,
    default: "publish",
  },
});

const ClassModel = mongoose.model("Class", classSchema);

module.exports = ClassModel;
