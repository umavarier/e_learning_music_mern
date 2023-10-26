const { json } = require("express");
const User = require("../model/userModel");
const Teacher = require("../model/teacherModel");
const jwt = require("jsonwebtoken");
const Enrollment = require('../model/enrollmentModel')
const Course = require('../model/courseModel')
const Admin = require('../model/adminModel');
const bcrypt = require("bcrypt");

const adminSignUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({ username, email, password:hashedPassword });
    await admin.save();
    res.status(201).json({ status: 'ok', message: 'Admin registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// const adminLoginn = async (req, res) => {
//   try {
//     // let adminData = req.body;
//     // let adminEmail = "admin@gmail.com";
//     // let password = "admin123";
//     // if (adminEmail == adminData.email && password == adminData.password) {
//     //   res.json({ status: "ok", admin: true });
//     // } else {
//     //   res.json({ status: "not Ok", error: "admin details invalid" });
//     // }
//   } catch (err) {
//     res.json({ status: "error", error: "oops catch error" });
//   }
// };
const JWT_SECRET = 'your-secret-key';
const adminLoginn = async (req, res) => {

  const { email, password } = req.body;

  try {
    // Check if a teacher with the provided email exists
    const admin = await Admin.findOne({ email });
    console.log("admin? "+admin)
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
   

    // Verify the provided password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
   
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate an access token
    const accessToken = jwt.sign(
      { id: admin._id, userName: admin.username, email: admin.email },
      'secret123',
      {
        expiresIn: '1d',
      }
    );

    // Generate a refresh token
    const refreshToken = jwt.sign(
      { id:admin._id, userName: admin.username },
      'refreshSecret123',
      {
        expiresIn: '7d', // Set the expiration time for refresh tokens
      }
    );
    

    // Send the access token and refresh token in the response as cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
    });

    res.status(200).json({ status: "ok", token: accessToken, admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    if (users) {
      res.json({ status: "ok", users: users });
    } else {
      console.log("users not found");
      res.json({ status: "error", users: "users not found" });
    }
  } catch (err) {
    res.json({ status: "error", error: "Data not find" });
    console.log(err);
  }
};

const deleteUsers = async (req, res) => {
  try {
    const deletUser = await User.deleteOne({ _id: req.params.id });
    console.log("delete user");
    res.json({ status: "ok", message: "user deleted" });
  } catch (err) {
    console.log("user not found");
    res.json({ status: "error", error: "something went wrong" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.json({ status: "error", message: "user not found" });
    } else {
      res.json({ status: "ok", message: "user found", userData: user });
    }
  } catch (err) {
    console.log("user not found with the edit id ");
    res.status(400).json({ status: "error", message: "oops errror" });
  }
};

const updateUsers = async (req, res) => {
  try {
    const { userName, email } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      const update = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            userName,
            email,
          },
        },
        { new: true }
      );
      console.log(update, "user updated");
      res.json({ status: "ok", message: "user updated", userexists: false });
    } else {
      console.log("user already exists");
      res.json({
        status: "error",
        message: "user already exists",
        userexists: true,
      });
    }
  } catch (err) {
    console.log("error123");
    res.json({ status: "error", error: "update error" });
  }
};

const adminSearchUser = async (req, res) => {
  const username = req.params.userkey;
  try {
    const users = await User.find({
      $or: [
        {
          userName: { $regex: username },
        },
        {
          email: { $regex: username },
        },
      ],
    });
    res.json({ status: "ok", message: "user found", users });
  } catch (err) {
    res.json({ status: "error", message: "no user found" });
  }
};

const adminAddTeacher = async (req, res) => {
  try {
    // Extract teacher details from the request body
    const { userName, email, password, description, headline, certificate } =
      req.body;

    // Create a new teacher instance
    const newTeacher = new Teacher({
      userName,
      email,
      password,
      role: 1,
      description,
      headline,
      certificate,
      isTeacher: "true", // Set isTeacher to true for teachers
    });

    // Save the teacher to the database
    const savedTeacher = await newTeacher.save();

    res.status(201).json(savedTeacher);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the teacher." });
  }
};

const adminGetTeachers = async (req, res) => {
  try {
    let teachers = await Teacher.find();
    if (teachers) {
      res.json({ status: "ok", teachers: teachers });
    } else {
      console.log("users not found");
      res.json({ status: "error", users: "users not found" });
    }
  } catch (err) {
    res.json({ status: "error", error: "Data not find" });
    console.log(err);
  }
};

const adminGetCourseList = async (req, res) => {
  try {
    let courses = await Course.find();
    if (courses) {
      res.json({ status: 200, courses: courses });
    } else {
      res.json({ status: 200, courses: [] }); 
    }
  } catch (err) {
      res.json({status:"error", error: "course not found"})
      console.log(err)
  }
} 

const adminBlockTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Find the teacher by ID
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    teacher.isBlock = !teacher.isBlock;

    await teacher.save();

    res.json({
      message: `Teacher ${teacher.userName} is now ${
        teacher.isBlock ? "blocked" : "unblocked"
      }`,
    });
  } catch (error) {
    console.error("Error toggling teacher block status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

 const getEnrollmentPricing = async (req, res) => {
  try { 
    const enrollment = await Enrollment.findOne();
    res.json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEnrollmentPricing = async (req, res) => {
  try {
    const { classPricing } = req.body;

    let enrollment = await Enrollment.findOne();

    if (!enrollment) {
      enrollment = new Enrollment({ classPricing });
    } else {
      enrollment.classPricing = classPricing;
    }
    console.log("enrollment"+enrollment)
    await enrollment.save();

    res.json({ message: 'Enrollment pricing updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating enrollment pricing' });
  }
};

const adminEditCourse = async(req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourse = req.body; // The updated course data
    const course = await Course.findByIdAndUpdate(courseId, updatedCourse, { new: true });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const adminDeleteCourse = async(req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByIdAndRemove(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(204).json(); 
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
  adminSignUp,
  adminLoginn,
  getAllUsers,
  deleteUsers,
  getUserDetails,
  updateUsers,
  adminSearchUser,
  adminAddTeacher,
  adminGetTeachers,
  adminBlockTeacher,
  getEnrollmentPricing,
  updateEnrollmentPricing,
  adminGetCourseList,
  adminEditCourse,
  adminDeleteCourse,
};
