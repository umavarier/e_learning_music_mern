import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../../../utils/axios";
import { setUser } from "../../../Redux/userSlice";
import "./otp.css";

const Otp = () => {
  const [otp, setOtp] = useState("");

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
      const data = {
        otp,
        email: location.state,
      };

      const response = await axios.post("/loginOtp", data, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        localStorage.setItem("userdbtoken", response.data.userToken);
        console.log(response.data.userToken + "   response.data.userToken");

        dispatch(
          setUser({
            userName: response.data.userName,
            userId: response.data?.userId,
            userToken: response.data.userToken,
          })
        );
        toast.success(response.data.message);
        
        console.log(response.data.userId + "   response.data.userId");
        setTimeout(() => {
          navigate("/", { state: { userId: response.data?.userId } });
        }, 5000);
      } else {
        toast.error(response.response.data.error);
      }
    }
  };

  return (
    <section className="otp-section">
      <div className="otp-form_data">
        <div className="otp-form_heading">
          <h1>Please Enter Your OTP Here</h1>
        </div>
        <form>
          <div className="otp-form_input">
            <label className="otp-label" htmlFor="otp">OTP</label>
            <input
              type="text-light"
              name="otp"
              id=""
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter Your OTP"
            />
          </div>
          <button className="otp-btn" onClick={LoginUser}>
            Submit
          </button>
        </form>
      </div>
      {/* <ToastContainer /> */}
    </section>
  );
};

export default Otp;
