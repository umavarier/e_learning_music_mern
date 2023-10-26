import React, { Fragment } from 'react';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import AdminHeader from '../Header/AdminHeader';
import './AdminDash.css';
import AdminSidebar from '../Header/AdminSidebar';
// import img from './dash1.png';

function AdminDash() {
  return (
    <Fragment>
      <AdminHeader />
      <div className="container-fluid">
        <div className="row">
          <AdminSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div
              style={{
                 // Set the background color to white
                minHeight: '100vh',
                color: 'black', // Set text color to black
              }}
            >
              <div className="container mt">
                <div className="row">
                  <div className="container-fluid " >
                    {/* <div className="card border-1 rounded shadow-sm text-center"> */}
                      <div className="card-body">
                        <h2 className="mb-4">DASHBOARD</h2>
                        
                      </div>
                    {/* </div> */}
                    {/* <img
                          src={img} 
                          alt="Admin Dashboard Image"
                          width={'100%'}
                        /> */}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Fragment>
  );
}

export default AdminDash;
