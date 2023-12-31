import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

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
          <li className="nav-item"></li>
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
              to={"/teacherAppointmentsList"}
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
              Demo Bookings
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={"/teacherAvailabilityList"}
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
              Your Availability List
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default TeacherSidebar;
