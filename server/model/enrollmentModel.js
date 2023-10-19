const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  classPricing: [
    {
      planNumber:Number,
      planName:String,
      numberOfClasses: Number,
      price: Number,
    },
  ],
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;