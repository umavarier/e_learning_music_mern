import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "../../../utils/axios";
import img from "./img3.jpg";
import LOGO from "../../UserComponets/Home/logo-black.png";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Card,
  CardHeader,
  CardContent,
  Box,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Signup = () => {
  const salt = 10;
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [isTeacherApproved, setIsTeacherApproved] = useState(false);

  // State variables for the user information
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // State variables for teacher information
  const [teacherDescription, setTeacherDescription] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [teacherCredentials, setTeacherCredentials] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);

  const navigate = useNavigate();

  const isPhoneNumberValid = (phoneNumber) => {
    return /^\d{10}$/.test(phoneNumber);
  };
  const isEmailValid = (email) => {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  };
  const isNameValid = (name) => {
    return /^[A-Za-z\s]+$/.test(name);
  };
  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  const handleTeacherSignup = (e) => {
    setIsTeacher(e.target.checked);
    if (e.target.checked) {
      handleOpenTeacherModal();
    }
  };

  const handleOpenTeacherModal = () => {
    setTeacherModalOpen(true);
  };

  const handleCloseTeacherModal = () => {
    setTeacherModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      userName === "" ||
      email === "" ||
      password === "" ||
      phoneNumber === ""
    ) {
      Swal.fire("Please fill in all the fields");
    } else if (!isPhoneNumberValid(phoneNumber)) {
      Swal.fire("Please enter a valid 10-digit phone number");
    } else if (!isEmailValid(email)) {
      Swal.fire("Please enter a valid email address");
    } else if (!isNameValid(userName)) {
      Swal.fire("Name should not contain numbers");
    } else if (!isPasswordValid(password)) {
      Swal.fire("Password should contain at least 8 characters");
    } else {
      const body = {
        userName,
        email,
        password,
        phoneNumber,
        isTeacher,
        // certificate:isTeacher? selectedCertificate:"",
        teacherDescription: isTeacher ? teacherDescription : "",
        courses: isTeacher ? selectedCourses : "",
        teacherCredentials: isTeacher ? teacherCredentials : "",
      };

      // try {
      //   if (isTeacher) {
      //     // Save teacher details to the database
      //     const  = {
      //       userName,
      //       email,
      //       password,
      //       phoneNumber,
      //       isTeacher,
      //       teacherDescription,
      //       courses: selectedCourses,
      //       teacherCredentials,
      //     };
      //     await axios.post("https://melodymusic.online/signup", data);
      //   }

      console.log("signup  "+JSON.stringify(body))

      const response = await axios.post("https://melodymusic.online/signup", body, {
        // const response = await axios.post("http://localhost:4000/signup", body, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "ok") {
        toast.success("Signup Success!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/roleSelection");
      } else if (
        response.data.status === "error" &&
        response.data.message === "User already exists"
      ) {
        toast.error("User Already Registered!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Internal server error", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      // } catch (err) {
      //   console.error(err);
      //   toast.error("Internal server error", {
      //     position: "top-right",
      //     autoClose: 3000,
      //   });
      // }
    }
  };

  useEffect(() => {
    axios
      .get("/getCourseForSignup")
      .then((response) => {
        setAvailableCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleCourseChange = (courseId) => {
    const isSelected = selectedCourses.includes(courseId);

    if (isSelected) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  // Function to send teacher details for admin approval
  const sendForAdminApproval = () => {
    setTeacherModalOpen(false);
    // setShowAdminApprovalModal(true);
  };

  // Function to handle "OK" click on the admin approval card
  // const handleAdminApprovalOK = () => {
  //   // setShowAdminApprovalModal(false);
  //   setTeacherModalOpen(false);
  //   setIsTeacherApproved(false);
  //   const teacherDetails = {
  //     userName,
  //     email,
  //     password,
  //     phoneNumber,
  //     isTeacher,
  //     teacherDescription,
  //     selectedCourses,
  //     teacherCredentials,
  //   };
  //   console.log("selectedCourses  "+JSON.stringify(teacherDetails))
  //   axios
  //     .post("https://melodymusic.online/signup", teacherDetails)
  //     .then((response) => {
  //       if (response.data.status === "ok") {
  //         toast.success("Teacher Details Saved!", {
  //           position: "top-right",
  //           autoClose: 3000,
  //         });
  //         navigate("/roleSelection");
  //       } else {
  //         toast.error("Failed to save Teacher Details", {
  //           position: "top-right",
  //           autoClose: 3000,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error saving teacher details:", error);
  //       toast.error("Internal server error", {
  //         position: "top-right",
  //         autoClose: 3000,
  //       });
  //     });
  // };

  const renderTeacherFields = () => {
    if (isTeacher) {
      return (
        <Modal open={teacherModalOpen}>
          {/* <Card> */}
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            background ="#fff"
            component="main"
            sx={{ width: "50vh" }}
          >
            <Grid>
              <CardHeader title="Teacher Information" />
              <CardContent>
                <TextField
                  label="Teacher Description"
                  variant="outlined"
                  fullWidth
                  value={teacherDescription}
                  onChange={(e) => setTeacherDescription(e.target.value)}
                  inputProps={{ style: { color: "black" } }}
                />
                <FormControlLabel
                  label="I can teach the following courses"
                  control={
                    <Checkbox
                      checked={selectedCourses.length > 0}
                      onChange={handleTeacherSignup}
                    />
                  }
                />
                {availableCourses.map((course) => (
                  <FormControlLabel
                    key={course._id}
                    control={
                      <Checkbox
                        checked={selectedCourses.includes(course._id)}
                        onChange={() => handleCourseChange(course._id)}
                      />
                    }
                    label={course.name}
                  />
                ))}
                <TextField
                  label="Teacher Credentials"
                  variant="outlined"
                  fullWidth
                  value={teacherCredentials}
                  onChange={(e) => setTeacherCredentials(e.target.value)}
                  inputProps={{ style: { color: "black" } }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();  
                    handleCloseTeacherModal();
                    Swal.fire({
                      title:
                        "The signUp is pending for Admin to approve. You will get notified soon!!",
                      text: "",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, Save it",
                      cancelButtonText: "No, cancel!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        // handleAdminApprovalOK();
                        handleCloseTeacherModal();
                        handleSubmit(e);
                      }
                    });
                  }}
                  sx={{ mt: 2 }}
                >
                  Save Teacher Details
                </Button>
              </CardContent>
            </Grid>
          </Grid>
          {/* </Card> */}
        </Modal>
      );
    } else {
      return null;
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      component="main"
      sx={{ height: "100vh" }}
    >
      <Grid item xs={12} sm={6} md={6}>
        <Paper elevation={6} sx={{ maxWidth: 400, padding: 4, marginTop: 20 }}>
          <img
            src={LOGO}
            alt="Logo"
            className="teacher-login-logo"
            style={{
              width: "80px",
              justifyContent: "center",
              marginLeft: "120px",
            }}
          />
          <Typography variant="h6" align="center">
            Signup
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="User Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
              inputProps={{ style: { color: "black", fontSize: "25px" } }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputProps={{ style: { color: "black", fontSize: "25px" } }}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              inputProps={{ style: { color: "black", fontSize: "25px" } }}
            />

            <FormControlLabel
              control={
                <Checkbox checked={isTeacher} onChange={handleTeacherSignup} />
              }
              label="Signup as a Teacher"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Signup
            </Button>
          </form>
        </Paper>
      </Grid>

      {/* Image */}
      {/* <Grid item xs="false" sm={12} md={12}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <img
            src={img}
            alt="Your Image"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Grid> */}

      {renderTeacherFields()}
    </Grid>
  );
};

export default Signup;
