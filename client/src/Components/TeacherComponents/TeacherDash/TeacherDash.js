import React, { Fragment } from 'react';
// import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import TeacherHeader from '../Header/TeacherHeader'; // Assuming you have a TeacherHeader component
// import './TeacherDash.css'; // Create a separate CSS file for styling
import TeacherSidebar from '../Sidebar/TeacherSidebar'; // Use the TeacherSidebar component

function TeacherDash() {
  return (
    <Fragment>
      <TeacherHeader />
      <div className="container-fluid">
        <div className="row">
          <TeacherSidebar /> {/* Use the TeacherSidebar component */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div
              style={{
                backgroundColor: '#C9DAED',
                minHeight: '100vh',
                color: 'black',
              }}
            >
              <div className="container mt">
                <div className="row">
                  <div className="container-fluid">
                    <div className="card-body">
                      <h2 className="mb-4">TEACHER DASHBOARD</h2>
                      {/* Add teacher-specific content here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* <Footer /> */}
    </Fragment>
  );
}

export default TeacherDash;
