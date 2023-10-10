const { json } = require("express");
const User = require("../model/userModel");
const Teacher = require("../model/teacherModel");
const jwt = require("jsonwebtoken");
const Enrollment = require('../model/enrollmentModel')

const adminLoginn = async (req, res) => {
  try {
    let adminData = req.body;
    let adminEmail = "admin@gmail.com";
    let password = "admin123";
    if (adminEmail == adminData.email && password == adminData.password) {
      res.json({ status: "ok", admin: true });
    } else {
      res.json({ status: "not Ok", error: "admin details invalid" });
    }
  } catch (err) {
    res.json({ status: "error", error: "oops catch error" });
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

const adminBlockTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Find the teacher by ID
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Toggle the isBlock status
    teacher.isBlock = !teacher.isBlock;

    // Save the updated teacher
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
  console.log("enroll")
  try {
    const { classPricing } = req.body;

    let enrollment = await Enrollment.findOne();
    console.log("enrollment2 "+enrollment)
    if (!enrollment) {
      enrollment = new Enrollment({ classPricing });
    } else {
      enrollment.classPricing = classPricing;
    }

    await enrollment.save();
    res.json({ message: 'Enrollment pricing updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
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
};
