const Course = require("../model/courseModel");
const Teacher = require("../model/teacherModel")
const User = require('../model/userModel')

const addCourse = async (req, res) => {
  try {
    const {
      name,
      // instructorId,
      duration,
      level,
      description,
      // startDate,
      // endDate,
      // enrollments,
    } = req.body;

    // Extract the image file from the request
    // const image = req.file;

    // Ensure that an image file is uploaded
    // if (!image) {
    //   return res.status(400).json({ message: "Image is required" });
    // }

    const course = new Course({
      name,
      // instructorId,
      duration,
      level,
      description,
      // image: {
      //   data: image.buffer, // Store the image buffer
      //   contentType: image.mimetype, // Store the image MIME type
      // },
      // startDate,
      // endDate,
      // enrollments,
    });

    const saved = await course.save();
    res.status(201).json({ message: "Course added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    // console.log("courses   ::"+courses);
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCourseById = async (req, res) => {
  console.log("getCourse")
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    // console.log("course data: "+course)

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const enrollUser = async (req, res) => {
  const { userId, courseId, teacherId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const enrollment = {
      course: courseId,
      instructorId: teacherId,
    };

    user.enrolledCourses.push(enrollment);

    if (teacherId) {
      user.instructorId = teacherId;
    }

    await user.save();
    res.json({ success: true, message: 'Enrollment successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Enrollment failed' });
  }
};



module.exports = {
  addCourse,
  viewCourses,
  getCourseById,
  enrollUser, 
};
