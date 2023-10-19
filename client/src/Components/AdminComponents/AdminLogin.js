import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { adminPostLogin } from '../../utils/Constants';
import Swal from 'sweetalert2';
import loginimg from './images/login.jpg'

import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleadminLogin = async (e) => {
    const body = JSON.stringify({
      email,
      password,
    });
    e.preventDefault();

    if (email === '' || password === '') {
      Swal.fire('Please fill in all the fields');
    } else {
      try {
        let admin = await axios.post(adminPostLogin, body, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (admin.data.status === 'ok') {
          navigate('/adminHome');
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Invalid Credentials!!',
          });
        }
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <div className="login-container">
     <div className='login-card-img'> 
      <div className="admin-login-card">
        <h1 className="text-light">Admin Login</h1>
        <form onSubmit={(e) => handleadminLogin(e)} className="admin-login-form">
          <div className="input-fields">
          <p className="text-light">Email</p>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-box"
            />            
          </div>
          <div className="input-fields">
          <p className="text-light">Password</p>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-box"
            />            
          </div>
          <input type="submit" value="Login" className="admin-login-btn" />
        </form>
      </div>
      <div className="login-image">
        {/* You can add your image here */}
        <img
          src={loginimg}
          alt="Login Image"
          className="loginimage"
        />
      </div>
      </div>
    </div>
  );
}

export default AdminLogin;
