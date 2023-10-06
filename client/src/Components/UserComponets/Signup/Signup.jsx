import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import Swal from 'sweetalert2';
import {Link} from 'react-router-dom';
import './Signup.css';
import {useNavigate} from 'react-router-dom'

function Signup() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherDescription, setTeacherDescription] = useState('');
  const [teacherCertificate, setTeacherCertificate] = useState('');
  const [teacherCredentials, setTeacherCredentials] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userName === '' || email === '' || password === '') {
      Swal.fire('Please fill in all the fields');
    } else {
      const body = {
        userName,
        email,
        password,
        phoneNumber,
        isTeacher,
        teacherDescription: isTeacher ? teacherDescription : '',
        teacherCertificate: isTeacher ? teacherCertificate : '',
        teacherCredentials: isTeacher ? teacherCredentials : '',
      };

      try {
        const response = await axios.post("http://localhost:4000/signup", body, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data.status === 'ok') {
          Swal.fire('Good job!', 'Signup Success!', 'success');
          console.log(response.data);
          navigate('/roleSelection')
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: 'User Already Registered!',
          });
          console.log('some error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Internal server error', 'error');
      }
    }
  };

  const handleTeacherSignup = () => {
    setIsTeacher(!isTeacher);
  };

  const renderTeacherFields = () => {
    if (isTeacher) {
      return (
        <div>
          <label className="label1" htmlFor="teacherDescription">
            Teacher Description
          </label>
          <input
            className="input1"
            type="text"
            placeholder="Teacher Description"
            value={teacherDescription}
            onChange={(e) => setTeacherDescription(e.target.value)}
            id="teacherDescription"
          />
          <label className="label1" htmlFor="teacherCertificate">
            Teacher Certificate
          </label>
          <input
            className="input1"
            type="text"
            placeholder="Teacher Certificate"
            value={teacherCertificate}
            onChange={(e) => setTeacherCertificate(e.target.value)}
            id="teacherCertificate"
          />
          <label className="label1" htmlFor="teacherCredentials">
            Teacher Credentials
          </label>
          <input
            className="input1"
            type="text"
            placeholder="Teacher Credentials"
            value={teacherCredentials}
            onChange={(e) => setTeacherCredentials(e.target.value)}
            id="teacherCredentials"
          />
        </div>
      );
    } else {
      return null;
    }
  };


  return (
    <div style={{ backgroundColor: '#0b0c2a', minHeight: '100vh' }}>
      <div className="signInpage">
        <div className="background">
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <form className="signupForm" onSubmit={(e) => handleSubmit(e)}>
          <h3 className="tag1">Signup</h3>
          <label className="label1" htmlFor="username">
            User Name
          </label>
          <input
            className="input1"
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            id="username"
          />
          <label className="label1" htmlFor="phonenumber">
            Phone Number
          </label>
          <input
            className="input1"
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            id="phonenumber"
          />
          <label className="label1" htmlFor="email">
            Email
          </label>
          <input
            className="input1"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
          />
          <label className="label1" htmlFor="password">
            Password
          </label>
          <input
            className="input1"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />

          <div>
            <label>
              <input
                type="checkbox"
                checked={isTeacher}
                onChange={handleTeacherSignup}
              />
              Signup as a Teacher
            </label>
          </div>

          {renderTeacherFields()}

          <button className="loginButton" type="submit">
            Signup
          </button>
          <div className="social">
            <div className="go">
              <i className="fab fa-google"></i> <Link to={'/roleSelection'}>Login</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;