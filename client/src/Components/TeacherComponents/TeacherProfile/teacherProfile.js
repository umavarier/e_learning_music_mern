import React, { useEffect, useState } from "react";
import TeacherHeader from "../Header/TeacherHeader";
import TeacherSidebar from "../Sidebar/TeacherSidebar";
import { useDispatch, useSelector } from "react-redux";
import { setTeacherProfilePicture } from "../../../Redux/teacherSlice";
import {
  selectTeacherId,
  selectTeacherProfilePicture,
} from "../../../Redux/teacherSlice";
import axios from "../../../utils/axios";

const TeacherProfile = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [propic, setPropic] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [instagramReel, setInstagramReel] = useState(null);
  const dispatch = useDispatch();
  const teacherId = useSelector(selectTeacherId);
  const profilePic = useSelector(selectTeacherProfilePicture);

  useEffect(()=>{
    console.log("pro pic from state" ,profilePic)
    setPropic(profilePic);
  })


  console.log(propic);
  const handleProfilePhotoChange = (e) => {
    console.log("here1 ");
    const file = e.target.files[0];
    setProfilePhoto(file);
    dispatch(setTeacherProfilePicture(URL.createObjectURL(file)));
  };

  const handlePdfFileChange = (e) => {
    console.log("here2 ");
    const file = e.target.files[0];
    setPdfFile(file);
  };

  const handleVideoFileChange = (e) => {
    console.log("here3 ");
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleInstagramReelChange = (e) => {
    console.log("here4 ");
    const file = e.target.files[0];
    setInstagramReel(file);
  };

  const handleProfilePhotoSubmit = async () => {
    // console.log("teacherId "+teacherId)
    if (profilePhoto) {
      console.log("here5 ");
      const formData = new FormData();
      console.log("formdata " + formData);
      formData.append("profilePhoto", profilePhoto);
      formData.append("teacherId", teacherId);

      // Make an API request to upload the profile photo
      axios
        .post("/teachers/teacherUploadProfilePhoto", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("axios with formdata", response.data);
          if (response.status === 200) {
            // Profile photo uploaded successfully, you can display a success message
            console.log("Profile photo uploaded successfully");
          }
        })
        .catch((error) => {
          console.error("Error uploading profile photo", error);
        });
    }
  };

  const handleChangePhoto = () => {
    console.log("here6 ");
    // Trigger the file input element to select a new profile photo.
    document.getElementById("profilePhotoInput").click();
  };

  const handleSubmit = async (e) => {
    console.log("here7 ");
    e.preventDefault();

    // Handle PDF upload
    if (pdfFile) {
      const pdfFormData = new FormData();
      pdfFormData.append("pdfFile", pdfFile);

      try {
        const pdfResponse = await axios.post("/teacherUploadPdf", pdfFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (pdfResponse.status === 200) {
          console.log("PDF uploaded successfully");
        }
      } catch (error) {
        console.error("Error uploading PDF", error);
      }
    }

    // Handle video file upload
    if (videoFile) {
      const videoFormData = new FormData();
      videoFormData.append("videoFile", videoFile);

      try {
        const videoResponse = await axios.post(
          "/teacherUploadVideo",
          videoFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (videoResponse.status === 200) {
          console.log("Video uploaded successfully");
        }
      } catch (error) {
        console.error("Error uploading video", error);
      }
    }

    // Handle Instagram Reel upload
    if (instagramReel) {
      const reelFormData = new FormData();
      reelFormData.append("instagramReel", instagramReel);

      try {
        const reelResponse = await axios.post(
          "/teacherUploadReel",
          reelFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (reelResponse.status === 200) {
          console.log("Instagram Reel uploaded successfully");
        }
      } catch (error) {
        console.error("Error uploading Instagram Reel", error);
      }
    }
  };

  return (
    <>
      <TeacherHeader />
      <div className="container-fluid">
        <div className="row">
          <TeacherSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <h2>Teacher Profile</h2>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="profile-photo">
                  {profilePhoto ? (
                    <img
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Profile"
                      className="img-fluid rounded-circle" // Add the 'rounded-circle' class for a circular profile photo
                      style={{ maxWidth: "200px", maxHeight: "200px" }} // Adjust the dimensions here
                    />
                  ) : (
                    <div className="placeholder">No Photo</div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="profilePhotoInput"
                  onChange={handleProfilePhotoChange}
                  style={{ display: "none" }}
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleChangePhoto}
                >
                  Change Photo
                </button>
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleProfilePhotoSubmit}
                >
                  Upload Profile Photo
                </button>
              </div>
              <div className="col-md-8">
                <div className="btn-group mb-3" role="group">
                  <label
                    htmlFor="pdfFile"
                    className="btn btn-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Upload PDF
                    <input
                      type="file"
                      accept=".pdf"
                      id="pdfFile"
                      onChange={handlePdfFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                  <label
                    htmlFor="videoFile"
                    className="btn btn-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Upload Video
                    <input
                      type="file"
                      accept="video/*"
                      id="videoFile"
                      onChange={handleVideoFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                  <label
                    htmlFor="instagramReel"
                    className="btn btn-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Upload Instagram Reel
                    <input
                      type="file"
                      accept="video/*"
                      id="instagramReel"
                      onChange={handleInstagramReelChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <form onSubmit={handleSubmit}>
                  {/* Add file upload fields for additional files if needed */}
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default TeacherProfile;
