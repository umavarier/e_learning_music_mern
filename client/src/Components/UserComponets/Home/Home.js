import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Dropdown } from "react-bootstrap";
import Carousel from "react-material-ui-carousel";
import axios from "../../../utils/axios";
import banner2 from "./banner2.avif";
import img from "./banner1.png";
import Header from "./Header";
import Pricing from "../../CourseComponent/Pricing"
// import Notifications from "../Notification/Notifications";

function Home() {
  const userId = useSelector((state) => state.user);
  const notifications = useSelector(
    (state) => state.notifications?.notifications
  );
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [appointmentId, setAppointmentId] = useState(null);
  const [buttonLabel, setButtonLabel] = useState("Join for Demo");
  const [teacherMeetingLink, setTeacherMeetingLink] = useState("");
  const [teacherId, setTeacherId]= useState(null)
  const [pricingData, setPricingData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pricing data from the backend API
    axios
      .get("/getPricing")
      .then((response) => {
        setPricingData(response.data[0]?.classPricing || []);
        console.log("pricingdata " + JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching pricing data:", error);
      });
  }, []);
  const handleGetStartedClick = () => {
    navigate(`/payment/${pricingData}`);
  };

  console.log("notify: " + notifications);
  console.log(userId.userId + "     userId    ");
  useEffect(() => {
    axios
      .get(`/userGetAppointmentTime/${userId.userId}/`)
      .then((response) => {
        setUserAppointments(response.data);
        setAppointmentId(response.data.appointmentId);
        setTeacherId(response.data.teacherId)
      })
      .catch((error) => {
        console.error("Error fetching user's appointments:", error);
      });
    axios
      .get("/viewCourses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/viewTeachers")
      .then((response) => {
        setTeachers(response.data);
        setProfilePhoto(response.data[0].profilePhoto);
        console.log("pic is there? " + response.data[0].profilePhoto);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  }, []);

  const isAppointmentTimePassed = (appointment) => {
    const currentTime = new Date();
    const [startHours, startMinutes] = appointment.startTime.split(":");
    const [endHours, endMinutes] = appointment.endTime.split(":");
    const appointmentStartTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      parseInt(startHours, 10),
      parseInt(startMinutes, 10)
    );
    const appointmentEndTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      parseInt(endHours, 10),
      parseInt(endMinutes, 10)
    );

    console.log("startTime: " + appointmentStartTime);
    console.log("endTime: " + appointmentEndTime);
    console.log("currentTime: " + currentTime);

    return (
      currentTime >= appointmentStartTime && currentTime <= appointmentEndTime
    );
  };
  const isButtonEnabled =
    userAppointments.length > 0 && isAppointmentTimePassed(userAppointments[0]);
  const handleJoinDemo = () => {
    if (isButtonEnabled) {
      // console.log("videoApp "+appointmentId)
      navigate(`/videoRoom/${teacherId}/${appointmentId}`);
    }
  };
  const handlebookDemo = () => {
    navigate("/selectTeacherCourse");
  };

  return (
    <div>
      {/* <Header userToken={userId.userToken} /> */}
      {/* Banner */}
      {/* <Notifications notifications={notifications} /> */}
      <div className="home-banner-container">
        <div className="left-side">
          <img
            src={banner2} // Replace with the URL of your left-side image
            alt="Banner Image"
            className="home-banner-image"
          />
        </div>
        <div className="right-side">
          <div className="content">
            <h1>Live 1 to 1 Online Music Classes</h1>
            <p>Taught by professional tutors for all ages</p>
            <p>Instructions in English & all major Indian languages</p>
            <div className="statistics">
              <p>
                <span>75+</span> Professional<br></br> Tutors
              </p>
              <p>
                <span>100+</span> Cities <br></br> Worldwide
              </p>
            </div>
            <Link to="/select-course-teacher">
            {userAppointments.length === 0 && (
              <button className="book-button" onClick={handlebookDemo}>
                Book a Free Demo
              </button>
            )} 
            </Link>

            {userAppointments.length > 0 && (
              <button className="join-demo-button" onClick={handleJoinDemo}>
                {isButtonEnabled ? "Join for Demo" : "Book a Free Demo"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="home-course-container mt-6">
        <h1 className="text-dark">Our Courses</h1>
        <Carousel>
          <div className="row">
            {courses.map((course) => (
              <div className="card mb-8 rounded-card" key={course._id}>
                <Link
                  to={`courses/${course._id}?userId=${userId.userId}`}
                  className="course-link"
                >
                  <div className="card-img-circle">
                    <i className={`fas ${course.icon} fa-5x text-primary`}></i>
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title">{course?.name}</h5>
                    <p className="card-text">{course.description}</p>
                    {/* <p className="card-text">Instructor: {course.instructor?.userName}</p> */}
                    {/* Add more course details as needed */}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </Carousel>
      </div>

      {/* </div>
      </div> */}

      {/* Teachers */}
      <div className="teacher-container mt-6">
        <h1 className="text-dark">Our Teachers</h1>
        <Carousel>
          <div className="row">
            {teachers.map((teacher) => (
              <div className="col-md-2" key={teacher.id}>
                {/* Display teacher information here */}
                <div className="teacher-card mb-4">
                  <div className="card-img-square">
                    <img
                      src={`http://localhost:4000/uploads/${teacher.profilePhoto}`}
                      className="card-img-top"
                      alt="Teacher's profile"
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{teacher?.userName}</h5>
                    {/* Add more teacher details as needed */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Carousel>
      </div>

      {/* pricing section */}
            
      <div className="subscription-section">
      <h1 className="text-dark">Our Pricing</h1>
      <div className="pricing-cards">
          {pricingData.map((pricingPlan, index) => (
            <div className="pricing-card" key={index}>
              <div className="pricing-card-header">
                {/* <div className="pricing-card-number">{pricingPlan.planNumber}</div> */}
                <h3 className="pricing-plan-name">{pricingPlan.planName}</h3>
              </div>
              <div className="pricing-card-content">
                <p>{pricingPlan.numberOfClasses} Classes</p>
                <p className="pricing-price">₹ {pricingPlan.price}</p>
                <p>Beginner Lessons</p>
                <p>8 Online Classes</p>
                <p>45 min / Class</p>
                <p>Regional / English Instructions</p>
              </div>
              <button
                className="get-started-button"
                onClick={() => handleGetStartedClick(pricingPlan)}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>  

      {/* Banner Image */}
    
      <div className="container mt-5">
        <div className="banner-home-end">
        <div className="row">
          <div className="col-md-12">
            <div className="banner1">
              <img
                src={img}
                className="banner"
                alt="..."
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Home;
