const { json } = require("express");
const User = require("../model/userModel");
const Teacher = require("../model/teacherModel");
const jwt = require("jsonwebtoken");
const Enrollment = require("../model/enrollmentModel");
const Course = require("../model/courseModel");
const Appointment = require("../model/appointmentModel");
const Admin = require("../model/adminModel");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

const adminSignUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({ username, email, password: hashedPassword });
    await admin.save();
    res
      .status(201)
      .json({ status: "ok", message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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
const JWT_SECRET = "your-secret-key";
const adminLoginn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a teacher with the provided email exists
    const admin = await Admin.findOne({ email });
    console.log("admin? " + admin);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Verify the provided password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate an access token
    const accessToken = jwt.sign(
      { id: admin._id, userName: admin.username, email: admin.email },
      "secret123",
      {
        expiresIn: "1d",
      }
    );

    // Generate a refresh token
    const refreshToken = jwt.sign(
      { id: admin._id, userName: admin.username },
      "adminrefreshSecret123",
      {
        expiresIn: "7d", // Set the expiration time for refresh tokens
      }
    );

    // Send the access token and refresh token in the response as cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
    });

    res.status(200).json({ status: "ok", token: accessToken, admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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
    res.json({ status: "error", error: "course not found" });
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
    res.status(500).json({ message: "Server error" });
  }
};
const updateEnrollmentPricing = async (req, res) => {
  try {
    const { classPricing } = req.body;
    let enrollment = await Enrollment.findOne();

    console.log(JSON.stringify(enrollment) + "  cp");
    if (!enrollment) {
      enrollment = new Enrollment({ classPricing });
    } else {
      // Check if the planName and planNumber already exist in classPricing
      const planExists = enrollment.classPricing.some(
        (plan) =>
          plan.planName === (classPricing && classPricing.planName) &&
          plan.planNumber === (classPricing && classPricing.planNumber)
      );

      if (planExists) {
        return res.status(400).json({ message: "Plan already exists" });
      }

      enrollment.classPricing.push(...classPricing);
    }

    await enrollment.save();

    res.json({ message: "Enrollment pricing updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating enrollment pricing" });
  }
};

const adminEditCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourse = req.body; // The updated course data
    const course = await Course.findByIdAndUpdate(courseId, updatedCourse, {
      new: true,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adminDeleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByIdAndRemove(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(204).json();
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const adminApproveTeacher = async (req, res) => {
  const adminId = req.admin;
  const teacherId = req.params.teacherId;
  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    teacher.isTeacherApproved = true;
    teacher.isTeacherRejected = false;

    await teacher.save();
    const mailOptions = {
      from: process.env.EMAIL, 
      to: teacher.email, 
      subject: 'Teacher Approval Confirmation',
      text: 'Congratulations! You have been approved as a teacher on our platform.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending confirmation email:', error);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        console.log('Confirmation email sent: ' + info.response);
        res.status(200).json({ message: 'Teacher approved successfully' });
      }
    })
  } catch (error) {
    console.error("Error approving teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminRejectTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    teacher.isTeacherApproved = false;
    teacher.isTeacherRejected = true;

    await teacher.save();

    res.status(200).json({ message: "Teacher rejected successfully" });
  } catch (error) {
    console.error("Error rejecting teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEnrolledUsersList = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const enrolledUsers = await User.find({
      enrolledCourses: { $exists: true, $not: { $size: 0 } },
    })
      .populate({
        path: "enrolledCourses.course",
        select: "name",
      })
      .populate({
        path: "enrolledCourses.instructorId",
        select: "userName profilePhoto",
      })
      .exec();
    return res.status(200).json(enrolledUsers);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const adminGetPricingDetails = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const enrollmentData = await Enrollment.findOne();

    if (!enrollmentData) {
      return res.status(404).json({ error: "Enrollment data not found" });
    }

    const pricingDetails = enrollmentData.classPricing;

    return res.status(200).json(pricingDetails);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const adminEditPricing = async (req, res) => {
  try {
    const { _id, planNumber, planName, numberOfClasses, price } = req.body;

    const enrollment = await Enrollment.findOneAndUpdate(
      { "classPricing._id": _id },
      {
        $set: {
          "classPricing.$.planNumber": planNumber,
          "classPricing.$.planName": planName,
          "classPricing.$.numberOfClasses": numberOfClasses,
          "classPricing.$.price": price,
        },
      },
      { new: true } // To return the updated document
    );
    console.log("enr " + JSON.stringify(enrollment));
    if (!enrollment) {
      return res.status(404).json({ message: "Pricing not found" });
    }

    res.status(200).json({ message: "Pricing updated successfully" });
  } catch (error) {
    console.error("Error updating pricing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminDeletePricing = async (req, res) => {
  const pricingId = req.params.id;

  try {
    const enrollment = await Enrollment.findOne({
      "classPricing._id": pricingId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Pricing data not found" });
    }
    enrollment.classPricing = enrollment.classPricing.filter(
      (detail) => detail._id.toString() !== pricingId
    );
    await enrollment.save();

    return res
      .status(200)
      .json({ message: "Pricing data deleted successfully" });
  } catch (error) {
    console.error("Error deleting pricing data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adminGetUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("studentId", "userName email") // Populate user details
      .populate("teacherId", "userName email") // Populate teacher details
      .populate("courseId", "name"); // Populate course details

    const transformedAppointments = appointments.map(appointment => ({
      appointmentId: appointment._id,
      studentName: appointment.studentId ? appointment.studentId.userName : "N/A",
      teacherName: appointment.teacherId.userName,
      courseName: appointment.courseId.name,
      dayOfWeek: appointment.dayOfWeek,
      startTime: appointment.startTime,
      endTime: appointment.endTime
    }));

    res.json(transformedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};


const adminCancelAppointment = async(req,res) => {
  try {
    const appointmentId = req.params.appointmentId;
    
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment canceled successfully" });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ message: "An error occurred while canceling the appointment" });
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
  adminApproveTeacher,
  adminRejectTeacher,
  getEnrolledUsersList,
  adminGetPricingDetails,
  adminEditPricing,
  adminDeletePricing,
  adminGetUserAppointments,
  adminCancelAppointment,
};
