const express = require("express");
const User = require("../model/userModel");
const Course = require("../model/courseModel");
const Teacher = require("../model/teacherModel");
const Enrollment = require("../model/enrollmentModel");
const Appointment = require("../model/appointmentModel");
const Notification = require("../model/notificationModel");
const Payment = require("../model/paymentModel");
const userotp = require("../model/userOtp");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const storage = require("../util/multer1");
const directoryPath = "public/";
const { format } = require('date-fns');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const userSignup = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      phoneNumber,
      isTeacher,
      courses,
      certificate,
      description,
      credentials,   
    } = req.body;
    
    // console.log("signup "+JSON.stringify(req.body))
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res
      .status(400)
      .json({ status: "error", message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      userName,
      email,
      password: hashedPassword,
      phoneNumber,
      role:0,
      isTeacher,
      courses,
      description,       
      certificate,

    });
    console.log("user  "+user)
    // If the user is a teacher, save additional data to the Teacher model
    if (isTeacher) {
      const teacher = new Teacher({
        userName,
        email,
        password: hashedPassword,
        phoneNumber,
        role: 1,
        isTeacher,
        courses,
        description,       
        certificate,
        
      });
      
      await teacher.save();
      console.log("req.body  "+teacher.courses)

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



const userotpsend = async (req, res) => {
  console.log("otp")
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
      res.status(400).json({ error: "This User is not registered" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

const userLoginwithOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    res.status(400).json({ error: "Please Enter Your OTP and email" });
    return;
  }

  try {
    const otpverification = await userotp.findOne({ email: email });

    if (!otpverification || otpverification.otp !== otp) {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    const preuser = await User.findOne({ email: email });
    const token = await preuser.generateAuthtoken();

    res.status(200).json({
      message: "User Login Successfully Done",
      userId: preuser._id,
      userName: preuser.userName,
      email: preuser.email,
      userToken: token,
    });
  } catch (error) {
    res.status(500).json({ error: "Invalid Details", error });
  }
};
 

const verifyUserToken = async (req, res) => {
  try {
    const token =
      req.body.Token || req.query.Token || req.headers["x-access-token"];

    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Token is missing." });
    }

    // Verify the token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    const token = req.query.token;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decodedToken._id });

    if (user) {
      if (!req.file) {
        return res
          .status(400)
          .json({ status: "error", message: "No image uploaded" });
      }

      const update = await User.updateOne(
        { _id: decodedToken.id },
        {
          $set: {
            image: req.file.filename,
          },
        }
      );
      user.image = req.file.filename;
      await user.save();

      // const image = `http://localhost:4000/uploads/${req.file.filename}`;
      const image = req.file.filename;
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

const fetchUserProfilePhoto = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const profileData = {
      profilePhotoUrl: user.image,
    };
    res.status(200).json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewTeachers = async (req, res) => {
  try {
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
  console.log("processPayment");
  const { amount, paymentMethod, userId, purchasedCourse, teacherId } =
    req.body;
  console.log("req.body" + JSON.stringify(req.body));
  const payment = new Payment({
    amount,
    paymentMethod,
    userId,
    purchasedCourse,
    teacherId,
  });
  await payment.save();
  console.log("payment " + payment);
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
    // console.log("at--"+JSON.stringify(availableTimings))
    res.json({ availableTimings });
  } catch (error) {
    console.error("Error fetching teacher timings", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const bookDemo = async (req, res) => {
  console.log("book-demo");
  try {
    const { course, teacher, token, date, startTime, endTime } = req.body;
    console.log("bookdemo  "+JSON.stringify(req.body))
    const studentId = req.params.studentId;
    console.log("user:" + studentId);
    const newAppointment = new Appointment({
      studentId,
      teacherId: teacher,
      courseId: course,
      date,
      startTime,
      endTime,
    });

    await newAppointment.save();

    

    const adminId = "adminUserId";
    const teacherId = teacher;
    const message = `New appointment booked by user: ${studentId}`;

   

    const teacherNotification = new Notification({
      sender: studentId,
      receiver: teacherId,
      message: message,
      appointment: newAppointment._id,
    });

    await Promise.all([teacherNotification.save()]);
    const user = await User.findById(studentId)
    const userEmail = user.email;
   
    const mailOptions = {
      from: process.env.EMAIL, 
      to: userEmail, 
      subject: 'Free Demo Booking Successful',
      html: `
        <p>Your booking for the free demo is successful for ${course.name} </p>
        <p>Date: ${format(new Date(date), "dd/MM/yyyy")}</p>
        <p>Start Time: ${startTime}</p>
        <p>End Time: ${endTime}</p>       
        <p>Thank you for booking with us!</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

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

    const appointmentTime = new Date(
      `${appointment.dayOfWeek}T${appointment.startTime}`
    );
    const currentTime = new Date();

    const isTimePassed = currentTime > appointmentTime;

    res.json({ isTimePassed });
  } catch (error) {
    console.error("Error checking appointment timing:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const userGetAppointmentTime = async (req, res) => {
  const userId = req.params.userId;
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
      return res;
      return res.status(200).json([]);
    }

    res.status(200).json(userAppointments);
  } catch (error) {
    console.error("Error fetching user's appointments:", error);
    res.status(500).json({ error: "Error fetching appointments" });
  }
};
const getEnrolledCourses = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId)
      .populate({
        path: "enrolledCourses.course",
        model: "Course",
        select: "name duration level _id",
      })
      .populate({
        path: "enrolledCourses.instructorId",
        model: "Teacher",
        select: "userName _id",
      });

    if (!user) {
      return res.status(200).json({ message: "User not found" || []});
    }

    const enrolledCourses = user.enrolledCourses.map((enrolledCourse) => {
      if (enrolledCourse.course && enrolledCourse.instructorId) {
        return {
          course: {
            _id: enrolledCourse.course._id,
            name: enrolledCourse.course.name,
            
            duration: enrolledCourse.course.duration,
            level: enrolledCourse.course.level,
          },
          instructorName: enrolledCourse.instructorId.userName, 
          instructorId:enrolledCourse.instructorId._id,
          time: enrolledCourse.time,
          day: enrolledCourse.day
        };
      }
      return {};
    });

    res.status(200).json(enrolledCourses);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Internal server error" });
  }
};

// module.exports = getEnrolledCourses;

const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find payments for the specified userId using the Payment model
    const payments = await Payment.find({ userId });

    if (!payments) {
      return res.status(404).json({ message: "No payment details found." });
    }

    const paymentDetails = [];

    for (const payment of payments) {
      // Assuming purchasedCourseId is an array of course IDs
      const purchasedCourseIds = payment.purchasedCourse;

      const courseNames = await Course.find({
        _id: { $in: purchasedCourseIds },
      });

      paymentDetails.push({
        payment,
        courseNames,
      });
    }

    res.status(200).json(paymentDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


const getUserDemoBookings = async(req, res) => {
  const userId = req.params.userId;

  try {
    const userDemoBookings = await Appointment.find({ studentId: userId })
      .populate('teacherId', 'userName')
      .populate('courseId', 'name');

    res.json(userDemoBookings);
  } catch (error) {
    console.error('Error fetching user demo bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const cancelUserAppointment =  async(req,res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await Appointment.findByIdAndRemove(appointmentId);

    res.json({ message: 'Appointment canceled successfully' });
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getTeacherProfileForHome = async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const courseData = await Course.find({ _id: { $in: teacher.courses } }).exec();

    const courseNames = courseData.map((course) => course.name);
    const coursesWithIds = courseData.map((course) => ({ _id: course._id, name: course.name }));

    const response = {
      userName: teacher.userName,
      profilePhoto: teacher.profilePhoto,
      courses: courseNames,
      coursesWithIds,
      videos: teacher.videos.map((video) => ({
        url: video.url,
        courseId: video.course,
      })),
      email: teacher.email,
    };

    console.log("cn  " + JSON.stringify(response));
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching teacher's profile:", error);
    res.status(500).json({ message: "Failed to fetch teacher's profile" });
  }
};


const getTeachersByCourse = async(req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const instructorIds = course.instructorIds;

    const instructors = await Teacher.find({ _id: { $in: instructorIds } });
    console.log("ccc" + instructors)
    res.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getAllTeachersList = async (req, res) => {
  try {
    const teachers = await Teacher.find({ isTeacher: true });
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  userSignup,
  userLoginwithOtp,
  userotpsend,
  verifyUserToken,
  userImageUpdate,
  fetchUserProfilePhoto,
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
  getEnrolledCourses,
  getPaymentHistory,
  getUserDemoBookings,
  cancelUserAppointment,
  getTeacherProfileForHome,
  getTeachersByCourse,
  getAllTeachersList,
};
