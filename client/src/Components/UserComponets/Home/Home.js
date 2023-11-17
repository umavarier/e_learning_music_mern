import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Dropdown } from "react-bootstrap";
import Carousel from "react-material-ui-carousel";
import axios from "../../../utils/axios";
import banner2 from "./banner2.avif";
import img from "./Banner23.jpg";
import Header from "./Header";
import Pricing from "../../CourseComponent/Pricing";
import jwt_decode from "jwt-decode";
// import Notifications from "../Notification/Notifications";

function Home() {
  // const userId = useSelector((state) => state.user);

  const notifications = useSelector(
    (state) => state.notifications?.notifications
  );
  const [userId, setUserId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [appointmentId, setAppointmentId] = useState(null);
  const [buttonLabel, setButtonLabel] = useState("Join for Demo");
  const [teacherMeetingLink, setTeacherMeetingLink] = useState("");
  const [teacherId, setTeacherId] = useState(null);
  const [pricingData, setPricingData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userdbtoken");
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken) {
        setUserId(decodedToken._id);
        console.log("dcdtkn--" + decodedToken._id);
      }
    }
  }, []);
  useEffect(() => {
    axios
      .get("/getPricing")
      .then((response) => {
        setPricingData(response.data[0]?.classPricing || []);
        // console.log("pricingdata " + JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching pricing data:", error);
      });
  }, []);
  const handleGetStartedClick = (pricingPlan) => {
    navigate(`/payment`, { state: { pricingPlan } });
  };

  // console.log("notify: " + notifications);
  console.log(userId + "     userId    ");
  useEffect(() => {
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
    console.log("fetchid " + userId);
    if (userId) {
      axios
        .get(`/userGetAppointmentTime/${userId}`)
        .then((response) => {
          setUserAppointments(response.data);
          setAppointmentId(response.data.appointmentId);
          setTeacherId(response.data.teacherId);
        })
        .catch((error) => {
          console.error("Error fetching user's appointments:", error);
        });
    }
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
        <h1 className="text-dark text-center">Our Courses</h1>
        <Carousel>
          <div className="row">
            {courses.map((course) => (
              <div
                className=" rounded-card-c mb-8"
                style={{ margin: "30px" }}
                key={course._id}
              >
                <Link
                  to={`courses/${course._id}?userId=${userId}`}
                  className="course-link"
                >
                  <div className="card-img-circle">
                    <i className={`fas ${course.icon} fa-5x text-primary`}></i>
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title" style={{ fontSize: "30px" }}>
                      {course?.name}
                    </h5>
                    {/* <p className="card-text">{course.description}</p> */}
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
        <h1 className="text-dark text-center">Our Teachers</h1>
        <Carousel>
          <div className="row">
            {teachers.map((teacher) => (
              <div className="col-md-2" key={teacher._id}>  
                {teacher.isTeacherApproved ? (
                  <Link to={`/teacherProfileForHome/${teacher._id}`}>
                    <div className="teacher-card mb-4">
                      <div className="card-img-square">
                        <img
                          // src={`https://melodymusic.online/uploads/${teacher.profilePhoto}`}
                          src={`http://localhost:4000/uploads/${teacher.profilePhoto}`}
                          className="card-img-top"
                          alt="Teacher's profile"
                        />
                      </div>
                      <div className="card-body">
                        <h3 className="card-title text-center">
                          {teacher?.userName}
                        </h3>
                        <h5 className="card-title">{teacher?.credentials}</h5>
                      </div>
                    </div>
                  </Link>
                ) : null}
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
                <p>Beginner and Advance Lessons</p>
                <p>Online Classes</p>
                <p>45 min / Class</p>
                <p>Regional / English Instructions</p>
              </div>
              <button
                className="get-started-button"
                onClick={() => handleGetStartedClick(pricingPlan)}
              >
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Image */}

        {/* <div className="container-m">
          <div className="banner-home-end">
            <div className="row">
              <div className="col-md-6">
                <div className="banner1">
                  <img
                    src={img}
                    className="banner"
                    alt="..."
                    // style={{ width: "70%", height: "auto" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div> */}
    </div>
  );
}

export default Home;
