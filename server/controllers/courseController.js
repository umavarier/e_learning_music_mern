const Course = require('../model/courseModel');

const addCourse = async (req, res) => {
    try {
      const { name, instructor, /* other course properties */ } = req.body;
      const course = new Course({
        name,
        instructor,
        // Set other course properties here
      });
      await course.save();
      res.status(201).json({ message: 'Course added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const viewCourses = async (req, res) => {
    try {
      const courses = await Course.find();
      res.status(200).json(courses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = { addCourse, viewCourses };
  