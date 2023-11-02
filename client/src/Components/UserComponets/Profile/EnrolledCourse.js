import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [noTimingsMessage, setNoTimingsMessage] = useState("");

  const cardColors = [
    "#f6dae4",
    "#d4f0f7",
    "#fefef1",
    "#e7e3e0",
    "#FFEDC5",
    "#e98c94",
  ];

  useEffect(() => {
    const token = localStorage.getItem("userdbtoken");
    if (token) {
      const decodedToken = jwt_decode(token);
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
  console.log("ec--->"+JSON.stringify(selectedCourse))
  const handleCardClick = (course) => {
    console.log("course??????? "+course)
    setSelectedCourse(course);
    console.log(
      JSON.stringify(selectedCourse)+"   sc"
    )
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

  // Create a CourseCard component to display each course
  
  const CourseCard = ({ course, color }) => (
    <div className="col-4" onClick={() => handleCardClick(course)}>   
      <div className="card  shadow-sm" style={{ background: color }}>
        <div className="card-body">
          <p className="ec" style={{ color: "black", fontSize: "23px" }}>
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
              <th className="text-dark">Name</th>
              <th className="text-dark">Level</th>
              <th className="text-dark">Duration</th>
              <th className="text-dark">instructor</th>              
                <th className="text-dark">Day</th>
                <th className="text-dark">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
              <td className="text-dark">{selectedCourse.course.name}</td>
                <td className="text-dark">{selectedCourse.course.level} Level </td>
                <td className="text-dark">{selectedCourse.course.duration} Hrs</td>
                <td className="text-dark">{selectedCourse.instructorName}</td>
                <td className="text-dark">{selectedCourse.day}</td>
                <td className="text-dark">{selectedCourse.time}</td>
                
              </tr>
            </tbody>
          </table>
        </div>
        <button className="close-btn-timing" style={{size:"20px"}} onClick={closeDetails}>Close</button>
      </div>
    );
  };

  return (
    <div className="card border-6 rounded shadow-sm">
      <div className="card-body">
        <h4 className="mb-4 text-dark text-center">Enrolled Courses</h4>
        {enrolledCourses.length > 0 ? (
          <div>
            <div className="row">
              {enrolledCourses.map((course, index) => (
                <CourseCard
                  key={course.course._id}
                  course={course}
                  color={cardColors[index % cardColors.length]}
                />
              ))}
            </div>
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
