import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import TeacherSidebar from '../Sidebar/TeacherSidebar';
import TeacherHeader from '../Header/TeacherHeader';
import './ViewCourse.css'

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState({
    name: '',
    instructor: '',
    // Add other course properties here
  });

  useEffect(() => {
    axios.get('/viewCourses') // Replace with your API endpoint
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    // Handle input changes for adding a course here
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/addCourse', course) // Replace with your API endpoint
      .then((response) => {
        console.log('Course added successfully:', response.data);
        // Optionally, you can update the course list or perform other actions here
      })
      .catch((error) => {
        console.error('Error adding course:', error);
      });
  };

  return (
    
    <div className="CourseManagement">
      
      <TeacherSidebar />
      <div className="courseTableContainer">
        <h2>View Courses</h2>
        <table className="courseTable">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Instructor</th>
              {/* Add other course properties as table headers */}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.name}</td>
                <td>{course.instructor}</td>
                {/* Display other course properties as table cells */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <form className="courseForm" onSubmit={handleSubmit}>
        <h2>Add New Course</h2>
        <div>
          <label>Course Name:</label>
          <input
            type="text"
            name="name"
            value={course.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Instructor:</label>
          <input
            type="text"
            name="instructor"
            value={course.instructor}
            onChange={handleInputChange}
          />
        </div>
        {/* Add other course input fields here 
        <button type="submit">Add Course</button>
      </form> */}
    </div>
  );
}

export default CourseManagement;
