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
  const [newEmail, setNewEmail] = useState("");
  const [availableTimings, setAvailableTimings] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState("Sunday"); // Default: Sunday
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [isTimePassed, setIsTimePassed] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [appointmentId, setAppointmentId] = useState(null); // Initialize appointmentId

  useEffect(() => {
    console.log("pro pic from state", profilePic);
    setPropic(profilePic);
  });

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
    
    document.getElementById("profilePhotoInput").click();
  };

  const handleSubmit = async (e) => {
    console.log("here7 ");
    e.preventDefault();

    
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
  const handleEmailChange = () => {
    if (newEmail) {
      axios
        .put(`/teachers/${teacherId}/changeEmail`, { newEmail })
        .then((response) => {
          if (response.status === 200) {
            console.log("Email address updated successfully");
            // Update the email address in the component state if needed
            // setTeacherEmail(newEmail);
          }
        })
        .catch((error) => {
          console.error("Error updating email address", error);
        });
    }
  };

  const handleAddAvailability = () => {
    // Add the new availability to the list
    const newAvailability = {
      dayOfWeek,
      startTime,
      endTime,
    };
    setAvailableTimings([...availableTimings, newAvailability]);

    // Clear the input fields
    setDayOfWeek("Sunday"); // Reset to Sunday
    setStartTime("");
    setEndTime("");
  };

  const handleRemoveAvailability = (index) => {
    // Remove the availability at the given index
    const updatedTimings = [...availableTimings];
    updatedTimings.splice(index, 1);
    setAvailableTimings(updatedTimings);
  };

  const handleSubmitTimings = async () => {
    console.log("submit");
    try {
      const token = localStorage.getItem("token");
      const timingsData = availableTimings.map((timing) => {
        return {
          dayOfWeek: timing.dayOfWeek,
          startTime: timing.startTime,
          endTime: timing.endTime,
        };
      });
      await axios.post("/teachers/addAvailability", {
        teacherId,
        availableTimings: timingsData,
        token,
      });

      // Handle success or error
      console.log("Available timings saved successfully.");
    } catch (error) {
      console.error("Error saving available timings", error);
    }
  };
  function getDayOfWeekName(dayOfWeek) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[dayOfWeek] || "";
  }
  const handleSpecializationsChange = () => {
    if (specializations) {
      const specializationList = specializations
        .split(",")
        .map((s) => s.trim());
      axios
        .put(`/teachers/${teacherId}/updateSpecializations`, {
          specializations: specializationList,
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("Specializations updated successfully");
            // Update the specialization state if needed
            // setTeacherSpecializations(specializationList);
          }
        })
        .catch((error) => {
          console.error("Error updating specializations", error);
        });
    }
  };

  useEffect(() => {
    console.log("teacherId :::::"+teacherId)
    const token = localStorage.getItem("token");
    console.log('t-app')    
    axios
      .get(`/teachers/teacherGetAppointments/${teacherId}`, {
        headers: {
          Authorization: token,
        },
      })    .then((response) => {
        setAppointments(response.data);
        console.log("app-response " + JSON.stringify(response.data));
  
        // Check appointment times and enable the "Join for Demo" button
        const currentTime = new Date();
        const currentDayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentTime.getUTCDay()];
  
        for (const appointment of response.data) {
          if (appointment.dayOfWeek === currentDayOfWeek) {
            // Extract hours and minutes from the appointment's startTime
            const [hours, minutes] = appointment.startTime.split(':');
            const appointmentTime = new Date();
            appointmentTime.setHours(parseInt(hours, 10));
            appointmentTime.setMinutes(parseInt(minutes, 10));
  
            console.log("appointmentTime: " + appointmentTime);
            console.log("current "+currentTime)
  
            if (currentTime >= appointmentTime) {
              setIsButtonDisabled(false);              
              setAppointmentId(appointment._id); 
              break; 
            }
          }
        }
      });
      axios.get(`/teachers/teacherGetNotifications/${teacherId}`, {
        headers: {
          Authorization: token,
        },
        
      }).then((response) => {
      // Filter appointments with notifications
      console.log("notres: "+JSON.stringify(response.data))
          
        })  
  }, [teacherId]);

  const handleJoinDemo = (appointmentId) => {
    // Implement video call logic here
    // You can start the video call for the selected appointment
  };

  return (
    <>
      <TeacherHeader />
      <div className="container-fluid">
        <div className="row">
          <TeacherSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            
            <h2>Teacher Profile</h2>
            <div className="position-relative mb-3">
              <div className="position-absolute top-0 end-0">
            <button
                onClick={() => handleJoinDemo(appointmentId)}
                disabled={isButtonDisabled}
                className={`join-button ${isButtonDisabled ? "disabled" : ""}`}
              >
                Join for Demo
              </button>
            </div>
            </div>
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

            <div className="form-group">
              <label>New Email:</label>
              <input
                type="email"
                className="form-control"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Specializations (comma-separated):</label>
              <input
                type="text"
                className="form-control"
                value={specializations}
                onChange={(e) => setSpecializations(e.target.value)}
              />
            </div>

            <div className="availability-form">
              <h3>Add Available Timings</h3>
              <form>
                <div className="form-group">
                  <label>Day of the Week:</label>
                  <select
                    className="form-control"
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                  >
                    {/* Options for day of the week */}
                    {/* <option value={0}>Sunday</option>
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                    <option value={6}>Saturday</option>
                  </select> */}

                    <option value="">Select a Day</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Time:</label>
                  <input
                    type="time"
                    className="form-control"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>End Time:</label>
                  <input
                    type="time"
                    className="form-control"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddAvailability}
                >
                  Add Timing
                </button>
              </form>
              {availableTimings.length > 0 && (
                <div className="available-timings">
                  <h3>Available Timings:</h3>
                  <ul>
                    {availableTimings.map((timing, index) => (
                      <li key={index}>
                        {getDayOfWeekName(timing.dayOfWeek)}: {timing.startTime}{" "}
                        - {timing.endTime}
                        <button
                          onClick={() => handleRemoveAvailability(index)}
                          className="btn btn-link text-danger"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitTimings}
              >
                Save Available Timings
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default TeacherProfile;
