import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Header from "../Header/TeacherHeader";
import Sidebar from "../Sidebar/TeacherSidebar";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Carousel } from "react-responsive-carousel";
import { ToastContainer, toast } from "react-toastify";

function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [courseTimings, setCourseTimings] = useState([]);
  //   const [course, setCourse] = useState(null);
  const [teacherIdTkn, setTeacherIdTkn] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [courseWeek, setCourseWeek] = useState("");
  //   const [studentDetails, setStudentDetails] = useState([]);

  useEffect(() => {
    const accessToken = Cookies.get("token");
    console.log("fetch");
    const decodedToken = jwt_decode(accessToken);
    const teacherId = decodedToken.id;
    setTeacherIdTkn(teacherId);

    axios
      .get(`/teachers/getTeacherSpec/${teacherId}`, {
        headers: {
          Authorization: ` ${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        // console.log("spec-res " + response);
        if (response.status === 200) {
          setCourses(response.data);
          //   console.log("setCourse " + JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.error("Error fetching teacher courses", error);
      });
  }, []);

  useEffect(() => {
    const getCourseName = (courseId) => {
      const selectedCourse = courses.find((course) => course._id === courseId);
      if (selectedCourse) {
        setCourseName(selectedCourse.name);
      }
    };

    if (selectedCourseId) {
      getCourseName(selectedCourseId);
    }
  }, [selectedCourseId, courses]);

  const handleCourseClick = async (courseId) => {
    try {
      const response = await axios.get(
        `/teachers/getEnrolledStudentsByCourse/${courseId}`
      );

      if (response.data && response.data.length > 0) {
        console.log("stud---" + response.data[0]._id);
        setSelectedStudentId(response.data[0]._id);
        setStudentDetails(response.data);
        setSelectedCourseId(courseId);
      } else {
        // toast.error("No students enrolled in this course.");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to fetch student details.");
    }
  };

  const fetchCourseTimings = async (courseId) => {
    try {
      const response = await axios.get(
        `/teachers/getCourseTimings/${courseId}/${selectedStudentId}`
      );
      console.log("fetch-respons " + JSON.stringify(response.data));

      if (response.data) {
        console.log("respo " + JSON.stringify(response.data));

        const newStudentDetails = studentDetails.map((student) => {
          console.log("sssss" + JSON.stringify(studentDetails));
          if (student._id === selectedStudentId) {
            return {
              ...student,
              selectedDay: response.data[0].day,
              selectedTime: response.data[0].time,
            };
          }
          return student;
        });

        updateStudentDetails(newStudentDetails);
      }
    } catch (error) {
      console.error("Error fetching course timings:", error);
    }
  };

  const addCourseTiming = async () => {
    console.log("clicked");
    setIsModalOpen(true);
    console.log(isModalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the data to the backend using Axios
    const accessToken = Cookies.get("token");
    const decodedToken = jwt_decode(accessToken);
    const teacherId = decodedToken.id;

    try {
      const studentId = selectedStudentId;
      const response = await axios.post(
        `/teachers/addCourseTimingOfStudent/${studentId}`,
        {
          courseId: selectedCourseId,
          instructorId: teacherId,
          day,
          time,
        }
      );

      if (response.status === 200) {
        toast.success("Timing added successfully");
        setIsModalOpen(false);

        // Refresh course timings
        fetchCourseTimings(selectedCourseId, studentId);
      }
    } catch (error) {
      console.error("Error adding course timing:", error);
      toast.error("Failed to add timing");
    }
  };

  // Initial fetch of course timings
  if (selectedCourseId && selectedStudentId) {
    fetchCourseTimings(selectedCourseId, selectedStudentId);
  }
  // Function to edit a course timing
  const editCourseTiming = (timingId) => {
    // Implement this function to edit the timing with the specified timingId
    // You can open a modal or a form pre-filled with the timing details for editing.
    // After editing, make sure to update the state.
  };

  // Function to delete a course timing
  const deleteCourseTiming = (timingId) => {
    // Implement this function to delete the timing with the specified timingId
    // After deleting, make sure to update the state.
  };
  console.log("courseTimings " + JSON.stringify(courseTimings));

  const updateStudentDetails = (newStudentDetails) => {
    setStudentDetails(newStudentDetails);
  };
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <h2 className="text-center">Your Courses</h2>
            <Carousel
              showThumbs={false}
              emulateTouch={true}
              showStatus={false}
              showArrows={true}
              showIndicators={false}
              dynamicHeight={false}
              showStatus={false}
              showArrows={false}
              showIndicators={false}
              showThumbs={false}
              showArrows={true}
              emulateTouch={true}
              centerMode={true} // Enable center mode
              centerSlidePercentage={100 / 3}
            >
              {courses.map((course, index) => (
                <div key={course._id}>
                  <div
                    style={{
                      padding: "10px",
                      margin: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "40px",
                      backgroundColor:
                        index % 3 === 0
                          ? "#f6dae4"
                          : index % 3 === 1
                          ? "#d4f0f7"
                          : "#f7f0d4",
                      width: "400px",
                    }}
                    onClick={() => handleCourseClick(course._id)}
                  >
                    <h3
                      className="course-name-card"
                      style={{ fontSize: "30px" }}
                    >
                      {course.name}
                    </h3>
                    <p>{course.duration} Hrs</p>
                    {/* Display other course information */}
                  </div>
                </div>
              ))}
            </Carousel>
            {selectedCourseId && (
              <div>
                <h2>Student Details for Course : {courseName}</h2>
                {studentDetails && studentDetails.enrolledCoursesTiming ? (
                    
                  <table>
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Enrolled Course</th>
                        <th>Instructor</th>
                        <th>Course Timings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentDetails.map((student, index) => (
                        <tr key={index}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>
                            {student.enrolledCourses.map(
                              (enrolledCourse, courseIndex) => (
                                <div key={courseIndex}>
                                  {enrolledCourse.course?.name}
                                </div>
                              )
                            )}
                          </td>
                          <td>
                            {student.enrolledCourses.map(
                              (enrolledCourse, courseIndex) => (
                                <div key={courseIndex}>
                                  {enrolledCourse.instructorId?.userName}
                                </div>
                              )
                            )}
                          </td>
                          <td>
                            {student.enrolledCoursesTiming.length > 0 ? (
                              <div>
                                {`${student.enrolledCoursesTiming[0].day} - ${student.enrolledCoursesTiming[0].time}`}
                                {teacherIdTkn ===
                                  student.enrolledCourses[0].instructorId
                                    ._id && (
                                  <div>
                                    <MdEdit
                                      style={{
                                        fontSize: "20px",
                                        cursor: "pointer",
                                        color: "blue",
                                      }}
                                      onClick={() =>
                                        editCourseTiming(
                                          student.enrolledCoursesTiming[0]
                                            .timingId
                                        )
                                      }
                                    />
                                    <MdDelete
                                      style={{
                                        fontSize: "30px",
                                        cursor: "pointer",
                                        color: "red",
                                        border: "2px",
                                        borderColor: "black",
                                      }}
                                      onClick={() =>
                                        deleteCourseTiming(
                                          student.enrolledCoursesTiming[0]
                                            .timingId
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <p>No course timings available</p>
                                {teacherIdTkn ===
                                  student.enrolledCourses[0].instructorId
                                    ._id && (
                                  <MdAdd
                                    style={{
                                      fontSize: "35px",
                                      cursor: "pointer",
                                      color: "green",
                                    }}
                                    onClick={addCourseTiming}
                                  />
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No enrolled students in this course.</p>
                )}
              </div>
            )}

            {isModalOpen && (
              <div
                className="modal"
                style={{
                  display: isModalOpen ? "block" : "none",
                  position: "fixed",
                  zIndex: 1,
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fefefe",
                    margin: "15% auto",
                    padding: "20px",
                    border: "1px solid #888",
                    width: "15%",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      textAlign: "right",
                      cursor: "pointer",
                    }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </span>
                  <h2>Add Course Timing</h2>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="day">Day of the Week:</label>
                      <input
                        type="text-dark"
                        id="day"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        border="2px"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="time">Starting Time:</label>
                      <input
                        type="text-dark"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" style={{ marginTop: "10px" }}>
                      Add Timing
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default TeacherCourses;
