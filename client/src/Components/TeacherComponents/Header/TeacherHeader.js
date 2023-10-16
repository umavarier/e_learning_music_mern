import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearTeacher, setTeacher } from '../../../Redux/teacherSlice';
import { selectTeacherName, selectTeacherProfilePicture } from '../../../Redux/teacherSlice';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';

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
}));

function TeacherHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  // Load teacher data from local storage on component mount
  useEffect(() => {
    const storedTeacherData = localStorage.getItem('teacherData');
    if (storedTeacherData) {
      const teacherData = JSON.parse(storedTeacherData);
      // Update Redux state with teacher data
      dispatch(setTeacher(teacherData));
    }
  }, [dispatch]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(clearTeacher());
    localStorage.removeItem('token');
    localStorage.removeItem('teacherData');
    navigate('/teacherLogin');
  };

  // Select teacher name and profile picture from Redux
  const teacherName = useSelector(selectTeacherName);
  const profilePicture = useSelector(selectTeacherProfilePicture);

  // console.log("anthanooo",profilePicture)
  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          {/* Brand */}
          <Link to="/teacherHome" style={{ color: 'black', textDecoration: 'none' }}>
            <Typography variant="h6" color="inherit">
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
            <TeacherName variant="body1" color="red">{teacherName}</TeacherName>
          </AvatarWrapper>

          <LogoutButtonWrapper>
            
            <Menu
              anchorEl={anchorEl}
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
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {/* <MenuItem onClick={handleMenuClose}>
                <Link to="/teacherProfile" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Profile
                </Link>
              </MenuItem> */}
            </Menu>

            {/* Logout button */}
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </LogoutButtonWrapper>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default TeacherHeader;
