import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import axios from '../../../utils/axios';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { change } from '../../../Redux/usernameReducer';
import { changeImage } from '../../../Redux/userimageReducer';
import { verifyUserToken } from '../../../utils/Constants';
import logo from './LOGO.png';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const handleLogoutUser = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Logout?',
      text: 'Do you want to Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        dispatch({ type: 'logout' });
        setIsLoggedIn(false)
        navigate('/');
      }
    });
  };

  useEffect(() => {
    const Token = localStorage.getItem('token');

    if (!Token) {
      setIsLoggedIn(false);
      navigate('/');
    } else {
      const body = JSON.stringify({ Token });
      axios.post(verifyUserToken, body, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
        dispatch(change(res.data.user.userName));
        dispatch(changeImage(res.data.user.image));
        setIsLoggedIn(true);
      });
    }
  }, [dispatch]);

  const username = useSelector((state) => state.username);
  const userImage = useSelector((state) => state.userImage);

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: 'linear-gradient(to bottom, #294b47, black)',
        color: 'white',
      }}
    >
      <div className="container-fluid">
      <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" style={{ width: '50px' }} />
        </Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <Link to="/">
            <h6 className="nav-link whiteText">Home</h6>
          </Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/CourseDetails">
                <h6 className="nav-link whiteText">Courses</h6>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Option2">
                <h6 className="nav-link whiteText">Teachers</h6>
              </Link>
            </li>            
            <li className="nav-item">
              <Link to="/gallery">
                <h6 className="nav-link whiteText">Gallery</h6>
              </Link>
            </li>            
          </ul>
          {isLoggedIn ? (
            <>
              <Link to="/Profile">
                <h6 className="nav-link active whiteText" aria-current="page">
                  My Profile
                </h6>
              </Link>
              <a className="navbar-brand">
                <img src={userImage} className="userLogo" style={{ width: '30px' }} alt="User Logo" />
              </a>
              <form className="d-flex">
                <span className="navUserName">{username}</span>
                <button className="userLogoutButton" onClick={handleLogoutUser} type="submit">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
            <button
      className="teachWithUsButton "
      type="button"
      style={{
        background: 'transparent',
        color: 'white',
        border: 'none', 
        cursor: 'pointer', 
      }}
        >Teach with us
        </button>
            <Link to="/login">
              <button className="userLogoutButton" type="submit">
                Login
              </button>
            </Link>

           </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
