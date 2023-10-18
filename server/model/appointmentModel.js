const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for students
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher', // Reference to the User model for teachers
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to the Course model
    required: true,
  },
  dayOfWeek: {
    type: String, // You can specify the appropriate data type for dayOfWeek
    required: true,
  },
  startTime: {
    type: String, // Assuming startTime is a string in "HH:mm" format
    required: true,
  },
  endTime: {
    type: String, // Assuming endTime is a string in "HH:mm" format
    required: true,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
