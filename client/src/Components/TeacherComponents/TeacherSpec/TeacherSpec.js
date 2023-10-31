import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Header from "../Header/TeacherHeader";
import Sidebar from "../Sidebar/TeacherSidebar";
import { Carousel } from "react-responsive-carousel";
import { ToastContainer, toast } from "react-toastify";

function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [courseTimings, setCourseTimings] = useState([]);
  //   const [course, setCourse] = useState(null);
  const [teacherIdTkn, setTeacherIdTkn] = useState(null);

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
        setStudentDetails(response.data);
        setSelectedCourseId(courseId);
      } else {
        toast.error("No students enrolled in this course.");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to fetch student details.");
    }
  };

  const addCourseTiming = () => {
    // Implement this function to add a new timing to the courseTimings state
    // You can open a modal or a form for the instructor to input the details.
    // After adding, make sure to update the state.
  };

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
            {selectedCourseId &&
              (
                <div>
                  <h2>Student Details for Course : {courseName}</h2>
                  {studentDetails.length > 0 ? (
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
                                    {enrolledCourse.course.name}
                                  </div>
                                )
                              )}
                            </td>
                            <td>
                              {student.enrolledCourses.map(
                                (enrolledCourse, courseIndex) => (
                                  <div key={courseIndex}>
                                    {enrolledCourse.instructorId.userName}
                                  </div>
                                )
                              )}
                            </td>

                            <td>
                              {courseTimings.length > 0 &&
                              teacherIdTkn === student.enrolledCourses.instructorId ? (
                                <ul>
                                  {courseTimings.map((timing) => (
                                    <li key={timing.timingId}>
                                      {timing.dayOfWeek}, {timing.startTime}
                                      {teacherIdTkn === student.enrolledCourses.instructorId && (
                                        <div>
                                          <MdEdit
                                           style={{ fontSize: '20px', cursor: 'pointer', color: 'blue' }}
                                            onClick={() =>
                                              editCourseTiming(timing.timingId)
                                            }
                                          />
                                          <MdDelete
                                           style={{ fontSize: '20px', cursor: 'pointer', color: 'red' }}
                                            onClick={() =>
                                              deleteCourseTiming(
                                                timing.timingId
                                              )
                                            }
                                          />
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No course timings available.</p>
                              )}
                              {teacherIdTkn === student.enrolledCourses.instructorId && (
                                <MdAdd
                                style={{ fontSize: '20px', cursor: 'pointer', color: 'green' }}
                                onClick={addCourseTiming} />
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
          </main>
        </div>
      </div>
    </>
  );
}

export default TeacherCourses;
