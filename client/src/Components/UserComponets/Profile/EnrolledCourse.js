import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userdbtoken");
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken) {
        setUserId(decodedToken._id);
      }

      axios
        .get(`/enrolled-courses/${decodedToken._id}`)
        .then((response) => {
          if (response.status === 200) {
            setEnrolledCourses(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching enrolled courses", error);
        });
    }
  }, []);

  const cardColors = ["#FAD02E", "#49A6E9", "#F8994B", "#A3D039", "#F46F8A", "#6A67CE"];

  // Create a CourseCard component to display each course
  const CourseCard = ({ course, color }) => (
    <div className="col-4">
      <div className="card  shadow-sm" style={{ background: color }}>
        <div className="card-body">
          <h5>{course.title}</h5>
          <p className="ec" style={{color :"black" , fontSize: "26px"}}>{course.name}</p>
          <p>{course.duration} Hrs</p>
          <p>{course.level} Level</p>
        </div>
      </div>
    </div>
  );

  const CourseCarousel = () => {
    return (
      <div className="row">
        {enrolledCourses.map((course, index) => (
          <CourseCard key={course._id} course={course} color={cardColors[index % cardColors.length]} />
        ))}
      </div>
    );
  };

  return (
    <div className="card border-6 rounded shadow-sm">
      <div className="card-body">
        <h4 className="mb-4 text-dark text-center">Enrolled Courses</h4>
        {enrolledCourses.length > 0 ? (
          <CourseCarousel />
        ) : (
          <p>No courses enrolled</p>
        )}
      </div>
    </div>
  );
}

export default EnrolledCourses;
