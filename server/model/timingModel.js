const mongoose = require('mongoose');

const timingSchema = new mongoose.Schema({
  from: String, 
  to: String,   
});

module.exports = mongoose.model('Timing', timingSchema);