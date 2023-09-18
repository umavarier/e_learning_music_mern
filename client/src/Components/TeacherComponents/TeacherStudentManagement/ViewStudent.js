import React from 'react';
import Sidebar from '../Sidebar/TeacherSidebar'

function TeacherViewStudents() {
  // Sample student data (replace with actual data)
  const students = [
    {
      id: 1,
      name: 'John Doe',
      course: 'Mathematics',
      level: 'Intermediate',
    },
    {
      id: 2,
      name: 'Jane Smith',
      course: 'Science',
      level: 'Advanced',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      course: 'History',
      level: 'Beginner',
    },
    // Add more students as needed
  ];

  return (
    <div className="container mt-4">
      <Sidebar />
      <h2>Student List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Course Selected</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.course}</td>
              <td>{student.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherViewStudents;
