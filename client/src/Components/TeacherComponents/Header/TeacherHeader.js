import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherHeader.css'; // Create a separate CSS file for styling
import Swal from 'sweetalert2';

// Import your teacher profile picture
// import teacherProfilePicture from './teacher-profile-picture.jpg'; // Update with your actual image path

function TeacherHeader() {
  const navigate = useNavigate();

  const teacherLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Logout?',
      text: 'Do you want to Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/teacher'); // Navigate to the teacher's login page
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg teacherHeadernav">
      <div className="container-fluid">
        {/* Profile Picture */}
        {/* <img
          src={teacherProfilePicture} // Use the imported profile picture source
          alt="Teacher Profile"
          className="teacherProfilePicture"
        /> */}

        {/* Brand */}
        <a className="navbar-brand" href="/teacherHome" style={{ color: 'white' }}>
          TEACHER DASHBOARD
        </a>

        {/* Toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar menu */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"></li>
            <li className="nav-item"></li>
            <li className="nav-item dropdown">
              <ul className="dropdown-menu"></ul>
            </li>
            <li className="nav-item"></li>
          </ul>

          {/* Logout button */}
          <form className="d-flex">
            <button className="teacherLogoutBtn" onClick={teacherLogout}>
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default TeacherHeader;
