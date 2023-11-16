import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "@mui/material/Button";

function EnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [noTimingsMessage, setNoTimingsMessage] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("userdbtoken");
  const decodedToken = jwt_decode(token);
  const userid = decodedToken._id;
  const cardColors = [
    "#f6dae4",
    "#d4f0f7",
    "#fefef1",
    "#e7e3e0",
    "#FFEDC5",
    "#e98c94",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const openChatWindow = (teacherId) => {
    // setSelectedStudentId(studentId);
    setSelectedTeacherId(teacherId);
    setIsChatWindowOpen(true);
  };
  useEffect(() => {
    const token = localStorage.getItem("userdbtoken");
    if (token) {
      const decodedToken = jwt_decode(token);
      // console.log(JSON.stringify(decodedToken)+"       uid")
      if (decodedToken) {
        fetchEnrolledCourses(decodedToken._id);
      }
    }
  }, []);

  const fetchEnrolledCourses = (userId) => {
    axios
      .get(`/enrolled-courses/${userId}`)
      .then((response) => {
        if (response.status === 200) {
          setEnrolledCourses(response.data);
          console.log("enroldStud-course  " + JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.error("Error fetching enrolled courses", error);
      });
  };
  console.log("ec--->" + JSON.stringify(selectedCourse));
  const handleCardClick = (course) => {
    console.log("course??????? " + course);
    setSelectedCourse(course);
    console.log(JSON.stringify(selectedCourse) + "   sc");
    fetchCourseDetails(course); // Fetch additional details
    setShowDetails(true);
  };

  const fetchCourseDetails = (course) => {
    if (!course.day || !course.time) {
      setNoTimingsMessage(
        "You have not assigned timings yet. Please check after 24 hours."
      );
    } else {
      setNoTimingsMessage("");
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  const handleJoinDemo = (courseId, teacherId) => {
    navigate(`/videoRoom/${courseId}`);
  };

  const CourseCard = ({ course, color }) => (
    <div
      className="col-4"
      style={{ width: "400px", margin: "0 auto" }}
      onClick={() => handleCardClick(course)}
    >
      <div className="card shadow-sm" style={{ background: color }}>
        <div className="card-body">
          <p className="ec" style={{ color: "black", fontSize: "30px" }}>
            {course.course.name}
          </p>
          <p>{course.course.duration} Hrs</p>
          <p>{course.course.level} Level</p>
        </div>
      </div>
    </div>
  );

  const CourseDetails = () => {
    if (!selectedCourse) {
      return null;
    }

    if (noTimingsMessage) {
      return <p>{noTimingsMessage}</p>;
    }

    return (
      <div>
        <h3>Course Details</h3>
        <div>
          <table>
            <thead>
              <tr>
                <th className="text-dark" style={{ fontSize: "24px" }}>
                  Name
                </th>
                <th className="text-dark" style={{ fontSize: "24px" }}>
                  Level
                </th>
                <th className="text-dark" style={{ fontSize: "24px" }}>
                  Duration
                </th>
                <th className="text-dark" style={{ fontSize: "24px" }}>
                  instructor
                </th>
                <th className="text-dark" style={{ fontSize: "24px" }}>
                  Day
                </th>
                <th className="text-dark" style={{ fontSize: "24px" }}>
                  Time
                </th>
                <th className="text-dark" style={{ fontSize: "24px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-dark" style={{ fontSize: "24px" }}>
                  {selectedCourse.course.name}
                </td>
                <td className="text-dark" style={{ fontSize: "24px" }}>
                  {selectedCourse.course.level} Level{" "}
                </td>
                <td className="text-dark" style={{ fontSize: "24px" }}>
                  {selectedCourse.course.duration} Hrs
                </td>
                <td className="text-dark" style={{ fontSize: "24px" }}>
                  {selectedCourse.instructorName}
                </td>
                <td className="text-dark" style={{ fontSize: "24px" }}>
                  {selectedCourse.day}
                </td>
                <td className="text-dark" style={{ fontSize: "24px" }}>
                  {selectedCourse.time}
                </td>
                <td>
                  <button
                    variant="contained"
                    color="primary"
                    style={{
                      margin: "10px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                    onClick={() => handleJoinDemo(selectedCourse.course._id)}
                  >
                    Join
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Button
          className="close-btn-timing"
          variant="contained"
          style={{
            fontSize: "20px",
            backgroundColor: "#E57373",
            color: "white", 
            margin: "10px", 
            borderRadius: "5px", 
          }}
          onClick={closeDetails}
        >
          Close
        </Button>
      </div>
    );
  };

  return (
    <div className="rounded ">
      <div className="card-body">
        <h4 className="mb-4 text-dark text-center">Enrolled Courses</h4>
        {enrolledCourses.length > 0 ? (
          <div>
            <Slider {...sliderSettings}>
              {enrolledCourses.map((course, index) => (
                <CourseCard
                  key={course.course._id}
                  course={course}
                  color={cardColors[index % cardColors.length]}
                />
              ))}
            </Slider>
            {showDetails && <CourseDetails />}
          </div>
        ) : (
          <p>No courses enrolled</p>
        )}
      </div>
    </div>
  );
}

export default EnrolledCourses;
