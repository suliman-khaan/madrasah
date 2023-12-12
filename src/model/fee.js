const mongoose = require('mongoose');

const feeRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the student
  month: String,
  year: Number,
  amountPaid: Number,
  discount: Number,
  type: String,
  status: String, // 'Pending', 'Paid', 'Discounted', etc.
});

module.exports = mongoose.model('Fee', feeRecordSchema);
