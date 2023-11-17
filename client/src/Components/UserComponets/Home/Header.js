import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import jwt_decode from "jwt-decode";
import logo from "./LOGO.png";
import axios from "../../../utils/axios";
import { logout } from "../../../Redux/userimageReducer";
import { changeImage } from "../../../Redux/userSlice";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import io from "socket.io-client";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';


const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const userProfilePicture = useSelector((state) => state.user.userImage);
  const [courses, setCourses] = useState([]);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElInstruments, setAnchorElInstruments] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  
useEffect(() => {
  const token = localStorage.getItem("userdbtoken");

  const fetchData = async () => {
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken) {
        setUserId(decodedToken._id);
        setUserName(decodedToken.userName);
        // const socket = io("https://melodymusic.online");
        const socket = io("http://localhost:4000");
        socket.on("notification", (notification) => {
          setNotifications((prevNotifications) => [...prevNotifications, notification]);
        });
        // Clean up the socket connection when the component unmounts
        return () => {
          socket.disconnect();
        };

        // Fetch the user's profile photo
        try {
          const response = await axios.get(`/fetchUserProfilePhoto/${decodedToken._id}`);
          if (response.status === 200 && response.data.profilePhotoUrl) {
            setProfilePhoto(response.data.profilePhotoUrl);
            dispatch(changeImage(response.data.profilePhotoUrl));
          } else {
            setProfilePhoto("");
          }
        } catch (error) {
          console.error("Error fetching profile photo:", error);
          setProfilePhoto("");
        }
      }
    }
  };

  fetchData();
}, []);
  
  axios
  .get(`/fetchUserProfilePhoto/${userId}`)
  .then((response) => {
    if (response.status === 200 && response.data.profilePhotoUrl) {
      // Use the profile photo from the backend
      setProfilePhoto(response.data.profilePhotoUrl);
      dispatch(changeImage(response.data.profilePhotoUrl));

      // Save the profile photo to local storage for future use
      localStorage.setItem("profilePhoto", response.data.profilePhotoUrl);
    }
    
  })
  .catch((error) => {
    // Fallback to the locally stored profile photo if fetching from the backend fails
    const locallyStoredPhoto = localStorage.getItem("profilePhoto");
    if (locallyStoredPhoto) {
      setProfilePhoto(locallyStoredPhoto);
      dispatch(changeImage(locallyStoredPhoto));
    }
    else{
      setProfilePhoto( "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
    }
  });
 
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleInstrumentsMenuOpen = (event) => {
    setAnchorElInstruments(event.currentTarget);
  };

  const handleInstrumentsMenuClose = () => {
    setAnchorElInstruments(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  useEffect(() => {
    axios
      .get("/viewCourses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userdbtoken");
    localStorage.removeItem("profilePhoto")
    dispatch(
      changeImage(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      )
    );
    setUserId(null);
    setUserName(null);
    setProfilePhoto("")
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <img src={logo} alt="Logo" style={{ width: "80px", marginLeft:"30px", marginRight: "30px" }} />
        </Link>
        {/* <Typography variant="h6" style={{ flex: 1 }}>
          Your App
        </Typography> */}

        <Button
          aria-controls="instruments-menu"
          aria-haspopup="true"
          onClick={handleInstrumentsMenuOpen}
          color="inherit"
          style={{
            width: "350px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
          }}
        >
          COURSES
        </Button>
        <Popover
          open={Boolean(anchorElInstruments)}
          anchorEl={anchorElInstruments}
          onClose={handleInstrumentsMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <List>
            {courses.map((course) => (
              <ListItem key={course._id}>
                <Link
                  to={`/courses/${course._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button color="inherit">{course.name}</Button>
                </Link>
              </ListItem>
            ))}
          </List>
        </Popover>
        <Button
          color="inherit"
          style={{
            width: "250px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
          }}
        >
          <Link
            to="/pricing"
            style={{
              textDecoration: "none",
              color: "inherit",
              margin: "0 10px",
            }}
          >
            Pricing
          </Link>
        </Button>

        {/* <Button
          color="inherit"
          style={{
            width: "250px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
          }}
        >
          <Link
            to="/gallery"
            style={{
              textDecoration: "none",
              color: "inherit",
              margin: "0 10px",
            }}
          >
            Gallery
          </Link>
        </Button> */}
        <div style={{ flex: 1 }}></div>

        {userId ? (
          <div style={{ display: "flex", alignItems: "center" }}>
             <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={notifications.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Typography variant="h6" style={{ marginRight: "10px" }}>
              {userName}
            </Typography>
            <IconButton
              onClick={handleProfileClick}
              color="inherit"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              {userProfilePicture ? (
                <img
                  // src={`https://melodymusic.online/uploads/${profilePhoto}`}
                  src={`http://localhost:4000/uploads/${profilePhoto}`}
                  alt="User Profile"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleProfileClose}
            >
              <List>
                <Link
                  to="/Profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button color="inherit">My Profile</Button>
                </Link>
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
                <ListItem>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </ListItem>
              </List>
            </Popover>
          </div>
        ) : (
          <Button color="inherit" onClick={() => navigate("/loginwithotp")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
