import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "../../../Utils/axios";
import LOGO from "../../UserComponents/Home/logo-black.png";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

const Signup = () => {
  const salt = 10;
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);

  // State variables for the user information
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // State variables for teacher information
  const [teacherDescription, setTeacherDescription] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [teacherCredentials, setTeacherCredentials] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (isTeacher) {
      handleOpenTeacherModal();
    } else {
      handleCloseTeacherModal();
    }
  }, [isTeacher]);

  const handleTeacherSignup = (e) => {
    setIsTeacher(e.target.checked);

    // Open the teacher modal only if the form is valid
    if (e.target.checked && isFormValid) {
      handleOpenTeacherModal();
    }

    // Update the form validity when the checkbox is toggled
    updateFormValidity();
  };

  const handleOpenTeacherModal = () => {    
    setTeacherModalOpen(true);
  };

  const handleCloseTeacherModal = () => {
    setTeacherModalOpen(false);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value) => {
    return value.length >= 8;
  };

  const validatePhoneNumber = (value) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(value);
  };

  const handleUserNameChange = (value) => {
    setUserName(value);
    setUserNameError(value ? "" : "User Name is required");
    updateFormValidity();
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setEmailError(
      value
        ? validateEmail(value)
          ? ""
          : "Enter a valid email address"
        : "Email is required"
    );
    updateFormValidity();
  };

   const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError(
      value
        ? validatePassword(value)
          ? ""
          : "Password must be at least 8 characters"
        : "Password is required"
    );
    updateFormValidity();
  };

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    setPhoneNumberError(
      value
        ? validatePhoneNumber(value)
          ? ""
          : "Enter a valid 10-digit phone number"
        : "Phone number is required"
    );
    updateFormValidity();
  };

  const updateFormValidity = () => {
    if (
      !userNameError &&
      !emailError &&
      !passwordError &&
      !phoneNumberError
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!userName) {
      setUserNameError("User Name is required");
      setIsFormValid(false);
      return;
    }

    // Validate email
    if (!email || !validateEmail(email)) {
      setIsFormValid(false);
      return;
    }

    // Validate password
    if (!password || !validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters");
      setIsFormValid(false);
      return;
    }

    // Validate phone number
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError("Enter a valid 10-digit phone number");
      setIsFormValid(false);
      return;
    }

    // Reset error messages
    setUserNameError("");
    setEmailError("");
    setPasswordError("");
    setPhoneNumberError("");

 
    const body = {
      userName,
      email,
      password,
      phoneNumber,
      isTeacher,
      teacherDescription: isTeacher ? teacherDescription : "",
      courses: isTeacher ? selectedCourses : "",
      teacherCredentials: isTeacher ? teacherCredentials : "",
    };

   
    console.log("signup  " + JSON.stringify(body));

    // const response = await axios.post("https://melodymusic.online/signup", body, {
    const response = await axios.post("http://localhost:4000/signup", body, {
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
  

  const renderTeacherFields = () => {
    if (isFormValid && isTeacher) {
      return (
        <Modal open={teacherModalOpen}>        
          <Grid container justifyContent="flex-end">
            <Card sx={{ width: "30vw", marginRight: "2rem" }}>
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
            </Card>
          </Grid>
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
              onChange={(e) => handleUserNameChange(e.target.value)}
              autoFocus
              inputProps={{ style: { color: "black", fontSize: "25px" } }}
              error={Boolean(userNameError)}
              helperText={userNameError}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              inputProps={{ style: { color: "black", fontSize: "25px" } }}
              error={Boolean(emailError)}
              helperText={emailError}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={Boolean(passwordError)}
              helperText={passwordError}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => handlePhoneNumberChange(e.target.value)}
              inputProps={{ style: { color: "black", fontSize: "25px" } }}
              error={Boolean(phoneNumberError)}
              helperText={phoneNumberError}
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
      {renderTeacherFields()}
    </Grid>
  );
};

export default Signup;
