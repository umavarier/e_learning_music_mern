  import React, { useEffect, useState } from "react";
  import TeacherHeader from "../Header/TeacherHeader";
  import TeacherSidebar from "../Sidebar/TeacherSidebar";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";
  import { setTeacherProfilePicture } from "../../../Redux/teacherSlice";
  import {
    selectTeacherId,
    selectTeacherProfilePicture,
  } from "../../../Redux/teacherSlice";
  import axios from "../../../utils/axios";
  import "./teacherProfile.css";
  import Cookies from "js-cookie";
  import jwt_decode from "jwt-decode";
  import "react-responsive-carousel/lib/styles/carousel.min.css";
  import { Carousel } from "react-responsive-carousel";

  const TeacherProfile = () => {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoURL, setProfilePhotoURL] = useState(null);
    const [propic, setPropic] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [instagramReel, setInstagramReel] = useState(null);
    const dispatch = useDispatch();
    const teacherId = useSelector(selectTeacherId);
    const profilePic = useSelector(selectTeacherProfilePicture);
    const [newEmail, setNewEmail] = useState("");
    const [availableTimings, setAvailableTimings] = useState([]);
    const [dayOfWeek, setDayOfWeek] = useState("Sunday");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [specializations, setSpecializations] = useState("");
    const [isTimePassed, setIsTimePassed] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [appointmentId, setAppointmentId] = useState(null);
    const [senderEmail, setSenderEmail] = useState(null);
    const [teacherVideos, setTeacherVideos] = useState([]);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    // useEffect(() => {
    //   setPropic(profilePic);
    // });

    const handleProfilePhotoChange = (e) => {
      console.log("h");
      const file = e.target.files[0];
      console.log("file--> " + JSON.stringify(file));
      // Assuming 'file' is an actual file
      setProfilePhoto(file);
      dispatch(setTeacherProfilePicture(URL.createObjectURL(file)));
      setProfilePhotoURL(URL.createObjectURL(file));
    };

    const handleProfilePhotoSubmit = async () => {
      if (profilePhoto) {
        const formData = new FormData();
        formData.append("profilePhoto", profilePhoto);
        formData.append("teacherId", teacherId);

        axios
          .post("/teachers/teacherUploadProfilePhoto", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: ` ${Cookies.get("token")}`,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              console.log("Profile photo uploaded successfully");
              toast.success("Profile photo uploaded successfully");
            }
          })
          .catch((error) => {
            console.error("Error uploading profile photo", error);
          });
      }
    };

    const handleChangePhoto = () => {
      document.getElementById("profilePhotoInput").click();
    };

    useEffect(() => {
      const accessToken = Cookies.get("token");
      console.log("fetch");
      const decodedToken = jwt_decode(accessToken);
      const teacherId = decodedToken.id;
      axios
        .get(`/teachers/fetchProfilePhoto/${teacherId}`, {
          headers: {
            Authorization: ` ${Cookies.get("token")}`,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data.profilePhotoUrl) {
            console.log("url? " + response.data.profilePhotoUrl);
            setProfilePhoto(response.data.profilePhotoUrl);
          }
        })
        .catch((error) => {
          console.error("Error fetching profile photo", error);
        });
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();

      // if (pdfFile) {
      //   const pdfFormData = new FormData();
      //   pdfFormData.append("pdfFile", pdfFile);

      //   try {
      //     const pdfResponse = await axios.post("/teacherUploadPdf", pdfFormData, {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //         Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //       },
      //     });

      //     if (pdfResponse.status === 200) {
      //       console.log("PDF uploaded successfully");
      //     }
      //   } catch (error) {
      //     console.error("Error uploading PDF", error);
      //   }
      // }

      // if (videoFile) {
      //   const videoFormData = new FormData();
      //   videoFormData.append("videoFile", videoFile);

      //   try {
      //     const videoResponse = await axios.post(
      //       "/teacherUploadVideo",
      //       videoFormData,
      //       {
      //         headers: {
      //           "Content-Type": "multipart/form-data",
      //           Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //         },
      //       }
      //     );

      //     if (videoResponse.status === 200) {
      //       console.log("Video uploaded successfully");
      //     }
      //   } catch (error) {
      //     console.error("Error uploading video", error);
      //   }
      // }

      //   if (instagramReel) {
      //     const reelFormData = new FormData();
      //     reelFormData.append("instagramReel", instagramReel);

      //     try {
      //       const reelResponse = await axios.post(
      //         "/teacherUploadReel",
      //         reelFormData,
      //         {
      //           headers: {
      //             "Content-Type": "multipart/form-data",
      //             Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //           },
      //         }
      //       );

      //       if (reelResponse.status === 200) {
      //         console.log("Instagram Reel uploaded successfully");
      //       }
      //     } catch (error) {
      //       console.error("Error uploading Instagram Reel", error);
      //     }
      //   }
    };

    const handleEmailChange = () => {
      if (newEmail) {
        axios
          .put(
            `/teachers/${teacherId}/changeEmail`,
            { newEmail },
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("accessToken")}`,
              },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              console.log("Email address updated successfully");
            }
          })
          .catch((error) => {
            console.error("Error updating email address", error);
          });
      }
    };

    const handleAddAvailability = () => {
      const newAvailability = {
        dayOfWeek,
        startTime,
        endTime,
      };
      setAvailableTimings([...availableTimings, newAvailability]);

      setDayOfWeek("Sunday");
      setStartTime("");
      setEndTime("");
    };

    const handleRemoveAvailability = (index) => {
      const updatedTimings = [...availableTimings];
      updatedTimings.splice(index, 1);
      setAvailableTimings(updatedTimings);
    };

    const handleSubmitTimings = async () => {
      try {
        const timingsData = availableTimings.map((timing) => {
          return {
            dayOfWeek: timing.dayOfWeek,
            startTime: timing.startTime,
            endTime: timing.endTime,
          };
        });
        console.log("--teacherid--" + Cookies.get("token"));
        const response = await axios.post(
          "/teachers/addAvailability",
          {
            teacherId,
            availableTimings: timingsData,
          },
          {
            headers: {
              Authorization: ` ${Cookies.get("token")}`,
            },
          }
        );
        console.log("status " + response.status);
        console.log("Available timings saved successfully.");
        if (response.status === 201) {
          toast.success("Available timing added successfully");
          console.log("Available timings saved successfully.");
          setAvailableTimings([]);
        }
        if (response.status === 400) {
          const errorMessage = response.data.message; // Check for the error message
          console.log("error " + errorMessage);
          if (
            errorMessage ===
            "Availability with the same day, start time, and end time already exists"
          ) {
            toast.error(errorMessage);
          } else {
            toast.error("Entered time already exists!!");
          }
        } else if (response.status === 500) {
          toast.error("Something went wrong!!");
        }
      } catch (error) {
        toast.error("Error saving available timings", error);
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
          .put(
            `/teachers/${teacherId}/updateSpecializations`,
            {
              specializations: specializationList,
            },
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              console.log("Specializations updated successfully");
            }
          })
          .catch((error) => {
            console.error("Error updating specializations", error);
          });
      }
    };

    useEffect(() => {
      const accessToken = Cookies.get("token");

      const decodedToken = jwt_decode(accessToken);
      const teacherId = decodedToken.id;

      console.log("teacherId: " + teacherId);
      console.log("refreshed??  " + teacherId);

      axios
        .get(`/teachers/teacherGetAppointments/${teacherId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        })
        .then((response) => {
          setAppointments(response.data);

          const currentTime = new Date();
          const currentDayOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ][currentTime.getUTCDay()];

          for (const appointment of response.data) {
            if (appointment.dayOfWeek === currentDayOfWeek) {
              const [hours, minutes] = appointment.startTime.split(":");
              const appointmentTime = new Date();
              appointmentTime.setHours(parseInt(hours, 10));
              appointmentTime.setMinutes(parseInt(minutes, 10));

              if (currentTime >= appointmentTime) {
                setIsButtonDisabled(false);
                setAppointmentId(appointment._id);
                break;
              }
            }
          }
        });

      axios
        .get(`/teachers/teacherGetNotifications/${teacherId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        })
        .then((response) => {
          // console.log("notres: " + JSON.stringify(response.data));
        });
    }, [teacherId]);

    const handleGetSenderEmail = async (notificationId) => {
      try {
        const response = await axios.get(
          `/teachers/getSenderEmail/${notificationId}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setSenderEmail(response.data.email);
        }
      } catch (error) {
        console.error("Error fetching sender's email", error);
      }
    };

    const handleJoinDemo = (appointmentId, teacherId) => {
      navigate(`/videoRoom/${teacherId}/${appointmentId}`);
    };

    const handleVideoFileChange = (e) => {
      const file = e.target.files[0];
      setVideoFile(file);
    };
    const handleVideoUpload = async () => {
      if (videoFile) {
      

        const formData = new FormData();
        formData.append("file", videoFile);
        formData.append("upload_preset", "videos_preset");

        try {
          let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUDNAME;

          setUploading(true);
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/djvh6plui/video/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                
              },
            }
          );

          if (response.data.secure_url) {
          
            // Video uploaded successfully
            const videoUrl = response.data.secure_url;
            console.log("vdourl " + videoUrl);
            setTeacherVideos([...teacherVideos, { url: videoUrl }]);

            // Save the video URL to the teacher's profile in the backend
            try {
              const accessToken = Cookies.get("token");
              const decodedToken = jwt_decode(accessToken);
              const teacherId = decodedToken.id;
              console.log("vdeo-tid "+teacherId)
              const saveVideoResponse = await axios.post(
                `/teachers/saveVideoUrl/${teacherId}`,
                { videoUrl },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: ` ${Cookies.get("token")}`
                  },
                }
              );

              if (
                saveVideoResponse.data.message === "Video URL saved successfully"
              ) {
                console.log("Video URL saved in the backend.");
              } else {
                console.error("Error saving video URL in the backend");
              }
            } catch (error) {
              console.error("Error saving video URL in the backend", error);
            }
          } else {
            // Handle errors
            console.error("Video upload failed");
          }
        } catch (error) {
          console.error("Error uploading video", error);
        } finally {
          setUploading(false);
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
              <div className="position-relative mb-3">
                <div className="position-absolute top-0 end-0">
                  <button
                    onClick={() => handleJoinDemo(appointmentId, teacherId)}
                    disabled={isButtonDisabled}
                    className={`join-button ${
                      isButtonDisabled ? "disabled" : ""
                    }`}
                  >
                    Join for Demo
                  </button>
                  {/* {!isButtonDisabled && appointmentId && ( */}
                  {!isButtonDisabled && appointmentId && (
                    <button
                      onClick={() => handleGetSenderEmail(appointmentId)}
                      // className="btn btn-primary get-email-button"
                      className={`getEmail-button ${
                        isButtonDisabled ? "disabled" : ""
                      }`}
                    >
                      Get Email
                    </button>
                  )}
                  {senderEmail && (
                    <div className="mt-2">
                      <strong>Sender's Email:</strong> {senderEmail}
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="profile-photo">
                    {profilePhoto ? (
                      <img
                        src={
                          profilePhotoURL
                            ? profilePhotoURL
                            : `http://localhost:4000/uploads/${profilePhoto}`
                        }
                        alt="Profile"
                        className="img-fluid rounded-circle"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
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
                  />
                  <button
                    className="btn btn-primary mt-2"
                    display="none "
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
                    <div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                      />
                      <button onClick={handleVideoUpload}>Upload Video</button>
                    </div>
                    {/* <div>
          <Carousel showArrows={true}>
            {teacherVideos.map((video, index) => (
              <div key={index}>
                <video width="320" height="240" controls>
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </Carousel>
        </div> */}
                  </div>
                  <form onSubmit={handleSubmit}>
                    {/* Add file upload fields for additional files if needed */}
                    {/* <button type="submit" className="btn btn-primary">
                          Submit
                        </button> */}
                  </form>
                </div>
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
                          {getDayOfWeekName(timing.dayOfWeek)} {timing.startTime}{" "}
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
