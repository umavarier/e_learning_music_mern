import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import "./CourseDetails.css";
import TimeSelectionModal from "../UserComponets/TimeSelection/timeSelectionModal";
import img from "./guitar.jpeg";
import Header from "../UserComponets/Home/Header";
import moment from "moment";
import { Link } from "react-router-dom";
import Pricing from "./Pricing";

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

  const [availableTimes, setAvailableTimes] = useState([]);
  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isTimePickerDisabled, setIsTimePickerDisabled] = useState(true);
  const [instructors, setInstructors] = useState(null)

  const currentDate = moment();
  useEffect(() => {
    if (selectedDate) {
      const selectedDateTime = moment(selectedDate).add(
        moment(selectedTime).format("HH:mm:ss")
      );
      setIsTimePickerDisabled(selectedDateTime.isBefore(currentDate));
    }
  }, [selectedDate, selectedTime, currentDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsTimePickerDisabled(true); // Disable the time picker when the date changes
  };

  const fetchAvailableTimes = async () => {
    try {
      // const response = await axios.get("/getAvailableTimes", {
      //   params: {
      //     teacherId: teacherId,
      //   },
      // });
      // setAvailableTimes(response.data);
    } catch (error) {
      console.error("Error fetching available times:", error);
    }
  };

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
    setIsModalOpen(false);
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
      console.log("fetch");
      const appointmentTime = response.data.appointmentTime;
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      const localTime = new Date(appointmentTime).toLocaleString(
        "en-US",
        options
      );

      console.log("apptime   " + appointmentTime);

      // const appointmentTimeIST = moment.tz(appointmentTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ', 'Asia/Kolkata');
      setScheduledAppointmentTime(localTime);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
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
        setCourse(courseData);
        setTeacherId(courseData.instructorId);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
      });
  }, [courseId]);

  useEffect(() => {
    console.log("Selected Time:", selectedTime);

    if (isScheduledTime()) {
      console.log("Video button should be enabled.");
      setIsVideoButtonEnabled(true);
    } else {
      console.log("Video button should be disabled.");
      setIsVideoButtonEnabled(false);
    }
  }, [selectedTime]);
  useEffect(() => {
    console.log("fetchAppointmentDetails");
    fetchAppointmentDetails();
  }, [userId, teacherId, courseId, selectedTime]);


  const fetchInstructors = async (courseId) => {
    try {
      const response = await axios.get(`/instructors/byCourse/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching instructor details:", error);
      return [];
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchInstructors(courseId)
        .then((instructors) => {
          // Set the instructor information in your component state.
          setInstructors(instructors);
        })
        .catch((error) => {
          console.error("Error fetching instructors:", error);
        });
    }
  }, [courseId]);


  const handleScheduleDemo = () => {
    // console.log("handleScheduleDemo called"); // Add this line
    // console.log("Selected Time:", selectedTime);
    // console.log("Course ID:", courseId);
    // console.log({user});
    // console.log("TeacherID : " + teacherId);

    if (!user) {
      console.error("user not logged in.");
      alert("please login first!!!");
      navigate("/loginwithotp");
      return;
    }

    const instructorId = course.instructorId;
    // console.log("instructorId++"+instructorId)
    const studentId = userId;
    // console.log("studentid: " + studentId);

   
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
      // navigate(`/videoRoom/${value}`);
    } else {
      alert("Video demo can only be started at the scheduled time.");
    }
  };

  return (
    <>
      <Header />
      <div className="course-details-banner">
        <div className="course-details-image">
          <img src={img} alt="Course Image" />
        </div>
        <div className="course-details-content">
          <h1>Live 1 to 1 Online {course?.name} Classes</h1>
          <p>
            Looking for the best online {course?.name} classes near you? Learn
            to
            {` ${course?.name}`} for all age groups from the comfort of your
            home with the best qualified {`${course?.name}`} teachers.
          </p>
          {selectedTime ? (
            <p>
              You have selected the following time for your free demo:{" "}
              {selectedTime}
            </p>
          ) : (
            <div className="book-button-container" onClick={handleOpenModal}>
              {/* <button className="book-button">Book a Free Demo</button> */}
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

              {/* {scheduledAppointmentTime && (
              <button
                className="start-demo-button"
                onClick={handleStartVideoDemo}
                disabled={!isScheduledTime()} // Disable the button if it's not the scheduled time
              >
                Start Video Demo
              </button>
            )} */}
            </>
          )}
        </div>

        <div className="instructors-list">
          <h2>Instructors for {course?.name}:</h2>
          <ul>
            {instructors.map((instructor) => (
              <li key={instructor._id}>{instructor.userName}</li>
            ))}
          </ul>
        </div>

        {isModalOpen && (
          <TimeSelectionModal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            onTimeSelected={handleTimeSelected}
            handleScheduleDemo={handleScheduleDemo}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            isTimePickerDisabled={isTimePickerDisabled}
          />
        )}
      </div>
      <div>{/* <Pricing /> */}</div>
    </>
  );
}

export default CourseDetails;
