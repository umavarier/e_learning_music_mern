import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../Header/AdminHeader';
import AdminSidebar from '../Header/AdminSidebar';
import Footer from '../Footer/Footer';
import axios from '../../../utils/axios';
import Swal from 'sweetalert2';
import './AdminAddTeacher.css';

function AdminAddTeacher() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userName === '' || email === '' || password === '') {
      Swal.fire('Please fill in all the fields', 'question');
    } else {
      try {
        const body = JSON.stringify({
          userName,
          email,
          password,
        });

        let response = await axios.post('/adminAddTeacher', body, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log("response123 "+response.status)
        if (response.status === 201) {
          Swal.fire('Success!', 'Teacher registered successfully!', 'success');
          console.log(response.data);
          navigate('/adminTeacherManagement'); // Redirect to the teacher management page
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Teacher already exists!',
          });
          console.log('error');
        }
      } catch (err) {
        console.error(err);
        alert(err);
      }
    }
  };

  return (
    <div>
      <AdminHeader />
      <div style={{ display: "flex" }}>
      <AdminSidebar />
      <form className="updateForm" style={{justifyContent : "center"}} onSubmit={(e) => handleSubmit(e)}>
        <div className="container1" >
          <h1>ADD TEACHER</h1>

          <label htmlFor="teacherName">
            <b>Teacher Name</b>
          </label>
          <input
            type="text"
            placeholder="Enter teacher name"
            style={{fontSize : "24px"}}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            id="teacherName"
            required=""
          />

          <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            type="text"
            placeholder="Enter Email"
            style={{fontSize : "24px"}}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            required=""
          />
          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            style={{fontSize : "24px"}}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            required=""
          />
          <button type="submit">Add Teacher</button>
        </div>
      </form>
      </div>
      <Footer />
    </div>
  );
}

export default AdminAddTeacher;
