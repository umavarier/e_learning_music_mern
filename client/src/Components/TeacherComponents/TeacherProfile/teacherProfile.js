import React, { useEffect, useState, useRef } from "react";
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
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Carousel } from "react-responsive-carousel";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import ChatComponent from "../../UserComponets/ChatComponent.js";

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
  const [isAvailabilityFormOpen, setAvailabilityFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [showChat, setShowChat] = useState(false);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const videoInputRef = useRef(null);

  const handleOpenAvailabilityForm = () => {
    setAvailabilityFormOpen(true);
  };

  const handleCloseAvailabilityForm = () => {
    setAvailabilityFormOpen(false);
  };

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
      date,
      startTime,
      endTime,
    };
    setAvailableTimings([...availableTimings, newAvailability]);

    setDate("");
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
          date: timing.date.toISOString().slice(0, 10),
          startTime: timing.startTime,
          endTime: timing.endTime,
        };
      });
      console.log("time--" + JSON.stringify(timingsData));
      // console.log("--teacherid--" + Cookies.get("token"));
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
        const errorMessage = response.data.message;
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

  // function getDayOfWeekName(dayOfWeek) {
  //   const daysOfWeek = [
  //     "Sunday",
  //     "Monday",
  //     "Tuesday",
  //     "Wednesday",
  //     "Thursday",
  //     "Friday",
  //     "Saturday",
  //   ];
  //   return daysOfWeek[dayOfWeek] || "";
  // }
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
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
              Authorization: `${Cookies.get("token")}`,
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
    console.log("select vdeo");
    const files = e.target.files;

    if (files) {
      const file = files[0];
      setVideoFile(file);
    } else {
      toast.warning("Please select a video!");
    }
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
          toast.success("Video uploaded successfully");
          const videoUrl = response.data.secure_url;
          console.log("vdourl " + videoUrl);
          setTeacherVideos([...teacherVideos, { url: videoUrl }]);

          // Save the video URL to the teacher's profile in the backend
          try {
            const accessToken = Cookies.get("token");
            const decodedToken = jwt_decode(accessToken);
            const teacherId = decodedToken.id;
            console.log("vdeo-tid " + teacherId);
            const saveVideoResponse = await axios.post(
              `/teachers/saveVideoUrl/${teacherId}`,
              { videoUrl },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: ` ${Cookies.get("token")}`,
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
  useEffect(() => {
    const fetchTeacherVideos = async () => {
      const accessToken = Cookies.get("token");
      const decodedToken = jwt_decode(accessToken);
      const teacherId = decodedToken.id;
      try {
        const response = await axios.get(
          `/teachers/getTeacherVideos/${teacherId}`,
          {
            headers: {
              Authorization: ` ${Cookies.get("token")}`,
            },
          }
        );

        if (response.status === 200) {
          // Update the state with the fetched video URLs
          setTeacherVideos(response.data.teacherVideos);
        }
      } catch (error) {
        console.error("Error fetching teacher videos", error);
      }
    };

    fetchTeacherVideos();
  }, [teacherId]);

  useEffect(() => {
    // Fetch the list of users who have enrolled in the teacher's courses
    const fetchEnrolledUsers = async () => {
      const accessToken = Cookies.get("token");
      console.log("tttt  " + teacherId);
      try {
        const response = await axios.get(
          `/teachers/getEnrolledUsersForChat/${teacherId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          setEnrolledUsers(response.data);
          // console.log("en-res  " + JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Error fetching enrolled users", error);
      }
    };

    fetchEnrolledUsers();
  }, [teacherId]);

  const handleStartChat = (userId) => {
    setSelectedUserId(userId);
    setShowChat(true);
  };

  const handleBackToEnrolledUsers = () => {
    setSelectedUserId(null);
    setShowChat(false);
  };
  // console.log("chat  " + showChat);
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
                {/* <button
                  onClick={() => handleJoinDemo(appointmentId, teacherId)}
                  disabled={isButtonDisabled}
                  className={`join-button ${
                    isButtonDisabled ? "disabled" : ""
                  }`}
                >
                  Join for Demo
                </button> */}
                {/* {!isButtonDisabled && appointmentId && ( */}
                {/* {!isButtonDisabled && appointmentId && (
                  <button
                    onClick={() => handleGetSenderEmail(appointmentId)}
                    // className="btn btn-primary get-email-button"
                    className={`getEmail-button ${
                      isButtonDisabled ? "disabled" : ""
                    }`}
                  >
                    Get Email
                  </button>
                )} */}
                {/* {senderEmail && (
                  <div className="mt-2">
                    <strong>Sender's Email:</strong> {senderEmail}
                  </div>
                )} */}
              </div>
            </div>

            <div className="row">
              <div className="col-md-3">
                <div className="card rounded-square profile-card">
                  <div className="card-body ">
                    <div className="profile-photo d-flex justify-content-center align-items-center">
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
                      display="none"
                    />
                    <button
                      className="btn btn-primary mt-2"
                      // style={{ display: "none" }}
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
                </div>
              </div>

              <div className="col-md-8">
                <div className="card-body card rounded-square col-md-4">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenAvailabilityForm}
                  >
                    Add Available Timings
                  </Button>
                  <Modal
                    open={isAvailabilityFormOpen}
                    onClose={handleCloseAvailabilityForm}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        width: 400,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                      }}
                    >
                      <h3>Add Available Timings</h3>
                      <form>
                        <FormControl fullWidth>
                          <InputLabel>Choose a Date</InputLabel>
                          <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            minDate={new Date()} // Restrict dates to be in the future only
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          <TextField
                            label="Start Time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          <TextField
                            label="End Time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </FormControl>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddAvailability}
                        >
                          Add Timing
                        </Button>
                      </form>
                    </Box>
                  </Modal>
                  <div className="available-timings">
                    <h3>Available Timings:</h3>
                    <List>
                      {availableTimings.map((timing, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${timing.date.toDateString()} ${
                              timing.startTime
                            } - ${timing.endTime}`}
                          />
                          <Button
                            onClick={() => handleRemoveAvailability(index)}
                            variant="contained"
                            color="secondary"
                          >
                            Remove
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitTimings}
                  >
                    Save Available Timings
                  </Button>
                </div>
              </div>
              {/* <button onClick={() => setShowChat(!showChat)}>
                {showChat ? "Hide Chat" : "Show Chat"}
              </button> */}

              {/* {showChat ? (
                selectedUserId ? (
                  <div>
                    <ChatComponent userId={selectedUserId} userType="teacher" />
                    <button onClick={handleBackToEnrolledUsers}>
                      Back to Enrolled Users
                    </button>
                  </div>
                ) : (
                  <div className="container-video">
                    <div className="row">
                      <div>
                        <h3>Enrolled Users:</h3>
                        <ul>
                          {enrolledUsers.map((user) => (
                            <li key={user._id}>
                              {user.userName}{" "}
                              <button onClick={() => handleStartChat(user._id)}>
                                Start Chat
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              ) : null} */}

              <div className="container-video">
                <div className="row">
                  <h2 className="text-center text-dark">Your Videos</h2>
                  {/* <div className="col-md-2"></div> */}
                  <div className="card-body card rounded-sqaure col-md-6">
                    <div className="col-md-8">
                      <div className="btn-group mb-3" role="group">
                        <div className="d-flex">
                          <input
                            type="file"
                            accept="video/*" // Specify the accepted file types
                            onChange={handleVideoFileChange}
                            style={{ display: "none" }}
                            ref={videoInputRef}
                          />
                          <button
                            onClick={() => videoInputRef.current.click()}
                            className="btn btn-primary"
                            style={{ marginRight: "10px" }}
                          >
                            <i className="fas fa-plus"></i> Add Video
                          </button>

                          <button onClick={handleVideoUpload} className="btn">
                            Upload Video
                          </button>
                        </div>
                      </div>
                      <form onSubmit={handleSubmit}></form>
                    </div>

                    <div>
                      <Carousel showArrows={true}>
                        {teacherVideos.map((video, index) => (
                          <div key={index}>
                            <div className="d-flex justify-content-between">
                              {teacherVideos
                                .slice(index, index + 3)
                                .map((video, videoIndex) => (
                                  <div key={videoIndex} className="mr-2">
                                    <video width="320" height="240" controls>
                                      <source
                                        src={video.url}
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div>
                  <h4>Enrolled Users</h4>
                  <ul>
                    {enrolledUsers.map((user) => (
                      <li key={user._id}>
                        {user.userName}{" "}
                        <button onClick={() => handleStartChat(user._id)}>
                          Start Chat
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-md-6">
                {showChat && selectedUserId && (
                  <ChatComponent
                    userId={teacherId}
                    userType="teacher"
                    recipientId={selectedUserId}
                    recipientType="user" // or whatever type is appropriate
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default TeacherProfile;
