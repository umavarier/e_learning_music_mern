import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './Sidebar.css'

function TeacherSidebar() {
  const teacherId = useSelector((state) => state.teacher.id);
  return (
    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg sidebar" style={{ borderRight: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div className="position-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              to={'/teacherhome'}
              className="nav-link black-text"
              style={{
                marginTop: '50px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              Teacher Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={'/TeacherGetAllUsers'}
              className="nav-link black-text"
              style={{
                marginTop: '50px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              Students
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={`/teacherViewCourse?teacherId=${teacherId}`}
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
            </Link>
            <Link
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
