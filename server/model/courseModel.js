const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name:
   {
    type: String,
    required: true,
  },
  instructorIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher', 
     
    },
  ],
 
  level: String,
  description: String,
  image: String,
  price: Number,
  startDate: Date,
  endDate: Date,
  duration: String,
  enrollments: Number,


  ratings:
   [
    {
      userId: Number,
      rating: Number,
      review: String,
    },
  ],
  pricing: [
    {
      numberOfClasses: Number, 
      price: Number, 
    },
  ],
  syllabus: [
    {
      week: Number,
      topic: String,
      lessons: [String],
    },
  ],
});

// Create a Course model using the schema
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
