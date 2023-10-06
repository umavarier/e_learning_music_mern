import React, { useState ,useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import {selectTeacherId,  selectTeacherName } from '../../../Redux/teacherSlice';
import axios from '../../../utils/axios';
import TeacherHeader from '../Header/TeacherHeader';
import TeacherSidebar from '../Sidebar/TeacherSidebar';
import './AddCourse.css';

function AddCourse() {
  const teacherId = useSelector(selectTeacherId);
  const teacherName = useSelector(selectTeacherName);

  const [course, setCourse] = useState({
    name: '',
    instructor: teacherName,
    instructorId: teacherId,
    duration: '',
    level: '',
    description: '',
    image: '',    
    startDate: '',
    endDate: '',
    enrollments: 0,
    syllabus: [],
  });


  useEffect(() => {
    // Log the teacherName to check if it's available
    // console.log('Teacher Name:', teacherName);
  }, [teacherName]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/addCourse', course)
      .then((response) => {
        console.log('Course added successfully:', response.data);
        // Optionally, you can redirect to the course catalog or perform other actions here
      })
      .catch((error) => {
        console.error('Error adding course:', error);
      });
  };


  
  return (
  <Fragment>
    <TeacherHeader />
    <div className="container-fluid">
      <div className="row">
        <TeacherSidebar />
        <div className="col">
          <h2>Add New Course</h2>
          <form onSubmit={handleSubmit} className="add-course-form">
            <div className="form-group">
              <label>Course Name:</label>
              <input type="text" name="name" className="form-control" value={course.name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label>Instructor:</label>
                <input
                  type="text-dar"
                  name="instructor"
                  className="form-control"
                  value={course.instructor}
                  readOnly // Make the input read-only to prevent user changes
                />
              </div>

            <div className="form-group">
              <label>Duration:</label>
              <input type="text" name="duration" className="form-control" value={course.duration} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Level:</label>
              <input type="text" name="level" className="form-control" value={course.level} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea name="description" className="form-control" value={course.description} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Image:</label>
              <input type="text" name="image" className="form-control" value={course.image} onChange={handleInputChange} />
            </div>
            {/* <div className="form-group">
              <label>Price:</label>
              <input type="number" name="price" className="form-control" value={course.price} onChange={handleInputChange} />
            </div> */}
            <div className="form-group">
              <label>Start Date:</label>
              <input type="date" name="startDate" className="form-control" value={course.startDate} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input type="date" name="endDate" className="form-control" value={course.endDate} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Enrollments:</label>
              <input type="number" name="enrollments" className="form-control" value={course.enrollments} onChange={handleInputChange} />
            </div>
            {/* Add input fields for ratings and syllabus here */}
            <button type="submit" className="btn btn-primary">Add Course</button>
          </form>
        </div>
      </div>
    </div>
  </Fragment>
);

}

export default AddCourse;
