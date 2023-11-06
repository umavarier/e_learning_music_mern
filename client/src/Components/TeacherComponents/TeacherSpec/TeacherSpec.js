import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Header from "../Header/TeacherHeader";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Sidebar/TeacherSidebar";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Carousel } from "react-responsive-carousel";
import { ToastContainer, toast } from "react-toastify";
import { setStudentUserId } from '../../../Redux/studentSlice'; 

function TeacherCourses() {

  const dispatch = useDispatch(); 
  const [courses, setCourses] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [selectedStudentIdForTiming, setSelectedStudentIdForTiming] =
    useState(null);
    // const selectedStudentId = useSelector(state => state.student.studentUserId);

  useEffect(() => {
    const accessToken = Cookies.get("token");
    const decodedToken = jwt_decode(accessToken);
    const teacherId = decodedToken._id;

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
  const handleCourseClick = async (courseId) => {
    try {
      const response = await axios.get(
        `/teachers/getEnrolledStudentsByCourse/${courseId}`
      );

      if (response.data && response.data.length > 0) {
        dispatch(setStudentUserId(response.data._id));
        setSelectedStudentId(response.data._id);
        setStudentDetails(response.data);
        setSelectedCourseId(courseId);
        console.log("studentdetails   " + JSON.stringify(response.data));
        const course = courses.find((c) => c._id === courseId);
        if (course) {
          setCourseName(course.name);
        }
      } else {
        toast.error("No students enrolled in this course.");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to fetch student details.");
    }
  }; //working

  const addCourseTiming = (studentId) => {
    setSelectedStudentIdForTiming(studentId);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const studentId = selectedStudentIdForTiming;
      const courseId = selectedCourseId;

      console.log("day   " + day);
      console.log("time---" + time);
      console.log("student    " + studentId);
      console.log("course   " + courseId);
      const response = await axios.post(
        `/teachers/addCourseTimingOfStudent/${studentId}/${courseId}`,
        {
          day,
          time,
        }, {
          headers: {
            Authorization: ` ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Timing added successfully");
        setIsModalOpen(false);
        // Refresh course timings for the selected course
        fetchCourseTimings(courseId, studentId);
      }
    } catch (error) {
      console.error("Error adding course timing:", error);
      toast.error("Failed to add timing");
    }
  };

  const fetchCourseTimings = async (courseId, studentId) => {
    try {
      const response = await axios.get(
        `/teachers/getCourseTimings/${courseId}/${studentId}`, {
          headers: {
            Authorization: ` ${Cookies.get("token")}`,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setSelectedDay(response.data.day);
        setSelectedTime(response.data.time);
      }
    } catch (error) {
      console.error("Error fetching course timings:", error);
    }
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
              centerMode={true}
              centerSlidePercentage={100 / 3}
            >
              {courses.map((course, index) => (
                <div
                  key={course._id}
                  onClick={() => handleCourseClick(course._id)}
                >
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
                  >
                    <h3
                      className="course-name-card"
                      style={{ fontSize: "30px" }}
                    >
                      {course.name}
                    </h3>
                    <p>{course.duration} Hrs</p>
                    <p>{course.level} Level</p>
                  </div>
                </div>
              ))}
            </Carousel>
            
            {studentDetails && studentDetails.length > 0 ?(
              <div>
              <h2>Student Details for Course : {courseName}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Course Timings</th>
                  </tr>
                </thead>
                <tbody>
                  {studentDetails.map((student, index) => (
                    <tr key={index}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        {student.enrolledCourses
                          .filter(
                            (course) => course.course === selectedCourseId
                          )
                          .map((course, courseIndex) =>
                            course.day && course.time ? (
                              <div key={courseIndex}>
                                {course.day} - {course.time}
                              </div>
                            ) : (
                              <div>
                                <p>No course timings available</p>
                                <MdAdd
                                  style={{
                                    fontSize: "35px",
                                    cursor: "pointer",
                                    color: "green",
                                  }}
                                  onClick={() => addCourseTiming(student._id)}
                                />
                              </div>
                            )
                          )}
                        {/* {student.enrolledCourses.filter(
                          (course) => course.course === selectedCourseId
                        ).length === 0 ? (
                          <div>
                            <p>No course timings available</p>
                            <MdAdd
                              style={{
                                fontSize: "35px",
                                cursor: "pointer",
                                color: "green",
                              }}
                              onClick={() => addCourseTiming(student._id)}
                            />
                          </div>
                        ) : null} */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <p className="text-dark" style ={{fontSize: "30px" , marginTop : "50px"}}>No enrolled students !! Select one course</p>
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
