import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../../Utils/axios";
import { Button, TextField, Card, CardContent, Typography, CircularProgress, Container, Box } from "@mui/material";
import LogoImage from "../../UserComponents/Home/logo-black.png"; 



const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    if (email === "") {
      toast.error("Enter Your Email !");
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email !");
    } else {
      setLoading(true);
      try {
        const response = await axios.post("/sendotp", { email }, { headers: { "Content-Type": "application/json" } });

        if (response.status === 200) {
          console.log(response);
          navigate("/otp", { state: email });
        } else {
          console.error("Unexpected response status:", response.status);
        }  
      } catch (error) {
        console.error("An error occurred:", error);
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;

          if (errorMessage === "This User is not registered") {
            toast.error("User is not registered");
          } else {
            toast.error(`An error occurred: ${errorMessage}`);
          }
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={LogoImage} alt="Logo" style={{ marginBottom: 16 }} />

        <Card sx={{  maxWidth: "700px" }}>
          <CardContent>
            <Typography component="div" variant="h5" mb={2} >
              Welcome Back, Log In
            </Typography>
            <Typography component="div" variant="body2" color="textSecondary" mb={2}>
              Hi, we are glad you are back. Please login.
            </Typography>

            <form>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={sendOtp}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>

              <Typography variant="body2" mt={2}>
                Don't have an account? <NavLink to="/signup">Sign up</NavLink>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>
      {/* <ToastContainer /> */}
    </Container>
  );
};

export default Login;
