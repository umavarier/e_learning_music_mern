import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearTeacher, setTeacher, setTeacherProfilePicture } from '../../../Redux/teacherSlice';
import { selectTeacherName, selectTeacherProfilePicture } from '../../../Redux/teacherSlice';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';
import Cookies from 'js-cookie'; 
import jwtDecode from 'jwt-decode';
import io from "socket.io-client";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LOGO from '../../UserComponets/Home/LOGO.png'


const TeacherName = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const AvatarWrapper = styled('div')(({ theme }) => ({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
}));

const LogoutButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color:"white"
}));

function TeacherHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const socket = io("http://localhost:4000");
  // Load teacher data from cookies on component mount
  useEffect(() => {
    const accessToken = Cookies.get('token');

    if (accessToken) {
      // Decode the access token to get user data
      const decodedToken = jwtDecode(accessToken);

      // Update Redux state with teacher data
      dispatch(setTeacher({ id: decodedToken.id, name: decodedToken.userName }));
      const socket = io("http://localhost:4000"); // Replace with your server URL

      // Listen for notifications 
      socket.on("notification", (notification) => {
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
      });
      // Clean up the socket connection when the component unmounts
      return () => {
        socket.disconnect();
      };  
    }
  }, [dispatch]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    console.log("event---"+notificationAnchorEl)
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };


  const handleLogout = () => {
    dispatch(clearTeacher());
    Cookies.remove('token'); // Remove access token from cookies
    navigate('/teacherLogin');
  };

  
  const teacherName = useSelector(selectTeacherName);
  const profilePicture = useSelector(selectTeacherProfilePicture);

  return (
    <div>
      <AppBar position="static" >
        <Toolbar>
        <img src={LOGO} alt="Logo" className="teacher-login-logo" style={{ width: "80px" }} />
          <Link to="/teacherHome" style={{ color: 'black', textDecoration: 'none' }}>
            <Typography variant="h6" color="white" style={{alignItems: "center"}}>
              TEACHER DASHBOARD
            </Typography>
          </Link>

          {/* Navbar menu */}
          <AvatarWrapper>
            {/* Teacher profile */}
            {profilePicture ? (
              <Avatar src={profilePicture} alt="" />
            ) : (
              <Avatar>{teacherName ? teacherName.charAt(0).toUpperCase() : ''}</Avatar>
            )}
            {/* Use the TeacherName styled component */}
            <TeacherName variant="body1" color="white" style={{padding: "20px", fontSize: "20px"}}>{teacherName}</TeacherName>
          </AvatarWrapper>

          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
          >
            {/* Display a notification icon or button */}
            <Badge badgeContent={notifications.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <LogoutButtonWrapper>
            <Menu
              anchorEl={notificationAnchorEl}
              anchorOrigin={{

                vertical: 'top',
                horizontal: 'right',
              }}
              id="profile-menu"
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
            >
            {notifications.map((notification, index) => (
                <MenuItem key={index}>
                  {notification.message}
                </MenuItem>
              ))}
            </Menu>

            {/* Logout button */}
            <Button variant="outlined" color="secondary" onClick={handleLogout} style={{ color: 'black', backgroundColor: 'white' }}>
             Logout
            </Button>
          </LogoutButtonWrapper >
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default TeacherHeader;



