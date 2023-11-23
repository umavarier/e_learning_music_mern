import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../../../Utils/axios";
import { setUser } from "../../../Redux/userSlice";
import { Button, TextField, Card, CardContent, Typography, Container, Box, CircularProgress } from "@mui/material";
import LogoImage from "../../UserComponents/Home/logo-black.png";


const Otp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // Add this line
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const LoginUser = async (e) => {
    e.preventDefault();

    if (otp === "") {
      toast.error("Enter Your OTP");
    } else if (!/[^a-zA-Z]/.test(otp)) {
      toast.error("Enter Valid OTP");
    } else if (otp.length < 6) {
      toast.error("OTP Length should be at least 6 digits");
    } else {
      setLoading(true); // Set loading to true before making the API call

      const data = {
        otp,
        email: location.state,
      };

      try {
        const response = await axios.post("/loginOtp", data, {
          headers: { "Content-Type": "application/json" },
        });
      
        console.log("Response Status Code: " + JSON.stringify(response.data));
      
        if (response.status === 200) {
          localStorage.setItem("userdbtoken", response.data.userToken);
          dispatch(
            setUser({
              userName: response.data.userName,
              userId: response.data?.userId,
              userToken: response.data.userToken,
            })
          );
          toast.success(response.data.message);
      
          setTimeout(() => {
            navigate("/", { state: { userId: response.data?.userId } });
          }, 5000);
        } else if (response.status === 400) {
          toast.error("Invalid OTP");
        } else {
          toast.error(response.data.error || "Invalid OTP111");
        }
      } catch (error) {
        // Handle the error and display a toast message for "Invalid OTP"
        toast.error("Invalid OTP");
        console.error("An error occurred:", error);
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
        {/* Logo at the top center */}
        <img src={LogoImage} alt="Logo" style={{ marginBottom: 16 }} />

        <Card sx={{ width: "100%", maxWidth: 400 }}>
          <CardContent>
            <Typography component="div" variant="h5" mb={2}>
              Please Enter Your OTP Here
            </Typography>

            <form>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="OTP"
                name="otp"
                autoComplete="otp"
                autoFocus
                onChange={(e) => setOtp(e.target.value)}
                InputProps={{
                  style: { color: "black" }, 
                }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={LoginUser}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
      {/* <ToastContainer /> */}
    </Container>
  );
};

export default Otp;
