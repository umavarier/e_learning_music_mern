import React, { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../../utils/axios'
// import Spinner from 'react-bootstrap/Spinner';
import { Spinner } from 'react-bootstrap';

import './loginwithotp.css';

const Login = () => {

    const [email, setEmail] = useState("");
    const [spiner,setSpiner] = useState(false);

    const navigate = useNavigate();



    // sendotp
    const sendOtp = async (e) => {
        e.preventDefault();

        if (email === "") {
            toast.error("Enter Your Email !")
        } else if (!email.includes("@")) {
            toast.error("Enter Valid Email !")
        } else {
            setSpiner(true);
            const data = {
              email: email,
            };
      
            axios
              .post('/sendotp', data, {
                headers: { 'Content-Type': 'application/json' },
              })
              .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    setSpiner(false);
                      navigate('/otp', { state: email });
                    // Check if the response data exists and has the expected structure
                    // if (response.data && response.data.status === 200) {
                    //   setSpiner(false);
                    //   navigate('/otp', { state: email });
                    // } else if (response.data && response.data.error) {
                    //   console.error(response.data.error);
                    // } else {
                    //   console.error("Unexpected response data:", response.data);
                    // }
                  } else {
                    console.error("Unexpected response status:", response.status);
                  }
                })
                .catch((error) => {
                  console.error("An error occurred:", error);
                });
          }    }

    return (
        <>
            <section className="login-section">
                <div className="loginuser-form_data">
                    <div className="loginuser-form_heading">
                        <h1 className='user-h1'>Welcome Back, Log In</h1>
                        <p className='user-p'>Hi, we are you glad you are back. Please login.</p>
                    </div>
                    <form>
                        <div className="user-form_input">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="" onChange={(e) => setEmail(e.target.value)} placeholder='Enter Your Email Address' />
                        </div>
                        <button className='user-btn' onClick={sendOtp}>Login
                        {
                            spiner ? <span><Spinner animation="border" /></span>:""
                        }
                        </button>
                        <p>Don't have and account <NavLink to="/signup">Sign up</NavLink> </p>
                    </form>
                </div>
                {/* <ToastContainer /> */}
            </section>
        </>
    )
}

export default Login