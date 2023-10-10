import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import "./CourseDetails.css";
import TimeSelectionModal from "../UserComponets/TimeSelection/timeSelectionModal";
import img from "./guitar.jpeg";

function CourseDetails() {
  const { courseId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");
  const [course, setCourse] = useState({ instructorId: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [scheduledAppointmentTime, setScheduledAppointmentTime] = useState("");
  const [isVideoButtonEnabled, setIsVideoButtonEnabled] = useState(false);
  const dispatch = useDispatch();
  const [teacherId, setTeacherId] = useState(null);
  const [value, setValue] = useState();
  const [roomValue, setRoomValue] = useState();
  const navigate = useNavigate();

  const handleOpenModal = () => {
    console.log("Opening modal");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTimeSelected = (time) => {
    setSelectedTime(time);
    console.log("timetime " + time);
  };

  const isScheduledTime = () => {
    console.log("isScheduled???");
    console.log("selectedtime " + selectedTime);
    if (!selectedTime) {
      return false;
    }
    const appointmentTime = new Date(selectedTime);
    const currentTime = new Date();
    return currentTime >= appointmentTime;
  };

  const fetchAppointmentDetails = async () => {
    try {
      const response = await axios.get("/getAppointmentDetails", {
        params: {
          studentId: userId,
          teacherId: teacherId,
          courseId: courseId,
        },
      });

      const appointmentTime = response.data.appointmentTime;
      console.log("apptime   " + appointmentTime);
      setScheduledAppointmentTime(appointmentTime);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      console.error("User ID not provided.");
      return;
    }

    axios
      .get(`/user/${userId}`)
      .then((response) => {
        const userData = response.data;
        setUser(userData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

  console.log("userid: " + userId);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:4000/courses/:${courseId}`)
  //     .then((response) => {
  //       const courseData = response.data;
  //       console.log("treacherdataincluded?? "+response.course)
  //       setCourse(response.data);
  //       setTeacherId(courseData.instructorId);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching course details:", error);
  //     });
  // }, [courseId]);
  useEffect(() => {
    axios
      .get(`/courses/getCourseById/${courseId}`)
      .then((response) => {
        const courseData = response.data;
        console.log("treacherdataincluded?? " + courseData.instructorId);
        setCourse(courseData); // Set the course data in your state
        setTeacherId(courseData.instructorId); // Extract and set teacherId
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
      });
  }, [courseId]);

  useEffect(() => {
    console.log('Selected Time:', selectedTime);
    
    if (isScheduledTime()) {
      console.log('Video button should be enabled.');
      setIsVideoButtonEnabled(true);
    } else {
      console.log('Video button should be disabled.');
      setIsVideoButtonEnabled(false);
    }
  }, [selectedTime]);
  useEffect(() => {
    console.log("fetchAppointmentDetails");
    fetchAppointmentDetails();
  }, [userId, teacherId, courseId, selectedTime]);

  const handleScheduleDemo = () => {
    console.log("handleScheduleDemo called"); // Add this line
    console.log("Selected Time:", selectedTime);
    console.log("Course ID:", courseId);
    console.log("User:", user);
    console.log("TeacherID : " + teacherId);
    // if (!selectedTime || !course || !user) {
    //   console.error("Selected time, course, or user data is missing.");
    //   return;
    // }

    // const instructorId = course.instructorId;
    // console.log("instructorId++"+instructorId)
    const studentId = userId;
    console.log("studentid: " + studentId);

    axios
      .post("/schedule-demo", {
        studentId,
        teacherId,
        courseId,
        appointmentTime: selectedTime,
      })
      .then((response) => {
        console.log("response+-+-" + response);
        if (response.status === 201) {
          alert("Demo scheduled successfully");
          setIsModalOpen(false);
        } else {
          console.error("Unexpected response status:", response.status);
          alert("An error occurred while scheduling the demo");
        }
      })
      .catch((error) => {
        console.error("Error scheduling demo:", error);
        alert("An error occurred while scheduling the demo");
      });
  };
  const handleStartVideoDemo = () => {
    if (isScheduledTime()) {
      // Call the function to start the video demo
      console.log("Starting the video demo...");
      navigate(`/videoRoom/${value}`);
    } else {
      alert("Video demo can only be started at the scheduled time.");
    }
  };

  return (
    <div className="course-details-banner">
      <div className="course-details-image">
        <img src={img} alt="Course Image" />
      </div>
      <div className="course-details-content">
        <h1>Live 1 to 1 Online {course?.name} Classes</h1>
        <p>
          Looking for the best online {course?.name} classes near you? Learn to
          {` ${course?.name}`} for all age groups from the comfort of your home
          with the best qualified {`${course?.name}`} teachers.
        </p>
        {selectedTime ? (
          <p>
            You have selected the following time for your free demo:{" "}
            {selectedTime}
          </p>
        ) : (
          <div className="book-button-container" onClick={handleOpenModal}>
            <button className="book-button">Book a Free Demo</button>
          </div>
        )}
        {isVideoButtonEnabled && (
          <>
            <input
              type="text text-dark"
              placeholder="Enter Room id"
              onChange={(e) => setValue(e.target.value)}
              name=""
              id=""
            />

            {scheduledAppointmentTime && (
              <button
                className="start-demo-button"
                onClick={handleStartVideoDemo}
                disabled={!isScheduledTime()} // Disable the button if it's not the scheduled time
              >
                Start Video Demo
              </button>
            )}
          </>
        )}
      </div>
      <TimeSelectionModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onTimeSelected={handleTimeSelected}
        handleScheduleDemo={handleScheduleDemo}
      />
    </div>
  );
}

export default CourseDetails;
