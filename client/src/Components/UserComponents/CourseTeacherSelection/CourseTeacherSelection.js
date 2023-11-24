import React, { useEffect, useState } from "react";
import axios from "../../../Utils/axios";
import Header from "../Home/Header";
import "./CourseTeacherSelection.css";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { format } from "date-fns";
import jwt_decode from 'jwt-decode'

const CourseTeacherSelection = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [teacherTimings, setTeacherTimings] = useState([]);
  const [selectedTiming, setSelectedTiming] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isTimePassed, setIsTimePassed] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [timingError, setTimingError] = useState("");

  const currentTime = new Date();
  const currentDayOfWeek = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const currentTimeString = currentTime.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("/userGetCourses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses", error);
      });
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
      setTeachers([]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedTeacher) {
      axios
        .get(`/userGetTeachersTiming/${selectedTeacher}/availableTimings`)
        .then((response) => {
          setTeacherTimings(response.data.availableTimings);
          console.log(
            // "timing-:" + JSON.stringify(response.data.availableTimings)
          );
        })
        .catch((error) => {
          console.error("Error fetching teacher timings", error);
        });
    } else {
      setTeacherTimings([]); 
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

  const socket = io("https://melodymusic.online");
  // const socket = io("http://localhost:4000");

  const handleConfirmBooking = () => {
    const userToken = localStorage.getItem("userdbtoken");
    const decodedToken = jwt_decode(userToken)
    console.log("tokenfrombooking: " + JSON.stringify(decodedToken));
    const studentId = decodedToken._id

    setCourseError("");
    setTeacherError("");
    setTimingError("");

    // Validation checks
    if (!selectedCourse) {
      setCourseError("Please select a course.");
      return;
    }

    if (!selectedTeacher) {
      setTeacherError("Please select a teacher.");
      return;
    }

    if (!selectedTiming) {
      setTimingError("Please select a timing.");
      return;
    }

    const selectedTimingData = teacherTimings.find(
      (timing) => timing._id === selectedTiming
    );
    console.log("date-t  " + selectedTimingData.date);
    if (selectedTimingData) {
      axios
        .post(`/book-demo/${studentId}`, {
          course: selectedCourse,
          teacher: selectedTeacher,
          date: selectedTimingData.date,
          startTime: selectedTimingData.startTime,
          endTime: selectedTimingData.endTime,
          token: userToken,
        })
        .then((response) => {
          const bookingTime = `${
            isValidDate(selectedTimingData.date)
              ? format(new Date(selectedTimingData.date), "dd/MM/yyyy")
              : "Invalid Date"
          }, ${selectedTimingData.startTime} - ${selectedTimingData.endTime}`;
          setConfirmationMessage(
            `Booking successful  !  Booking Time: ${bookingTime}`
          );
          // console.log("responseAppid " + JSON.stringify(response.data));
          console.log("teacherSocket :" + selectedTeacher);
          const isTimePassed =
            currentTime >= new Date(selectedTimingData.startTime);
          setIsButtonDisabled(isTimePassed);
          const socket = io("https://melodymusic.online");
          // const socket = io("http://localhost:4000");
          socket.emit("notification", {
            to: selectedTeacher, // Teacher's socket ID
            message: `Booking confirmed for ${selectedTimingData.date}, ${selectedTimingData.startTime} - ${selectedTimingData.endTime}`,
          });
        })
        .catch((error) => {
          console.error("Error booking", error);
        });
    }
  };

  useEffect(() => {
    if (selectedTiming) {
      const selectedTimingData = teacherTimings.find(
        (timing) => timing._id === selectedTiming
      );

      if (selectedTimingData) {
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const selectedDayOfWeek = daysOfWeek.indexOf(selectedTimingData.date);
        const [hours, minutes] = selectedTimingData.startTime.split(":");
        const bookingTime = new Date();
        bookingTime.setHours(hours, minutes, 0, 0);
        bookingTime.setDate(
          bookingTime.getDate() +
            ((selectedDayOfWeek + 7 - bookingTime.getDay()) % 7)
        );

        const isTimePassed = currentTime >= bookingTime;
        setIsButtonDisabled(!isTimePassed);
      }
    }
  }, [selectedTiming, teacherTimings, currentTime]);

  function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  return (
    <>
      <Header />
      <div className="center-wrapper">
        <div className="card">
          <header className="card-header">
            <h1>Book a Demo</h1>
          </header>
          <div className="card-body">
            <label>Select a Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setCourseError("");
              }}
            >
              <option value="">Select a Course</option>
              {courses &&
                courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
            </select>
            {courseError && <p className="error">{courseError}</p>}
            <br />

            <label>Select a Teacher:</label>
            <select
              value={selectedTeacher}
              onChange={(e) => {
                setSelectedTeacher(e.target.value);
                setTeacherError("");
              }}
            >
              <option value="">Select a Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.userName}
                </option>
              ))}
            </select>
            {teacherError && <p className="error">{teacherError}</p>}
            <br />
            <label>Select a Timing:</label>
            <select
              value={selectedTiming}
              onChange={(e) => {
                setSelectedTiming(e.target.value);
                setTimingError("");
              }}
            >
              <option value="">Select a Timing</option>
              {teacherTimings.map((timing) => {
                // Format timing.date as dd/mm/yyyy
                const formattedDate = new Date(timing.date).toLocaleDateString(
                  "en-GB"
                );

                const currentDate = new Date().toLocaleDateString("en-GB");

                const formattedStartTime = timing.startTime;

                const currentTime = new Date().toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });

                if (
                  formattedDate >= currentDate &&
                  formattedStartTime >= currentTime
                ) {
                  return (
                    <option key={timing._id} value={timing._id}>
                      {formattedDate} : {timing.startTime} - {timing.endTime}
                    </option>
                  );
                }

                return null; 
              })}
            </select>
            {timingError && <p className="error">{timingError}</p>}

            <br />

            <button onClick={handleConfirmBooking}>Confirm Booking</button>
          </div>
          {confirmationMessage && <p>{confirmationMessage}</p>}
        </div>
      </div>
    </>
  );
};

export default CourseTeacherSelection;
