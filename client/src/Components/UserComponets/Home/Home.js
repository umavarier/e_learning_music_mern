import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Home.css";
import { Dropdown } from "react-bootstrap";
import Carousel from "react-material-ui-carousel";
import axios from "../../../utils/axios";
import banner2 from "./banner2.avif";
import img from "./banner1.png";
import Header from "./Header";
// import Notifications from "../Notification/Notifications";

function Home() {
  const userId = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications?.notifications);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState([]);

console.log("notify: "+notifications)
  console.log(userId.userId + "     userId    ");
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
              <button className="book-button">Book a Free Demo</button>
            </Link>
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

      {/* pricing section
            <br></br><br /><br/>
      <div className="subscription-section">
        <div className="container">
          <h2>Subscription Plans</h2>
          <div className="subscription-cards">
            <div className="subscription-card">
              <h3>BASIC</h3>
              <p>4 Classes / Month</p>
              <p>₹ 3600</p>
              <p>
                <span className="discounted-price">₹ 4000</span> 10% OFF
              </p>
              <p>Beginner Lessons</p>
              <p>4 Online Classes</p>
              <p>60 min / Class</p>
              <p>Regional / English Instructions</p>
              <button className="enroll-button">Enroll Now</button>
            </div>
            <div className="subscription-card">
              <h3>BASIC</h3>
              <p>4 Classes / Month</p>
              <p>₹ 3600</p>
              <p>
                <span className="discounted-price">₹ 4000</span> 10% OFF
              </p>
              <p>Beginner Lessons</p>
              <p>4 Online Classes</p>
              <p>60 min / Class</p>
              <p>Regional / English Instructions</p>
              <button className="enroll-button">Enroll Now</button>
            </div>
            <div className="subscription-card">
              <h3>BASIC</h3>
              <p>4 Classes / Month</p>
              <p>₹ 3600</p>
              <p>
                <span className="discounted-price">₹ 4000</span> 10% OFF
              </p>
              <p>Beginner Lessons</p>
              <p>4 Online Classes</p>
              <p>60 min / Class</p>
              <p>Regional / English Instructions</p>
              <button className="enroll-button">Enroll Now</button>
            </div>
            <div className="subscription-card">
              <h3>BASIC</h3>
              <p>4 Classes / Month</p>
              <p>₹ 3600</p>
              <p>
                <span className="discounted-price">₹ 4000</span> 10% OFF
              </p>
              <p>Beginner Lessons</p>
              <p>4 Online Classes</p>
              <p>60 min / Class</p>
              <p>Regional / English Instructions</p>
              <button className="enroll-button">Enroll Now</button>
            </div>
            <div className="subscription-card">
              <h3>BASIC</h3>
              <p>4 Classes / Month</p>
              <p>₹ 3600</p>
              <p>
                <span className="discounted-price">₹ 4000</span> 10% OFF
              </p>
              <p>Beginner Lessons</p>
              <p>4 Online Classes</p>
              <p>60 min / Class</p>
              <p>Regional / English Instructions</p>
              <button className="enroll-button">Enroll Now</button>
            </div>
            {/* Add more subscription cards here */}
      {/* </div>
        </div>
      </div>  */}

      {/* Banner Image */}
      <div className="container mt-5">
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
  );
}

export default Home;
