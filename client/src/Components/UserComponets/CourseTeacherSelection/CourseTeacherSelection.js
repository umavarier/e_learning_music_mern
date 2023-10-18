import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Header from "../Home/Header";
import "./CourseTeacherSelection.css";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../../Redux/notificationSlice";

const CourseTeacherSelection = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teacherTimings, setTeacherTimings] = useState([]);
  const [selectedTiming, setSelectedTiming] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isTimePassed, setIsTimePassed] = useState(false);

  const currentTime = new Date();
  const currentDayOfWeek = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const currentTimeString = currentTime.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  // Fetch courses and teachers from your backend when the component mounts
  useEffect(() => {
    // Fetch the list of courses
    axios
      .get("/userGetCourses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses", error);
      });

    // Fetch the list of teachers
    //   axios
    //     .get("/api/teachers")
    //     .then((response) => {
    //       setTeachers(response.data.teachers);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching teachers", error);
    //     });
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      axios
        .get(`/userGetTeachers/${selectedCourse}`)
        .then((response) => {
          setTeachers(response.data.teachers);
          console.log("selectedTeachers:", response);
        })
        .catch((error) => {
          console.error(
            "Error fetching teachers for the selected course",
            error
          );
        });
    } else {
      setTeachers([]); // Clear teachers when no course is selected
    }
  }, [selectedCourse]);

  // Fetch teacher's available timings when a teacher is selected
  useEffect(() => {
    if (selectedTeacher) {
      axios
        .get(`/userGetTeachersTiming/${selectedTeacher}/availableTimings`)
        .then((response) => {
          setTeacherTimings(response.data.availableTimings);
          console.log("timing-:" + JSON.stringify(response.data.availableTimings));
        })
        .catch((error) => {
          console.error("Error fetching teacher timings", error);
        });
    } else {
      setTeacherTimings([]); // Clear timings when no teacher is selected
    }
  }, [selectedTeacher]);

  const fetchAppointmentTimingStatus = (appointmentId) => {
    console.log("fetchAppid " + appointmentId);
    axios
      .get(`/check-appointment-timing/${appointmentId}`)
      .then((response) => {
        setIsTimePassed(response.data.isTimePassed);
        console.log("timepass: " + JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching appointment timing status", error);
      });
  };

  const handleConfirmBooking = () => {
    const userToken = localStorage.getItem("userdbtoken");
    console.log("tokenfrombooking: " + userToken);
    const selectedTimingData = teacherTimings.find(
      (timing) => timing._id === selectedTiming
    );

    if (selectedTimingData) {
      axios
        .post("/book-demo", {
          course: selectedCourse,
          teacher: selectedTeacher,
          dayOfWeek: selectedTimingData.dayOfWeek,
          startTime: selectedTimingData.startTime,
          endTime: selectedTimingData.endTime,
          token: userToken,
        })
        .then((response) => {
          const bookingTime = `${selectedTimingData.dayOfWeek}, ${selectedTimingData.startTime} - ${selectedTimingData.endTime}`;
          setConfirmationMessage(
            `Booking successful  !  Booking Time: ${bookingTime}`
          );
          // console.log("responseAppid " + JSON.stringify(response.data));
          // fetchAppointmentTimingStatus(response.data.appointmentId);
          const isTimePassed = 
          currentTime >= new Date(selectedTimingData.startTime);
          setIsButtonDisabled(isTimePassed);
        })
        .catch((error) => {
          console.error("Error booking", error);
        });
    }

    const notificationData = {
      sender: selectedTeacher,
      receiver: userId,
      message: `you have a freedemo at ${selectedTimingData.startTime}`,
      token: userToken,
    };
    console.log("sentnot" + notificationData);
    dispatch(addNotification(notificationData));

    axios
      .post("/sendNotifications", notificationData)
      .then((response) => {
        console.log("Notification sent successfully");
      })
      .catch((error) => {
        console.error("Error sending notification", error);
      });
  };

  useEffect(() => {
    if (selectedTiming) {
      const selectedTimingData = teacherTimings.find(
        (timing) => timing._id === selectedTiming
      );
  
      if (selectedTimingData) {
        const daysOfWeek = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        
        const selectedDayOfWeek = daysOfWeek.indexOf(selectedTimingData.dayOfWeek);
        const [hours, minutes] = selectedTimingData.startTime.split(':');
        const bookingTime = new Date();
        bookingTime.setHours(hours, minutes, 0, 0);
        bookingTime.setDate(bookingTime.getDate() + (selectedDayOfWeek + 7 - bookingTime.getDay()) % 7);
        
        const isTimePassed = currentTime >= bookingTime;
        setIsButtonDisabled(!isTimePassed);
      }
    }
  }, [selectedTiming, teacherTimings, currentTime]);
  

  return (
    <>
      <Header />
      <div className="card">
        <header className="card-header">
          <h1>Book a Demo</h1>
        </header>
        <div className="card-body">
          <label>Select a Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a Course</option>
            {courses &&
              courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
          </select>

          <br />

          <label>Select a Teacher:</label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">Select a Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.userName}
              </option>
            ))}
          </select>

          <br />

          <label>Select a Timing:</label>
          <select
            value={selectedTiming}
            onChange={(e) => setSelectedTiming(e.target.value)}
          >
            <option value="">Select a Timing</option>
            {teacherTimings.map((timing) => (
              <option key={timing._id} value={timing._id}>
                {timing.dayOfWeek} : {timing.startTime} - {timing.endTime}
              </option>
            ))}
          </select>

          <br />

          <button onClick={handleConfirmBooking} >
            Confirm Booking
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={isButtonDisabled}
            className={`join-button ${isButtonDisabled ? 'disabled' : ''}`}
          >
            Join for Demo
          </button>
        </div>
        {confirmationMessage && <p>{confirmationMessage}</p>}
      </div>
    </>
  );
};

export default CourseTeacherSelection;
