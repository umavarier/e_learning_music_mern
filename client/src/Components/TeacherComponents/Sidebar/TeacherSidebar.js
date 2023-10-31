import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "./Sidebar.css";

function TeacherSidebar() {
  const teacherId = useSelector((state) => state.teacher.id);
  return (
    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg sidebar">
      <div className="position-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              to={"/teacherhome"}
              className="nav-link black-text"
              style={{
                marginTop: "50px",

                borderRadius: "5px",
                backgroundColor: "white",

                fontSize: "20px",
              }}
            ></Link>
          </li>

          <li className="nav-item">
            <Link
              to={"/teacherhome"}
              className="nav-link black-text"
              style={{
                marginTop: "50px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "white",
                color: "black",
                fontSize: "20px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Teacher Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={"/TeacherGetAllUsers"}
              className="nav-link black-text"
              style={{
                marginTop: "50px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "white",
                color: "black",
                fontSize: "20px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Students
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={"/TeacherSpec"}
              className="nav-link black-text"
              style={{
                marginTop: "50px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "white",
                color: "black",
                fontSize: "20px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Your Courses
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={"/teacherProfile"}
              className="nav-link black-text"
              style={{
                marginTop: "50px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "white",
                color: "black",
                fontSize: "20px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              View Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default TeacherSidebar;
