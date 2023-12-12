const mongoose = require("mongoose");
const User = require("./user");

const studentSchema = new mongoose.Schema({
  admission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  marks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mark",
    },
  ],
  fee: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fee'
  }]
});

const Student = User.discriminator("student", studentSchema);
module.exports = Student;
