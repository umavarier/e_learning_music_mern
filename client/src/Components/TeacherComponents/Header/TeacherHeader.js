import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './TeacherHeader.css'; // Create a separate CSS file for styling
import Swal from 'sweetalert2';

function TeacherHeader() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [teacherName, setTeacherName] = useState(''); // Store teacher's name

  // Function to handle teacher logout
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
        localStorage.clear(); // Clear local storage
        setIsLoggedIn(false); // Update login state
        navigate('/teacher'); // Navigate to the teacher's login page
      }
    });
  };

  // Check if the user is logged in by looking for a valid token in local storage
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // If a token is found, the user is logged in
      setIsLoggedIn(true);

      // Here, you can make an API request to fetch the teacher's name based on the token
      // Replace this with your actual API request to fetch the teacher's name
      // For this example, I'm using a static name
      // Replace 'John Doe' with the actual teacher's name you receive from your API
      // setTeacherName('John Doe');
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg teacherHeadernav">
      <div className="container-fluid">
        {/* Brand */}
        <a className="navbar-brand" href="/teacherHome" style={{ color: 'black' }}>
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
          {isLoggedIn ? (
            <form className="d-flex">
              <span className="teacherName">{teacherName}</span>
              <button className="teacherLogoutBtn" onClick={teacherLogout}>
                Logout
              </button>
            </form>
          ) : (
            <Link to="/login">Teacher Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TeacherHeader;
