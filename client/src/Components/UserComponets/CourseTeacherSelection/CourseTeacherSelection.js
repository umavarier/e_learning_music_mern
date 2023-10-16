import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

const CourseTeacherSelection = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teacherTimings, setTeacherTimings] = useState([]);
  const [selectedTiming, setSelectedTiming] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

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
          console.log("timing-:" + JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("Error fetching teacher timings", error);
        });
    } else {
      setTeacherTimings([]); // Clear timings when no teacher is selected
    }
  }, [selectedTeacher]);

  
 const handleConfirmBooking = () => {
    const userToken = localStorage.getItem("token");
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
          setConfirmationMessage("Booking successful!");
        })
        .catch((error) => {
          console.error("Error booking", error);
        });
    }
 };

  return (
    <div>
      <h2>Book a Demo</h2>
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

      <button onClick={handleConfirmBooking}>Confirm Booking</button>

      {confirmationMessage && <p>{confirmationMessage}</p>}
    </div>
  );
};

export default CourseTeacherSelection;
