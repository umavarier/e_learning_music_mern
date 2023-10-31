const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollmentSchema = new Schema({

  classPricing: [
    {
      planNumber:Number,
      planName:String,
      numberOfClasses: Number,
      price: Number,
      teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher' // Reference to the Teacher model
      },
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course' // Reference to the Teacher model
      },

    },
  ],
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;