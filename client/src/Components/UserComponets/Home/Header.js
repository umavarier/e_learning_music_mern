import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import axios from '../../../utils/axios';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { change } from '../../../Redux/usernameReducer';
import { changeImage } from '../../../Redux/userimageReducer';
import { verifyUserToken } from '../../../utils/Constants';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        navigate('/');
      }
    });
  };

  useEffect(() => {
    const Token = localStorage.getItem('token');

    if (!Token) {
      navigate('/');
    } else {
      const body = JSON.stringify({ Token });
      axios.post(verifyUserToken, body, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
        dispatch(change(res.data.user.userName));
        dispatch(changeImage(res.data.user.image));
      });
    }
  }, [dispatch]);

  const username = useSelector((state) => state.username);
  const userImage = useSelector((state) => state.userImage);

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background:
          'linear-gradient(to bottom, #294b47, black)', // Updated gradient background color
        color: 'white',
      }}
    >
      <div className="container-fluid">
       
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <Link to="/">
        
                <h6 className="nav-link whiteText">Home</h6>

        </Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
             
            </li>
            {/* Add more list items for additional options */}
            <li className="nav-item">
              <Link to="/Option1">
                <h6 className="nav-link whiteText">Option 1</h6>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Option2">
                <h6 className="nav-link whiteText">Option 2</h6>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Option2">
                <h6 className="nav-link whiteText">Option 2</h6>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Option2">
                <h6 className="nav-link whiteText">Option 2</h6>
              </Link>
            </li>
            <Link to="/Profile">
                <h6 className="nav-link active whiteText" aria-current="page">
                  My Profile
                </h6>
              </Link>
          </ul>
          <Link to="/">
          <a className="navbar-brand">
            <img src={userImage} className="userLogo" style={{ width: '30px' }} alt="User Logo" />
          </a>
        </Link>
          <form className="d-flex">
            <span className="navUserName">{username}</span>
            <button className="userLogoutButton" onClick={handleLogoutUser} type="submit">
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Header;
