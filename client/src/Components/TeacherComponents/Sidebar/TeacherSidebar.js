import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import defaultProfilePic from "./defaultProfilePicture.jpeg";

import "./Sidebar.css";

function TeacherSidebar() {
  const teacherId = useSelector((state) => state.teacher.id);
  const hasProfilePic = true;
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("");
  };

  return (
    <nav
      id="sidebar"
      className="col-md-3 col-lg-2 d-md-block bg sidebar"
      style={{
        borderRight: "1px solid #ccc",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div className="position-sticky">
        <Avatar
          src={hasProfilePic ? "/path-to-profile-pic" : undefined}
          alt="Profile Pic"
          className="profile-pic"
          style={{ width: 100, height: 100 }} // Adjust the size as needed
        >
          {hasProfilePic ? undefined : (
            <>
              <PersonIcon fontSize="large" />
              {getInitials("John Doe")} {/* Replace with the user's name */}
            </>
          )}
        </Avatar>
        <ul className="nav flex-column">
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
              }}
            >
              Students
            </Link>
          </li>
          <li className="nav-item">
            {/* <Link
              to={`/teachers/teacherViewCourse?teacherId=${teacherId}`}
              className="nav-link black-text"
              style={{
                marginTop: '50px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              View Courses
            </Link> */}
            {/* <Link
              to={'/addCourse'}
              className="nav-link black-text"
              style={{
                marginTop: '50px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              Add Courses 
            </Link> */}
            <Link
              to={"/teacherProfile"}
              className="nav-link black-text"
              style={{
                marginTop: "50px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "white",
                color: "black",
              }}
            >
              View Profile
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link
              to={'/teacher-profile'}
              className="nav-link black-text"
              style={{
                marginTop: '50px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              Profile
            </Link>
          </li> */}
          {/*  more sidebar options for teachers  */}
        </ul>
      </div>
    </nav>
  );
}

export default TeacherSidebar;
