import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box } from "@mui/system";
import { CssBaseline } from "@mui/material";
import Card from "@mui/material/Card"; // Import the Card component
import CardContent from "@mui/material/CardContent"; // Import the CardContent component
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LOGO from "../UserComponets/Home/logo-black.png";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Card variant="outlined" sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CardContent>
          <img src={LOGO} alt="Logo" className="teacher-login-logo" style={{ width: "80px",marginLeft : "130px" }} />
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleAdminLogin} noValidate sx={{ mt: 1 }}>
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
                inputProps={{ style: { color: "black" } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link href="/adminSignUp" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default AdminLogin;
