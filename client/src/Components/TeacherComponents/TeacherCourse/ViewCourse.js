import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../../utils/axios';
import TeacherSidebar from '../Sidebar/TeacherSidebar';
import TeacherHeader from '../Header/TeacherHeader';
import './ViewCourse.css'
import Header from '../../UserComponets/Home/Header';

function CourseManagement() {
  const teacherId = useSelector((state) => state.teacher.id);
  const [courses, setCourses] = useState([]);
  // const [course, setCourse] = useState({
  //   name: '',
  //   instructor: '',
  //   // Add other course properties here
  // });
  useEffect(() => {
    axios.get(`/teacherViewCourse?teacherId=${teacherId}`)  
    .then((response) => {
      setCourses(response.data);
      console.log("ti   "+response.data)
    })
    .catch((error) => {
      console.error('Error fetching courses:', error);
    });
  }, [teacherId]);

  
    return (
      <div className="CourseManagement">
        <TeacherHeader />
        <div className="teacher-content">
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
      
      </div>
    </div>
  );
}

export default CourseManagement;
