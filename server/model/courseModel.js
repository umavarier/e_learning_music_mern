const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name:
   {
    type: String,
    required: true,
  },
  instructorId: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher', // references the Teacher model
    required: true,
  },
  duration: String,
  level: String,
  description: String,
  image: String,
  price: Number,
  startDate: Date,
  endDate: Date,
  enrollments: Number,


  ratings:
   [
    {
      userId: Number,
      rating: Number,
      review: String,
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
