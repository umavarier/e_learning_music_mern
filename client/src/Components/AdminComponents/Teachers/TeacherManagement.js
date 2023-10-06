import React, { useEffect, useState } from 'react';
import AdminHeader from '../Header/AdminHeader';
import AdminSidebar from '../Header/AdminSidebar';
import axios from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';
import './TeacherManagement.css';

function TeacherManagement() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    getTeacherList();
  }, []);

  const getTeacherList = () => {
    // Fetch the list of teachers from your API using axios
    axios.get('/adminGetTeachers')
      .then((response) => {
        console.log("respo  "+response.data)
        setTeachers(response.data.teachers);
      })
      .catch((error) => {
        console.error('Error fetching teachers:', error);
      });
  };

  const deleteTeacher = (teacherId) => {    
    axios.delete(`/adminDeleteTeacher/${teacherId}`)
      .then(() => {
        getTeacherList(); // Refresh the teacher list
      })
      .catch((error) => {
        console.error('Error deleting teacher:', error);
      });
  };

  const toggleBlockTeacher = (teacherId, isBlock) => {
    // Send a request to toggle the isBlock field of the teacher
    axios.patch(`/adminToggleBlockTeacher/${teacherId}`, { isBlock: !isBlock })
      .then(() => {
        getTeacherList(); // Refresh the teacher list
      })
      .catch((error) => {
        console.error('Error toggling teacher block status:', error);
      });
  };

  return (
    <div className="teacher-management-container">
      <AdminHeader />
      <div className="teacher-management-content">
        <AdminSidebar />
        <div className="teacher-list">
          <h2>Teacher Management</h2>
          <button className="add-button" onClick={() => navigate('/adminAddTeacher')}>Add Teacher</button>
          <table className="teacher-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Teacher Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={teacher._id}>
                  <td>{index + 1}</td>
                  <td>{teacher.userName}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <button className="block-button" onClick={() => toggleBlockTeacher(teacher._id, teacher.isBlock)}>
                      {teacher.isBlock ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TeacherManagement;
