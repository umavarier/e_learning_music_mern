// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

function AdminSidebar() {
  return (
    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg sidebar" style={{ borderRight: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div className="box">
      <div className="rectangle">
        
        <ul className="nav flex-column">
                <li className="nav-item">
                  <Link
                    to={'/adminHome'}
                    className="nav-link black-text"
                    // style={{
                    //   marginTop: '50px',
                    //   border: '1px solid #ccc',
                    //   borderRadius: '5px',
                    //   backgroundColor: 'white',
                    //   color: 'black', // Set text color to black
                    // }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to={'/users'}
                    className="nav-link black-text"
                    // style={{
                    //   marginTop: '50px',
                    //   border: '1px solid #ccc',
                    //   borderRadius: '5px',
                    //   backgroundColor: 'white',
                    //   color: 'black', // Set text color to black
                    // }}
                  >
                    Students
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to={'/teachers'}
                    className="nav-link black-text"
                    // style={{
                    //   marginTop: '50px',
                    //   border: '1px solid #ccc',
                    //   borderRadius: '5px',
                    //   backgroundColor: 'white',
                    //   color: 'black', // Set text color to black
                    // }}
                  >
                    Teachers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to={'/adminCourseManagement'}
                    className="nav-link black-text"
                   
                  >
                    Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to={'/adminUpdateEnrollmentPricing'}
                    className="nav-link black-text"
                    // style={{
                    //   marginTop: '50px',
                    //   border: '1px solid #ccc',
                    //   borderRadius: '5px',
                    //   backgroundColor: 'white',
                    //   color: 'black', // Set text color to black
                    // }}
                  >
                    Pricing
                  </Link>
                </li>
                {/* Add more sidebar options as needed */}
                <li className="nav-item">
                  <Link
                    to={'/option4'}
                    className="nav-link black-text"
                    // style={{
                    //   marginTop: '50px',
                    //   border: '1px solid #ccc',
                    //   borderRadius: '5px',
                    //   backgroundColor: 'white',
                    //   color: 'black', // Set text color to black
                    // }}
                  >
                    Notifications
                  </Link>
                </li>
                

          {/* Add more sidebar options as needed */}
        </ul>
      </div>
      </div>
    </nav>
  );
}

export default AdminSidebar;
