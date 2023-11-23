import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../Utils/axios';
import './CourseDetails.css'

function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  // useEffect(() => {
  //   // Fetch course details using courseId from the route parameters
  //   axios
  //     .get(`/getCourseDetails/${courseId}`) // Replace with your actual API endpoint      
  //     .then((response) => {
  //       setCourse(response.data.course); // Assuming course data is inside a "course" key in the response
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching course details:', error);
  //     });
  // }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{course.name}</h2>
      <p>{course.description}</p>
      <p>{course.duration}</p>
      <p>{course.instructor}</p>     
    </div>
  );
}

export default CourseDetails;
