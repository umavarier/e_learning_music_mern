import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import './Signup.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  Avatar,
  FormControlLabel,
  Input,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Signup() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherDescription, setTeacherDescription] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [certificate, setCertificate] = useState();
  const [teacherCredentials, setTeacherCredentials] = useState('');
  const [availableCourses,setAvailableCourses] = useState('')

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
        courses: selectedCourses,
        teacherDescription: isTeacher ? teacherDescription : '',
        certificate: isTeacher ? certificate : '',
        teacherCredentials: isTeacher ? teacherCredentials : '',
      };
      

      try {
        const response = await axios.post("http://localhost:4000/signup", body, {
          headers: { 'Content-Type': 'application/json' },
        });
      
        if (response.data.status === 'ok') {
          toast.success('Signup Success!', {
            position: "top-right",
            autoClose: 3000,
          });
          console.log(response.data);
          navigate('/roleSelection');
        } else if (response.data.status === 'error' && response.data.message === 'User already exists') {
          toast.error('User Already Registered!', {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error('Internal server error', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('Internal server error', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleTeacherSignup = () => {
    setIsTeacher(!isTeacher);
  };

  useEffect(() => {
    axios.get('/getCourseForSignup')
      .then((response) => {
        setAvailableCourses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
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
    if (isTeacher) {
      return (
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Teacher Information
          </Typography>
          <TextField
            label="Teacher Description"
            variant="outlined"
            fullWidth
            value={teacherDescription}
            onChange={(e) => setTeacherDescription(e.target.value)}
          />
          <FormControlLabel
          label="I can teach the following courses"
            control={
              <Checkbox
                checked={selectedCourses.length > 0}
                onChange={() => handleTeacherSignup}
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
          {/* <Input
            type="file"
            name="certificate"
            id="certificate"
            accept=".pdf"
            onChange={(e) => setCertificate(e.target.files[0])}
            
          />
          <Typography variant="body2">
            Upload your teaching certificate (PDF)
          </Typography> */}
          <TextField
            label="Teacher Credentials"
            variant="outlined"
            fullWidth
            value={teacherCredentials}
            onChange={(e) => setTeacherCredentials(e.target.value)}
          />
        </Grid>
      );
    } else {
      return null;
    }
  };

  return (
    <>
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={false} sm={12} md={12} component={Paper} elevation={6} square>
        <div sx={{ margin: 'auto', maxWidth: 400, padding: 4 }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h6" align="center">Signup</Typography>
          <form onSubmit={handleSubmit}>
          <TextField
            label="User Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            autoFocus
            inputProps={{ style: { color: 'black' } }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            inputProps={{ style: { color: 'black' } }}
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
            inputProps={{ style: { color: 'black' } }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isTeacher}
                onChange={handleTeacherSignup}
              />
            }
            label="Signup as a Teacher"
          />
          {renderTeacherFields()}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            sx={{ mt: 2 }}
          >
            Signup
          </Button>
        </form>
        </div>
      </Grid>
    </Grid>
    </>
  );
}

export default Signup;
