const Course = require("../model/courseModel");
const Teacher = require("../model/teacherModel")

const addCourse = async (req, res) => {
  try {
    const {
      name,
      instructorId,
      duration,
      level,
      description,
      image,
      startDate,
      endDate,
      enrollments,
    } = req.body;

    console.log("req.body::::"+req.body.instructorId) 

    const course = new Course({
      name,
      instructorId ,
      duration,
      level,
      description,
      image,
      startDate,
      endDate,
      enrollments,
    });
    console.log("course:::"+course) //working

    const saved = await course.save();
    console.log('saved::'+saved)
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


module.exports = {
  addCourse,
  viewCourses,
  getCourseById,
  // teacherViewCourse,
};
