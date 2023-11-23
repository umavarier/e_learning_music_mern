import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../../Utils/axios";
import axiosWithBlockCheck from "../../../Utils/axiosWithBlockCheck.js"
import TeacherSidebar from "../Sidebar/TeacherSidebar";
import TeacherHeader from "../Header/TeacherHeader";
import "./ViewCourse.css";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

function CourseManagement() {
  const teacherId = useSelector((state) => state.teacher.id);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const accessToken = Cookies.get("token");
    const decodedToken = jwt_decode(accessToken);
    const teacherId = decodedToken.id;
    axiosWithBlockCheck
      .get(`/teacherViewCourse?teacherId=${teacherId}`, {
        headers: {
          Authorization: ` ${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        setCourses(response.data);
        console.log("ti   " + response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, [teacherId]);

  return (
    <div className="CourseManagement">
      <TeacherHeader />
      <div className="teacher-content">
        <TeacherSidebar />
        <div className="courseTableContainer">
          <h2>View Courses</h2>
          <table className="courseTable">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.name}</td>
                  <td>{course.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CourseManagement;
