const { json } = require("express");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const Teacher = require("../model/teacherModel");
const Course = require("../model/courseModel");
const Appointment = require("../model/appointmentModel");
const bcrypt = require("bcrypt");
const multer = require("../util/multer1");
const Availability = require("../model/availabilityModel");
const Notification = require("../model/notificationModel");
const mongoose = require('mongoose');

const secretKey = "your-secret-key";

const teacherLogin = async (req, res) => {
  console.log("teacherlog");
  const { email, password } = req.body;

  try {
    // Check if a teacher with the provided email exists
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    
    if (!teacher.isTeacherApproved) {
      return res.status(401).json({ error: "Admin approval pending" });
    }
    
    // Verify the provided password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (teacher.isBlock) {
      return res.status(403).json({ error: "Teacher blocked" });
    }
  
    // Generate an access token
    const accessToken = jwt.sign(
      { id: teacher._id, userName: teacher.userName, role: teacher.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Generate a refresh token
    const refreshToken = jwt.sign(
      { id: teacher._id, userName: teacher.userName, role: teacher.role },
      process.env.JWT_REFRESH,
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

    res.status(200).json({ token: accessToken, teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkTeacherProfilePicture =  async(req,res) => {
  try {
    const teacherId = req.teacher.id;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ hasProfilePicture: false });
    }

    if (teacher.profilePhoto) {
      return res.status(200).json({ hasProfilePicture: true });
    }

    return res.status(200).json({ hasProfilePicture: false });
  } catch (error) {
    console.error('Error checking profile picture:', error);
    return res.status(500).json({ hasProfilePicture: false });
  }
}

const teacherData = async (req, res) => {
  console.log("hello");
  try {
    // Get the teacher ID from the token
    const teacherId = req.teacher.id;
    console.log("teacher:  " + teacherId);

    // Fetch the teacher data from the database using the teacher ID
    const teacher = await Teacher.findById(teacherId);
    if (!teacherId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired toke" });
    }
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    console.log("test123");

    // Return the teacher data
    res.status(200).json({ teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const TeacherGetAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    // console.log(users+'userslist')
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

// const teacherViewCourse = async (req, res) => {

//     try {
//       const courses = await Course.find();
//       console.log("courses   ::"+courses);
//       res.status(200).json(courses);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };

const teacherViewCourse = async (req, res) => {
  console.log("tvc");
  try {
    const teacherId = req.teacher.teacherId;
    console.log("teacher   " + teacherId);

    if (!teacherId || !mongoose.isValidObjectId(teacherId)) {
      return res.status(400).json({ message: "Invalid teacherId" });
    }

    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Fetch courses for the specified teacher
    const courses = await Course.find({ instructorId: teacherId });

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads'); // Specify the upload directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
//   },
// });

// const upload = multer({ storage: storage });

const teacherUploadProfilePhoto = async (req, res) => {
  console.log("here", req.body);
  try {
    // const file = req.file;
    // if (!file) {
    //   return res.status(400).json({ error: 'No file uploaded' });
    // }

    // const filePath = file.path;
    // Access the uploaded file using req.file
    const uploadedFilePath = req.file.filename;

    console.log(uploadedFilePath + "  filename");

    const teacherId = req.body.teacherId;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Update the teacher's profilePhoto field with the uploaded file path
    teacher.profilePhoto = uploadedFilePath;
    console.log("teacher  " + teacher);

    await teacher.save();

    res.status(200).json({ message: "Profile photo uploaded successfully" });
  } catch (error) {
    console.error("Error uploading profile photo", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const addAvailability = async (req, res) => {
//   try {
//     const { teacherId, availableTimings } = req.body;

//     if (!Array.isArray(availableTimings) || availableTimings.length === 0) {
//       return res.status(400).json({ message: 'Invalid availableTimings data' });
//     }

//     const savedAvailabilities = [];
//     for (const timing of availableTimings) {
//       const { dayOfWeek, startTime, endTime } = timing;

//       // Create a new availability
//       const newAvailability = new Availability({
//         teacher: teacherId,
//         dayOfWeek,
//         startTime,
//         endTime,
//       });

//       const savedAvailability = await newAvailability.save();
//       savedAvailabilities.push(savedAvailability);
//     }

//     // Update the teacher's availableTimings array
//     const teacher = await Teacher.findByIdAndUpdate(
//       teacherId,
//       { $push: { availableTimings: { $each: availableTimings } } },
//       { new: true }
//     );

//     res.status(201).json(savedAvailabilities);
//   } catch (error) {
//     console.error('Error adding availability:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

const addAvailability = async (req, res) => {
  console.log("addavail");
  try {
    const { teacherId, availableTimings } = req.body;
    const teacherFromToken = req.teacher;

    // console.log("t-token " + req.teacher);
    // console.log("teacher  " + teacherId);
    if (teacherFromToken.id !== teacherId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!Array.isArray(availableTimings) || availableTimings.length === 0) {
      return res.status(400).json({ message: "Invalid availableTimings data" });
    }

    // Function to check if the availability already exists
    const checkAvailabilityExists = async (date, startTime, endTime) => {
      console.log("ck-")
      const existingAvailability = await Availability.findOne({
        teacher: teacherId,
        date,
        startTime,
        endTime,
      });
      return !!existingAvailability;
    };

    const savedAvailabilities = [];

    for (const timing of availableTimings) {
      const { date, startTime, endTime } = timing;

      // Check if the availability already exists
      const availabilityExists = await checkAvailabilityExists(
        date,
        startTime,
        endTime
      );

      console.log("availabilityExists " + availabilityExists);
      if (availabilityExists) {
        return res.status(400).json({
          message:
            "Availability with the same day, start time, and end time already exists",
        });
      }

      const newAvailability = new Availability({
        teacher: teacherId,
        date,
        startTime,
        endTime,
      });

      const savedAvailability = await newAvailability.save();
      savedAvailabilities.push(savedAvailability);
    }

    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $push: { availableTimings: { $each: savedAvailabilities } } },
      { new: true }
    );
      teacher.save();
    res.status(201).json(savedAvailabilities);
  } catch (error) {
    console.error("Error adding availability:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAppointments = async (req, res) => {
  console.log("tg-a");
  try {
    // console.log("params--" + req.params.teacherId);
    const { teacherId } = req.params;

    const appointments = await Appointment.find({ teacherId });

    return res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Find notifications for the given teacherId
    const notifications = await Notification.find({ receiver: teacherId });

    return res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getSenderEmail = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    console.log("nid " + notificationId);
    const appointment = await Appointment.findById(notificationId);

    if (!appointment) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const senderUserId = appointment.studentId;
    const senderUser = await User.findById(senderUserId);

    if (!senderUser) {
      return res.status(404).json({ message: "Sender user not found" });
    }
    res.status(200).json({ email: senderUser.email });
  } catch (error) {
    console.error("Error fetching sender email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchProfilePhoto = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const profileData = {
      profilePhotoUrl: teacher.profilePhoto,
    };
    console.log("pro---" + JSON.stringify(profileData));
    res.status(200).json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveVideoUrl = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { videoUrl } = req.body;

    console.log("vdoe-tid " + teacherId);
    console.log("vdoUrl " + videoUrl);

    // Find the teacher by ID and update the videos array
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.videos.push({ url: videoUrl });
    await teacher.save();

    res.status(200).json({ message: "Video URL saved successfully" });
  } catch (error) {
    console.error("Error saving video URL", error);
    res.status(500).json({ message: "Error saving video URL" });
  }
};

const getTeacherVideos = async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const videos = teacher.videos;

    res.status(200).json({ teacherVideos: videos });
  } catch (error) {
    console.error("Error fetching teacher videos", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTeacherSpec = async (req, res) => {
  const teacherId = req.teacher.id;
  try {
    console.log("teach==>" + teacherId);
    if (!teacherId) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const spec = await Teacher.find({ _id: teacherId }).populate("courses");
    // console.log(spec);
    if (spec.length > 0) {
      const courses = spec[0].courses;
      if (courses.length === 0) {
        return res.status(404).json({ error: 'No courses found for this teacher' });
      }
      // console.log(courses);
      const courseIdsAndNames = courses.map((course) => ({
        _id: course._id,
        name: course.name,
      }));
      // console.log(JSON.stringify(courseIdsAndNames))
      res.status(200).json(courses);
    } else {
      console.log("Teacher not found");
    }   
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
};

const getEnrolledStudentsByCourse = async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const students = await User.find({
      enrolledCourses: { $elemMatch: { course: courseId } },
    }).select("userName email enrolledCourses");

    if (!students || students.length === 0) {
      return res.status(200).json({ message: "No students enrolled in this course" });
    }

    const studentDetails = students.map((student) => ({
      _id: student._id,
      name: student.userName,
      email: student.email,
      enrolledCourses: student.enrolledCourses,
    }));

    res.status(200).json(studentDetails);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchTeacherNamesForCourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const teachers = await Teacher.find({ courses: courseId });
    // console.log("ttt  "+teachers)
    res.json({teachers}); 
  } catch (error) {
    console.error("Error fetching teachers for the course:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching teachers." });
  }
}
const addCourseTimingOfStudent = async (req, res) => {
  const studentId = req.params.studentId;
  const courseId = req.params.courseId;
  const { day, time } = req.body;

  try {
    const user = await User.findOne({ _id: studentId });
    console.log("enrolduser---"+user)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the course with the matching courseId in the enrolledCourses
    const course = user.enrolledCourses.find(
      (enrolledCourse) => enrolledCourse.course.toString() === courseId
    );

    if (!course) {
      return res.status(404).json({ error: "Course not found in enrolled courses" });
    }

    // Update the day and time for the selected course
    course.day = day;
    course.time = time;

    await user.save();

    res.status(200).json({ message: "Course timing added/updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add/update course timing" });
  }
};


const getCourseTimings = async (req, res) => {
  const studentId = req.params.studentId;
  const courseId = req.params.courseId;

  try {
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ error: "Student not found" });
    }

    const courseTiming = user.enrolledCourses.find(
      (timing) => timing.course.equals(courseId)
    );

    if (courseTiming) {
      res.json(courseTiming);
    } else {
      res.status(404).json({ error: "Course timing not found" });
    }
  } catch (error) {
    console.error("Error fetching course timing:", error);
    res.status(500).json({ error: "Failed to fetch course timing" });
  }
};

const getTeacherAppointments = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const appointments = await Appointment.find({ teacherId })
      .populate('studentId', 'userName')
      .populate('teacherId', 'userName')
      .populate('courseId', 'name');

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching teacher appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const cancelTeacherAppointment = async(req,res) => {
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

const updateSessionTiming =  async(req, res) => {
  try {
    const {userId , courseId} = req.params;
    // const { enrolledCourses } = req.body; 
    const {day, time} = req.body;
    console.log("stuuuu  "+JSON.stringify(req.params))
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const enrolledCourse = user.enrolledCourses.find((course) =>
      course.course.toString() === courseId
    );

    if (!enrolledCourse) {
      return res.status(404).json({ message: "Enrolled course not found" });
    }

    enrolledCourse.day = day;
    enrolledCourse.time = time;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating course timing:", error);
    res.status(500).json({ message: "Failed to update course timing" });
  }

}

const getTeacherAvailabilityList = async(req,res) => {
  const teacherId = req.params.teacherId;

  try {
    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Fetch availabilities for the specific teacher, populating the 'teacher' field
    const availabilities = await Availability.find({ teacher: teacherId }).populate('teacher', 'userName');

    // Send the availabilities as a JSON response
    res.json(availabilities);
  } catch (error) {
    console.error('Error fetching teacher availabilities:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const cancelTeacherAvailabilities = async (req,res) => {
  const availabilityId = req.params.availabilityId;

  try {
    const availability = await Availability.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    await Availability.findByIdAndRemove(availabilityId);

    res.status(200).json({ message: 'Availability canceled successfully' });
  } catch (error) {
    console.error('Error canceling availability:', error);
    res.status(500).json({ message: 'Failed to cancel availability' });
  }
}

const getEnrolledUsersForChat =  async(req,res)=> {
  try {
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
}

module.exports = {
  TeacherGetAllUsers,
  teacherLogin,
  checkTeacherProfilePicture,
  teacherData,
  teacherViewCourse,
  teacherUploadProfilePhoto,
  addAvailability,
  getAppointments,
  getNotifications,
  getSenderEmail,
  fetchProfilePhoto,
  saveVideoUrl,
  getTeacherVideos,
  getTeacherSpec,
  getEnrolledStudentsByCourse,
  fetchTeacherNamesForCourse,
  addCourseTimingOfStudent,
  getCourseTimings,
  getTeacherAppointments,
  cancelTeacherAppointment,
  updateSessionTiming,
  getTeacherAvailabilityList,
  cancelTeacherAvailabilities,
  getEnrolledUsersForChat,
};
