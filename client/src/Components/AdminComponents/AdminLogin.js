import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import Cookies from "js-cookie";
import { adminPostLogin } from "../../utils/Constants";
import Swal from "sweetalert2";
import loginimg from "./images/login.jpg";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleadminLogin = async (e) => {
    const body = JSON.stringify({
      email,
      password,
    });
    e.preventDefault();

    if (email === "" || password === "") {
      Swal.fire("Please fill in all the fields");
    } else {
      try {
        let response = await axios.post('/adminLogin', body, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("response :::" +JSON.stringify(response.data.status))
        if (response.data.status === "ok") {
          Cookies.set("token", response.data.token);
          Cookies.set("refreshToken", response.data.refreshToken);
          navigate("/adminHome");
        } else {
          Swal.fire({
            icon: "error",
            text: "Invalid Credentials!!",
          });
        }
      } catch (err) {
        alert(err);
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => handleadminLogin(e)}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* <form onSubmit={(e) => handleadminLogin(e)} className="admin-login-form"> */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email1"
              label="Email Address"
              name="email1"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              inputProps={{ style: { color: 'black' } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <Link href="/adminSignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}

export default AdminLogin;
