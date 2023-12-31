const Course = require("../model/courseModel");
const Appointment = require("../model/appointmentModel");
const moment = require('moment-timezone')

const timeZone = "Asia/Kolkata"; // Indian Standard Time (IST) timezone
const timeFormat = 'YYYY-MM-DD h:mm A'; // Specify your input time format

const scheduleDemo = async (req, res) => {
  console.log("schedule:::");
  try {
    const { studentId, teacherId, courseId, appointmentTime } = req.body;
    // console.log("stud: " + studentId);
    // console.log("tea:" + teacherId);
    // console.log("course: " + courseId);
    // console.log("appointmentTime : ", appointmentTime);

    // // Parse the appointmentTime in the provided format and convert to IST
    // const appointmentTimeIST = moment.tz(appointmentTime, timeFormat, timeZone);
    // console.log("ist??"+appointmentTimeIST)
    // // Create a new appointment
    // const appointment = new Appointment({
    //   studentId,
    //   teacherId,
    //   courseId,
    //   appointmentTime :appointmentTimeIST  // Save IST time
    // });
    // console.log("app  " + appointment.appointmentTime);
    // await appointment.save();

    res.status(201).json({ message: "Appointment scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling demo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAppointmentDetails = async (req, res) => {
  try {
    // // Get the studentId, teacherId, and courseId from the request query or parameters
    // const { studentId, teacherId, courseId } = req.query; // Assuming you send these as query parameters
    // console.log("appointment 12 " + req.body);

    // // Query the Appointment model to find the appointment based on the provided criteria
    // const appointment = await Appointment.findOne({
    //   studentId,
    //   teacherId,
    //   courseId,
    // });
    // console.log("aptsave  " + appointment);

    // if (!appointment) {
    //   return res.status(404).json({ error: "Appointment not found" });
    // }

    // // Send the appointment details including the appointmentTime
    // res.status(200).json({ appointmentTime: appointment.appointmentTime });
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  scheduleDemo,
  getAppointmentDetails,
};
