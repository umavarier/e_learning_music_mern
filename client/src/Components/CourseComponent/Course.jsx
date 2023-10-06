// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from '../../utils/axios';

// function Course() {
//   const { courseId } = useParams(); // Get the course ID from the URL
//   const [course, setCourse] = useState(null);

//   useEffect(() => {
//     console.log('Course ID:', courseId);
//     // Fetch course details based on the ID
//     axios
//       .get(`/getCourseDetails/${courseId}`) 
//       .then((response) => {
//         setCourse(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching course details:', error);
//       });
//   }, [courseId]);

//   if (!course) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>{course.name}</h1>
//       <p>{course.description}</p>
//       <p>Instructor: {course.instructorId.userName}</p>
//       {/* Add more course details as needed */}
//     </div>
//   );
// }

// export default Course;
