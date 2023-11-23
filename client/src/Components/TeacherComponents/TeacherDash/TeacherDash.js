import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import TeacherHeader from "../Header/TeacherHeader";
import TeacherSidebar from "../Sidebar/TeacherSidebar";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import TeacherProfilePictureUpload from "../Header/TeacherProfilePictureUpload";
import axios from "../../../Utils/axios";
import { selectTeacherProfilePicture } from '../../../Redux/teacherSlice';

function TeacherDash() {
  const navigate = useNavigate();
  const [hasProfilePicture, setHasProfilePicture] = useState(false);
  const profilePicture = useSelector(selectTeacherProfilePicture);
  const [showProfileUploadModal, setShowProfileUploadModal] = useState(false);


  const accessToken = Cookies.get("token")
  const decodedToken = jwt_decode(accessToken);
  const teacherId = decodedToken._id;

  useEffect(() => {
    const checkProfilePicture = async () => {
      try {
        const accessToken = Cookies.get("token")
        const decodedToken = jwt_decode(accessToken);
        const teacherId = decodedToken._id;
        const response = await axios.get("/teachers/checkTeacherProfilePicture", {
          headers: {
            Authorization: ` ${accessToken}`,
          },
        });
        setHasProfilePicture(response.data.hasProfilePicture);
      } catch (error) {
        console.error("Error checking profile picture:", error);
      }
    };

    checkProfilePicture();
  }, []);

  return (
    <Fragment>
      <TeacherHeader />
      <div className="container-fluid">
        <div className="row">
          <TeacherSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div
              style={{
                minHeight: '100vh',
                color: 'black',
              }}
            >
              <div className="container mt">
                <div className="row">
                  <div className="container-fluid">
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {/* {profilePicture ? ( // Check if the profile picture is available
                          <img
                            src={profilePicture} // Display the profile picture URL
                            alt="Profile Picture"
                            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                          />
                        ) : (
                          // If profile picture is not available, show the modal
                          showProfileUploadModal && <TeacherProfilePictureUpload />
                        )} */}
                      </div>
                      <h2 className="mb-4">TEACHER DASHBOARD</h2>
                      
                    </div>
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

export default TeacherDash;
