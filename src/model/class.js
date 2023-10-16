const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    enum: ['لڑکوں', 'لڑکیوں'],
    required: true,
  },
  status:{
    type: String,
    default: 'publish'
  }
});

module.exports = mongoose.model('Class', classSchema);