import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import Swal from "sweetalert2";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminSignup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminSignup = async (e) => {
    e.preventDefault();

    if (username === "" || email === "" || password === "") {
      Swal.fire("Please fill in all the fields");
    } else {
      const body = JSON.stringify({
        username,
        email,
        password,
      });
      
      try {
        let admin = await axios.post('/adminSignUp', body, {
          headers: { "Content-Type": "application/json" },
        });
        if (admin.data.status === 'ok') {
            toast.success('Admin registered successfully');
            navigate('/adminLogin');
          } else {
            toast.error('Sign-up failed. Please try again.');
          }
        } catch (err) {
          console.error(err);
          toast.error('An error occurred. Please try again.');
        }
    
    }
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="m">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => handleAdminSignup(e)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              inputProps={{ style: { color: 'black' } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputProps={{ style: { color: 'black' } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Button
              type="submit1"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  {/* Forgot password? */}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/adminLogin" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </Container>
    </ThemeProvider>
  );
}

export default AdminSignup;
