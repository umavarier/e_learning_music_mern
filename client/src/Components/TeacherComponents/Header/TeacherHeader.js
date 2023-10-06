import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './TeacherHeader.css'; // Create a separate CSS file for styling
import Swal from 'sweetalert2';
import axios from '../../../utils/axios'
import { clearTeacher } from '../../../Redux/teacherSlice'; 

function TeacherHeader() {
  const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  // const [teacherName, setTeacherName] = useState(''); // Store teacher's name
  // const teacherName = useSelector((state) => state.teacher.userName);
  const dispatch = useDispatch(); // Initialize useDispatch
  const isLoggedIn = useSelector((state) => !!state.teacher.id); // Check if teacher is logged in
  const teacherName = useSelector((state) => state.teacher.name); //get teachers name
  
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
        dispatch(clearTeacher());// Dispatch clearTeacher action to clear teacher data in Redux
        navigate('/teacherLogin'); // Navigate to the teacher's login page
      }
    });
  };

  // Check if the user is logged in by looking for a valid token in local storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("token :::"+token)
    const config = {
      headers: {
        // Authorization: `Bearer ${token}`,
        'Authorization': token
      },
    };

    const fetchTeacherData = async () => {
      try {
        console.log("heyyyyyyyy")
        // const response = await axios.get('/teachers/teacher-data',config);
        const response = await axios.get('/teachers/teacher-data',config);

          
        console.log("res:  "+response.status)
        console.log("data  "+response.data);

        if (response.status === 200) {
          const teacherData = await response.data;
          console.log("teacherData  "+teacherData)
          // Assuming teacherData contains a 'name' property
          const fetchedTeacherName = teacherData.userName;
          
          // Set the fetched teacher name in the component's state
         
        } else {
          console.error('Error fetching teacher data::::', response.statusText);
          
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        
      }
    };
    if(isLoggedIn){
      fetchTeacherData();
    }  
  
},[isLoggedIn]);

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
              <span className="teacherName text-dark">{teacherName}</span>
              <button className="teacherLogoutBtn" onClick={teacherLogout}>
                Logout
              </button>
            </form>
          ) : (
            <Link to="/teacherLogin">Teacher Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TeacherHeader;
