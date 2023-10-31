import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import './teacherLogin.css'
import Swal from "sweetalert2";
import Cookies from "js-cookie"; // Import js-cookie library
import { useDispatch } from "react-redux";
import { fetchTeacherData } from "../../../Redux/teacherActions";
import LOGO from "../../UserComponets/Home/logo-black.png"
import {
  setTeacher,
  setTeacherProfilePicture,
} from "../../../Redux/teacherSlice";

function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      Swal.fire("Please fill in all the fields");
    } else {
      const body = {
        email,
        password,
      };

      try {
        const response = await axios.post(
          "http://localhost:4000/teachers/teacherLogin",
          body,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          // Save tokens in cookies
          Cookies.set("token", response.data.token);
          Cookies.set("refreshToken", response.data.refreshToken);

          // Dispatch user data to Redux store
          dispatch(
            setTeacher({
              id: response.data.teacher._id,
              name: response.data.teacher.userName,
            })
          );
          dispatch(
            setTeacherProfilePicture({
              profilePicture: response.data.teacher.profilePhoto,
            })
          );

          Swal.fire("Good job!", "Teacher Login Success!", "success");
          navigate("/teacherhome");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops..",
            text: "Invalid credentials!",
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Teacher not found", "error");
      }
    }
  };

  return (
    <div className="teacher-login-container">
      <form className="teacher-login-form" onSubmit={(e) => handleSubmit(e)}>
      <img src={LOGO} alt="Logo" className="teacher-login-logo" style={{ width: "80px" }} />
        <h2 className="text text-dark">Teacher Login</h2>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account?{" "}
          <Link to="/register">Sign up as a Teacher</Link>
        </p>
      </form>
    </div>
  );
}

export default TeacherLogin;
