import React, { useState, useEffect, Fragment } from 'react';
import axios from '../../../utils/axios';
import AdminHeader from '../Header/AdminHeader';
import AdminSidebar from '../Header/AdminSidebar';

function AdminCourseManagement() {
  const [course, setCourse] = useState({
    name: '',
    // instructorIds: [], // Admin selects instructors from a list
    duration: '',
    level: '',
    description: '',
    image: '',
    // price: 0,
    // startDate: '',
    // endDate: '',
    // enrollments: 0,
    // ratings: [],
    // pricing: [],
    // syllabus: [],
  });

  const [instructors, setInstructors] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);

  // useEffect(() => {
  //   // Fetch the list of instructors from the server
  //   axios.get('/teachers') // Adjust the API endpoint to fetch instructors
  //     .then((response) => {
  //       setInstructors(response.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching instructors:', error);
  //     });
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleInstructorChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedInstructors(selectedOptions);
    setCourse({ ...course, instructorIds: selectedOptions });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setCourse({ ...course, image: imageFile });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/courses/addCourse', course)
      .then((response) => {
        console.log('Course added successfully:', response.data);
        setCourse({
          name: '',
          // instructorIds: [],
          duration: '',
          level: '',
          description: '',
          image: '',
          // price: 0,
          // startDate: '',
          // endDate: '',
          // enrollments: 0,
          // ratings: [],
          // pricing: [],
          // syllabus: [],
        });
        setSelectedInstructors([]);
      })
      .catch((error) => {
        console.error('Error adding course:', error);
      });
  };

  return (
    <Fragment>
      <AdminHeader />
      <div className="container-fluid">
        <div className="row">
          <AdminSidebar />
          <div className="col">
            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit} className="add-course-form">
              <div className="form-group">
                <label>Course Name:</label>
                <input type="text" name="name" className="form-control" value={course.name} onChange={handleInputChange} />
              </div>
              {/* <div className="form-group">
                <label>Instructors:</label>
                <select
                  name="instructorIds"
                  className="form-control"
                  value={selectedInstructors}
                  onChange={handleInstructorChange}
                  multiple
                >
                  {instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.userName}
                    </option>
                  ))}
                </select>
              </div> */}
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
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {/* <div className="form-group">
                <label>Price:</label>
                <input type="number" name="price" className="form-control" value={course.price} onChange={handleInputChange} />
              </div> */}
              {/* <div className="form-group">
                <label>Start Date:</label>
                <input type="date" name="startDate" className="form-control" value={course.startDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>End Date:</label>
                <input type="date" name="endDate" className="form-control" value={course.endDate} onChange={handleInputChange} />
              </div> */}
              {/* <div className="form-group">
                <label>Enrollments:</label>
                <input type="number" name="enrollments" className="form-control" value={course.enrollments} onChange={handleInputChange} />
              </div> */}
              {/* Add input fields for ratings and syllabus here */}
              <button type="submit" className="btn btn-primary">Add Course</button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AdminCourseManagement;
