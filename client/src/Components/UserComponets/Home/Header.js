import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import { change } from "../../../Redux/usernameReducer";
// import { changeImage } from "../../../Redux/userimageReducer";
import { changeImage } from "../../../Redux/userSlice";
import { changeUsername } from "../../../Redux/userSlice";
import { setUser } from "../../../Redux/userSlice";
// import { verifyUserToken } from "../../../utils/Constants";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import logo from "./LOGO.png";
import axios from "../../../utils/axios";

function Header() {
  const userToken = useSelector((state) => state.user.userToken);
  const userId = useSelector((state) => state.user.userId);
  const username = useSelector((state) => state.user.username);
  const userImage = useSelector((state) => state.user.userImage);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElInstruments, setAnchorElInstruments] = useState(null);

  console.log("userToken header  " + userToken);

  const handleUserMenuOpen = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  const handleInstrumentsMenuOpen = (event) => {
    setAnchorElInstruments(event.currentTarget);
  };

  const handleInstrumentsMenuClose = () => {
    setAnchorElInstruments(null);
  };

  const handleLogoutUser = () => {
    localStorage.clear();
    dispatch({ type: "logout" });
    setIsLoggedIn(false);
    navigate("/");
    handleUserMenuClose();
  };

  // useEffect(() => {
  //   const Token = localStorage.getItem('token');

  //   if (!Token) {
  //     setIsLoggedIn(false);
  //     navigate('/');
  //   } else {
  //     const body = JSON.stringify({ Token });
  //     axios.post('/verifyUserToken', body, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
  //       console.log({ data: res });
  //       dispatch(change(res.data.user?.userName));
  //       dispatch(changeImage(res.data.user.image));
  //       // dispatch(setUser({ userId: res.data.user._id }));
  //       setIsLoggedIn(true);
  //     });
  //   }
  // }, [dispatch]);

 
  console.log("Username from Redux store:", username);

  // ...

  useEffect(() => {
    const Token = userToken;
    console.log("Tokenotpuser   " + Token);
    if (!Token) {
      setIsLoggedIn(false);
      navigate("/");
    } else {
      axios
        .post("/verifyUserToken", {
          Token: Token,
          username: username,
          userId: userId,
        })
        .then((res) => {
          const userData = res.data.user;
          console.log("userData " + res.data.user.userName);

          if (userData) {
            // User is authenticated, update the state with user data
            dispatch(changeUsername(userData.userName));
            dispatch(
              setUser({
                userName: userData.userName,
                userId: userData._id,
                userToken: Token,
              })
            );
            dispatch(changeImage(userData.image));
            console.log("logged in");
            setIsLoggedIn(true);
          } else {
            // Token verification failed, handle as needed
            setIsLoggedIn(false);
            navigate("/");
          }
        })
        .catch((error) => {
          // Handle errors from the request
          console.error("Error verifying user token:", error);
        });
    }
  }, [dispatch, userToken, userId, username]);



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

  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <img src={logo} alt="Logo" style={{ width: "80px" }} />
        </Link>
        {/* <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            Home
          </Link>
        </Typography> */}
        <Button
          aria-controls="instruments-menu"
          aria-haspopup="true"
          onClick={handleInstrumentsMenuOpen}
          color="inherit"
          style={{ width: "350px", background: "transparent", border: "none",  fontSize: "20px"  }}
        >
          Instruments
        </Button>
        <Button color="inherit" style={{ width: "250px" , background: "transparent", border: "none" , fontSize: "20px"}}>
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
        
        <Button color="inherit" style={{ width: "250px", background: "transparent", border: "none" , fontSize: "20px" }}>
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
        </Button>
        {isLoggedIn ? (
          <div>
            <Button color="inherit" style={{ width: "250px", background: "transparent", border: "none", fontSize: "20px"  }}>
          <Link
            to="/profile"
            style={{
              textDecoration: "none",
              color: "inherit",
              margin: "0 10px",
              background: "transparent",
              fontSize: "20px"
            }}
          >
            My Profile
          </Link>
        </Button>
            <Button
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleUserMenuOpen}
              color="inherit"
              style={{ width: "250px" }}
            >
              <Avatar alt="User Logo" src={userImage} />
              <Typography variant="body1" style={{ marginLeft: "10px", color: "white" , fontSize: "20px" ,background: "transparent"}}>
                {username}
              </Typography>
            </Button>
            
            <Menu
              id="user-menu"
              anchorEl={anchorElUser}
              keepMounted
              open={Boolean(anchorElUser)}
              onClose={handleUserMenuClose}
            >
              <MenuItem onClick={handleLogoutUser}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <Button color="inherit" style={{ width: "250px", background: "transparent", border: "none", fontSize: "20px"  }} onClick={() => navigate("/loginwithotp")}>
              Login
            </Button>
            {/* <Button color="inherit" style={{ width: "250px", background: "transparent", border: "none", fontSize: "20px"  }} onClick={() => navigate("/signup")}>
              Register
            </Button> */}
          </div>
        )}
        <div>
          <Menu
            id="instruments-menu"
            anchorEl={anchorElInstruments}
            keepMounted
            open={Boolean(anchorElInstruments)}
            onClose={handleInstrumentsMenuClose}
          >
            {courses.map((course) => (
              <MenuItem key={course._id} onClick={handleInstrumentsMenuClose}>
                <Link
                  to={`/courses/${course._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {course.name}
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
