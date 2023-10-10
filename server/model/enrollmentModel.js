const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  classPricing: [
    {
      numberOfClasses: Number,
      price: Number,
    },
  ],
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;