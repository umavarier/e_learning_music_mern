import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Home.css';
import axios from '../../../utils/axios';
import banner from './banner.png';
import img from './banner1.png';

function Home() {
  const username = useSelector((state) => state.username);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios
      .get('/viewCourses')
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('/viewTeachers')
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching teachers:', error);
      });
  }, []);

  return (
    <div>
      {/* Banner */}
      <div className="banner-container">
        <div className="left-side">
          <img
            src={banner} // Replace with the URL of your left-side image
            alt="Banner Image"
            className="banner-image"
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
            <button className="book-button">Book a Free Demo</button>
          </div>
        </div>
      </div>

      {/* Teachers */}
      <div className="container mt-5">
        <h3 className="text-white">Our Teachers</h3>
        <div className="row">
          {teachers.map((teacher) => (
            <div className="col-md-4" key={teacher.id}>
              {/* Display teacher information here */}
              <div className="card mb-4">
                <div className="card-img-square">
                  <img
                    src={teacher.image}
                    className="card-img-top"
                    alt={teacher.name}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{teacher.name}</h5>
                  <p className="card-text">Specialization: {teacher.specialization}</p>
                  {/* Add more teacher details as needed */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div className="container mt-8">
        <h3 className="text-white">Our Courses</h3>
        <div className="row">
          {courses.map((course) => (
            <div className="card mb-8 rounded-card" key={course.id}>
            {/* You can display course information here */}
            <div className="card-img-circle">
              <i className={`fas ${course.icon} fa-5x text-primary`}></i>
            </div>
            <div className="card-body text-center">
              <h5 className="card-title">{course.name}</h5>
              <p className="card-text">{course.description}</p>
              <p className="card-text">Instructor: {course.instructor}</p>
              {/* Add more course details as needed */}
            </div>
          </div>
           ))}
              </div>
            </div>
         
        {/* </div>
      </div> */}

      {/* Banner Image */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <div className="banner1">
              <img
                src={img}
                className="banner"
                alt="..."
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
