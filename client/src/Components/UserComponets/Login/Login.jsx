import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import { FaSignInAlt } from "react-icons/fa";
import { LoginPost } from "../../../utils/Constants";
import { useDispatch } from "react-redux";
import "./Login.css";
import logo from "../../AdminComponents/Header/LOGO.png";
import Swal from "sweetalert2";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teacherLogin, setTeacherLogin] = useState(false); // State for teacher login
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {

    const body = JSON.stringify({
      email,
      password,
      isTeacher: teacherLogin,
    });
    e.preventDefault();

    if (email === "" || password === "") {
      Swal.fire("Please Fill all the fields");

    } else {
  
      try {
        let user = await axios.post(LoginPost, body, {
          headers: { "Content-Type": "application/json" },
        });
         
        console.log({"userData":user})
        if (user.data.user) {
          localStorage.setItem("token", user.data.user);
          if (user.data.role === 1) {
            navigate("/teacherhome"); // Navigate to the teacher's dashboard page
          } else {
            navigate("/");
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Credentials!",
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Function to toggle teacherLogin state
  const handleTeacherLogin = () => {
    setTeacherLogin(!teacherLogin);
  };

  return (
    <>
    
    <div className="loginpage">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form className="loginForm" onSubmit={(e) => handleSubmit(e)}>
      <img src={logo} alt="Logo" className="logo" style={{ width: "80px" }} />
        <h3 className="tag1">
          <FaSignInAlt /> Login
        </h3>

        <label className="login-label1" htmlFor="username">
          Email Id
        </label>
        <input
          className="input1"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="username"
        />

        <label className="label1" htmlFor="password">
          Password
        </label>
        <input
          className="input1"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
        />

        <div>
          <label>
            <input
              type="checkbox"
              checked={teacherLogin}
              onChange={handleTeacherLogin}
            />
            Login as a Teacher
          </label>
        </div>

        <button className="loginButton1" type="submit">
          Log In
        </button>
        <div className="social">
          <div className="go">
            <i className="fab fa-google"></i>{" "}
            <Link to={"/signup"}>Sign Up</Link>
          </div>
        </div>
      </form>
    </div>
    </>
  );
}

export default Login;
