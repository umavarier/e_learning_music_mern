import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import './Home.css';
import axios from '../../../utils/axios';

import img from './banner1.png'

function Home() {
  const username = useSelector((state) => state.username);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(()=> {
    axios.get('/viewCourses')
       .then((response) => {
          setCourses(response.data)
       })
       .catch((error) =>{
          console.error('Error fetching courses:', error);
       })
  }, [])
  useEffect(() =>{
    axios.get('/viewTeachers')
      .then((response) => {
        setTeachers(response.data)
      })
      .catch((error) => {
        console.error("Error fetching teachers:" , error);
      })
  }, [])

  return (
    <div style={{ backgroundColor: 'black' }}>
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://s3.amazonaws.com/thumbnails.venngage.com/template/acf4e986-12be-406b-85d5-ea768cc9a94e.png"
              className="d-block homePageImage"
              alt="..."
              style={{ width: '100%', height: 'auto' }}
            />
            {/* <div className="carousel-caption">
              <h2 className="homeHeader">WELCOME</h2>
              <p className="homeName">{username}...</p>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div id="teacherCarousel" className="carousel slide" data-bs-ride="carousel">
          <h3 className="text-white">Our Teachers</h3>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="d-flex justify-content-between">
              {teachers.map((teacher) => (
                  <div className="card mx-3 card-with-shadow" style={{ width: '18rem' }} key={teacher.id}>
                    <img src={teacher.image} className="card-img-top" alt={teacher.userName} />
                    <div className="card-body" style={{ backgroundColor: 'black', color: 'white' }}>
                      <h5 className="card-title">{teacher.name}</h5>
                      <p className="card-text" style={{ backgroundColor: 'black', color: 'white' }}>{teacher.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#teacherCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#teacherCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* //Course containers */}
      <div className="container mt-5">
  <h3 className="text-white">Our Courses</h3>
  <div id="courseCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
  <div className="row">
  
   {courses.map((course) => (
  <div className="card mb-4" key={course.id}>
    {/* You can display course information here */}
    <div className="card-img-square">
      <img src={course.image} className="card-img-top" alt={course.name} />
    </div>
    <div className="card-body">
      <h5 className="card-title">{course.name}</h5>
      <p className="card-text">{course.description}</p>
      <p className="card-text">Instructor: {course.instructor}</p>
      {/* Add more course details as needed */}
    </div>
  </div>
))}

  </div>
  <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#courseCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#courseCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
</div>



      <br></br><br></br>
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
  );
}

export default Home;


