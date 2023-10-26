const express = require("express");
const User = require("../model/userModel");
const Course = require("../model/courseModel");
const Teacher = require("../model/teacherModel");
const Enrollment = require("../model/enrollmentModel");
const Appointment = require("../model/appointmentModel");
const Notification = require("../model/notificationModel");
const Payment = require("../model/paymentModel")
const userotp = require("../model/userOtp");
const nodemailer = require("nodemailer");


const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const storage = require("../util/multer1");
const directoryPath = "public/";

//email config

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

//   const userSignup= async (req, res) => {
//         try {
//                 let userEmail = req.body.email
//                 const users = await User.findOne({ email: userEmail })
//                 if (users) {
//                     res.json({ status: "userRegistered", error: "user already registered" })
//                 }
//                 else
//                 {
//                     const hashPassword = await bcrypt.hash(req.body.password, 10)
//                     const user = await User.create({
//                         userName: req.body.userName,
//                         email: req.body.email,
//                         password: hashPassword
//                     })
//                     res.json({ status: "ok", _id: user._id, name: user.userName })
//                 }

//             } catch (err) {
//                 console.log("err", err)
//                 res.json({ status: 'error', error: "Duplicate email" })
//             }
//         }

const userSignup = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      phoneNumber,
      isTeacher,
      description,
      headline,
      certificate,
      courses,
    } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      userName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    // If the user is a teacher, save additional data to the Teacher model
    if (isTeacher) {
      const teacher = new Teacher({
        userName,
        email,
        password: hashedPassword,
        role: 1,
        isTeacher,
        description,
        headline,
        certificate,
        courses,
      });

      await teacher.save();

      await Course.updateMany(
        { _id: { $in: courses } },
        { $addToSet: { instructorIds: teacher._id } }
      );
    }
    // Save the user data
    await user.save();

    return res
      .status(201)
      .json({ status: "ok", message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password, isTeacher } = req.body;

    if (isTeacher) {
      // Check in the teacher database
      const teacher = await Teacher.findOne({ email });

      if (teacher) {
        const passwordValid = await bcrypt.compare(password, teacher.password);

        if (passwordValid) {
          const token = jwt.sign(
            {
              name: teacher.userName,
              email: teacher.email,
              id: teacher._id,
              role: 1, // Set the role as 'teacher' for teachers
            },
            "secret123",
            {
              expiresIn: "7d",
            }
          );

          return res.json({
            status: "ok",
            message: "Login Success",
            user: token,
            role: 1,
          });
        }
      }
    } else {
      // Check in the user database
      const user1 = await User.findOne({ email });

      if (user1) {
        const passwordValid = await bcrypt.compare(password, user1.password);

        if (passwordValid) {
          const token = jwt.sign(
            {
              name: user1.userName,
              email: user1.email,
              id: user1._id,
              role: 0,
            },
            "secret123",
            {
              expiresIn: "7d",
            }
          );

          const username = user1.userName;

          return res.json({
            status: "ok",
            message: "Login Success",
            user: token,
            // username:username,
            role: 0,
          });
        }
      }
    }

    res.json({ status: "error", error: "Invalid Credentials", user: false });
  } catch (err) {
    res.json({ status: "error", error: "Oops, catch error" });
    console.log(err);
  }
};

const userotpsend = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Please enter your email" });
  }
  try {
    const preuser = await User.findOne({ email: email });
    if (preuser) {
      const OTP = Math.floor(100000 + Math.random() * 900000);
      const existEmail = await userotp.findOne({ email: email });
      console.log("OTP :" + OTP);

      if (existEmail) {
        const updateData = await userotp.findByIdAndUpdate(
          { _id: existEmail._id },
          {
            otp: OTP,
          },
          { new: true }
        );
        await updateData.save();

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Sending Email for OTP varification",
          text: `OTP: - ${OTP}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ error: "email not send" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      } else {
        const saveOtpData = new userotp({
          email,
          otp: OTP,
        });
        await saveOtpData.save();
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Sending Email For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ error: "email not send" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      }
    } else {
      res.status(400).json({ error: "This User Not Exist In our Db" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

const userLoginwithOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log("req.body  " + req.body.email);
  console.log("req.body  " + req.body.otp);

  if (!otp || !email) {
    res.status(400).json({ error: "Please Enter Your OTP and email" });
  }

  try {
    const otpverification = await userotp.findOne({ email: email });
    console.log("otp received!!  " + otpverification.otp);

    if (otpverification.otp === otp) {
      const preuser = await User.findOne({ email: email });
      // console.log("preuser ", preuser);
      // token generate
      const token = await preuser.generateAuthtoken();
      // console.log("token===  " + token);
      console.log("userId  " + preuser._id);
      res.status(200).json({
        message: "User Login Succesfully Done",
        userId: preuser._id,
        userName: preuser.userName,
        userToken: token,
      });
    } else {
      res.status(400).json({ error: "Invalid Otp" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

const verifyUserToken = async (req, res) => {
  try {
    const token =
      req.body.Token || req.query.Token || req.headers["x-access-token"];
    // console.log("verify " + token);

    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Token is missing." });
    }

    // Verify the token using your JWT secret
    const decoded = jwt.verify(token, "secret123");
    console.log("decoded  token: " + decoded._id);

    // Find the user from  database based on the decoded user ID
    const user = await User.findById(decoded._id);
    console.log("user   {}{}{" + user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Return the user's details
    res.json({ success: true, user });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Failed to authenticate token." });
  }
};

// const verifyToken = async (req, res) => {
//   try {
//     const decodedToken = jwt.verify(req.body.Token, "secret123");
//     const user = await User.findOne({ email: decodedToken.email });

//     if (user.image) {
//       user.image = `http://localhost:4000/${user.image}`;
//     } else {
//       user.image = `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`;
//     }
//     return res.status(200).json({ message: "token valid", token: true });
//   } catch (err) {
//     res.json({ status: "error", error: "invalid token", token: false });
//   }
// };

// const usergetUserDetails = (req, res) => {
//   const userId = req.user._id; // Assuming you pass the user object in the request
//   User.findById(userId, (err, user) => {
//     if (err) {
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     // Return user data as JSON response
//     res.json(user);
//   });
// };

const usergetUserDetails = async (req, res) => {
  try {
    // console.log(req.params.userId + "userId");

    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const upload = multer({ storage: multer });
const userImageUpdate = async (req, res) => {
  try {
    let Token = req.params.id;

    let token2 = JSON.parse(Token);
    console.log(token2);
    const decodedToken = jwt.verify(token2, "secret123");
    console.log(decodedToken);
    const user = await User.findOne({ _id: decodedToken.id });
    if (user) {
      // Check if there are uploaded files
      if (!req.files || !req.files.image) {
        return res
          .status(400)
          .json({ status: "error", message: "No image uploaded" });
      }

      // Update the user's image field in the database
      const update = await User.updateOne(
        { _id: decodedToken.id },
        {
          $set: {
            image: req.files.image[0].filename,
          },
        }
      );

      const image = `http://localhost:4000/uploads/${req.files.image[0].filename}`;
      return res
        .status(200)
        .json({ message: "Image updated successfully", image });
    } else {
      return res.json({ status: "error", message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

module.exports = { userImageUpdate, upload };

const viewTeachers = async (req, res) => {
  try {
    // Query your database to fetch the list of users who are teachers
    const teachers = await Teacher.find({ isTeacher: true });

    res.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPricing = async (req, res) => {
  try {
    const pricingData = await Enrollment.find().lean();
    // console.log("pricingdata" + JSON.stringify(pricingData));
    res.json(pricingData);
  } catch (error) {
    console.error("Error fetching pricing data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const processPayment = async (req, res) => {
  console.log("processPayment")
  const { amount, paymentMethod, userId } = req.body;
  // console.log("req.body"+JSON.stringify(req.body))
  const payment = new Payment({
    amount,
    paymentMethod,
    userId,
  });
  await payment.save();
  console.log("payment "+payment)
  res.json({ success: true, message: "Payment processed successfully" });
};

const getTeachersInCourse = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructors");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCourseForSignup = async (req, res) => {
  console.log("courses   :");
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userGetCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const userGetTeachers = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const teachers = await Teacher.find({ courses: courseId });
    res.json({ teachers });
  } catch (error) {
    console.error("Error fetching teachers for the course:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching teachers." });
  }
};

const userGetTeachersTiming = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    const teacher = await Teacher.findById(teacherId, "availableTimings");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const availableTimings = teacher.availableTimings;

    res.json({ availableTimings });
  } catch (error) {
    console.error("Error fetching teacher timings", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const bookDemo = async (req, res) => {
  console.log("book-demo");
  try {
    const { course, teacher, token, dayOfWeek, startTime, endTime } = req.body;
    const studentId = req.user._id;
    console.log("user:" + req.user._id);
    const newAppointment = new Appointment({
      studentId,
      teacherId: teacher,
      courseId: course,
      dayOfWeek,
      startTime,
      endTime,
    });

    await newAppointment.save();

    const adminId = "adminUserId";
    const teacherId = teacher;
    const message = `New appointment booked by user: ${studentId}`;

    // const adminNotification = new Notification({
    //   sender: studentId,
    //   receiver: adminId,
    //   message,
    //   appointment: newAppointment._id,
    // });

    const teacherNotification = new Notification({
      sender: studentId,
      receiver: teacherId,
      message: message,
      appointment: newAppointment._id,
    });

    // await Promise.all([adminNotification.save(), teacherNotification.save()]);
    await Promise.all([teacherNotification.save()]);

    res.status(201).json({
      message: "Booking successful!",
      appointmentId: newAppointment._id,
    });
  } catch (error) {
    console.error("Error booking", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getNotifications = async (req, res) => {
  console.log("getnot");
  const userId = req.body;
  console.log("msguser: " + JSON.stringify(req.body));
  try {
    const notifications = await Notification.find({ sender: userId }).sort({
      createdAt: -1,
    });
    console.log("msg " + notifications);

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendNotifications = async (req, res) => {
  console.log("sender: ");
  try {
    const { receiver, message, token } = req.body;
    console.log("user:" + req.user._id);
    const sender = req.user._id;
    const newNotification = new Notification({
      sender,
      receiver,
      message,
    });

    await newNotification.save();

    res.status(201).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAppointmentTiming = async (req, res) => {
  const { appointmentId } = req.params;
  console.log("appid: " + JSON.stringify(req.params));

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Parse the appointment time and current time as JavaScript Date objects
    const appointmentTime = new Date(
      `${appointment.dayOfWeek}T${appointment.startTime}`
    );
    const currentTime = new Date();

    // Check if the current time has passed the appointment time
    const isTimePassed = currentTime > appointmentTime;

    res.json({ isTimePassed });
  } catch (error) {
    console.error("Error checking appointment timing:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const userGetAppointmentTime = async (req, res) => {
  console.log("ugat");

  const userId = req.params.userID;
  console.log("userAppId  ", userId);
  try {
    const currentTime = new Date();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDayOfWeek = daysOfWeek[currentTime.getUTCDay()];

    const userAppointments = await Appointment.find({
      studentId: userId,
      dayOfWeek: currentDayOfWeek,
      startTime: {
        $lte: `${currentTime.getHours()}:${currentTime.getMinutes()}`,
      },
      endTime: {
        $gte: `${currentTime.getHours()}:${currentTime.getMinutes()}`,
      },
    });
    

    console.log("userAppointments " + userAppointments);
    if (userAppointments.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching appointments found." });
    }

    res.status(200).json(userAppointments);
  } catch (error) {
    console.error("Error fetching user's appointments:", error);
    res.status(500).json({ error: "Error fetching appointments" });
  }
};

module.exports = {
  userSignup,
  userLogin,
  userLoginwithOtp,
  userotpsend,
  verifyUserToken,
  userImageUpdate,
  viewTeachers,
  getCourseDetails,
  usergetUserDetails,
  getPricing,
  processPayment,
  getTeachersInCourse,
  getCourseForSignup,
  userGetCourses,
  userGetTeachers,
  userGetTeachersTiming,
  bookDemo,
  getNotifications,
  sendNotifications,
  checkAppointmentTiming,
  userGetAppointmentTime,
};
