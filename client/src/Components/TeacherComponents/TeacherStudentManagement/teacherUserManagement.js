import React, { useEffect, useState } from 'react';
import Header from '../Header/TeacherHeader';
import axios from '../../../utils/axios';
import Sidebar from '../../TeacherComponents/Sidebar/TeacherSidebar'


function TeacherUsermanagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    TeacherGetAllUsers();
  }, []);

  const TeacherGetAllUsers = () => {
    axios
      .get('/TeacherGetAllUsers')
      .then((response) => {
        console.log("Response data from API:", response.data);
        setUsers(response.data.users);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  useEffect(() => {
    console.log("Users state after update:", users);
  }, [users]); // Add users as a dependency to this useEffect

  return (
    <>
    <Header />
    <div style={{ backgroundColor: '#ffff', minHeight: '100vh', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        
      <input
        className="form-control mb-3 w-25 searchadmin"
        name="query"
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
      <table id="customers" className="text-dark">
        <tr>
          <th className="w-5">No</th>
          <th>User Name</th>
          <th>Email</th>
          {/* <th>Course</th>
          <th>Level</th> */}
        </tr>

        {users.map((student, index) => (
          <tr key={student._id}>
            {/* Add a unique key prop */}
            <td>{index + 1}</td>
            <td>{student.userName}</td>
            <td>{student.email}</td>
            {/* <td>{student.description}</td> */}
          </tr>
        ))}
      </table>
    </div>
    </div>
    </>
  );
}

export default TeacherUsermanagement;
