import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../Utils/axios";
import "./teacherLogin.css";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { fetchTeacherData } from "../../../Redux/teacherActions";
import LOGO from "../../UserComponents/Home/logo-black.png";
import {
  setTeacher,
  setTeacherProfilePicture,
} from "../../../Redux/teacherSlice";

function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkProfilePicture = async () => {
    try {
      const accessToken = Cookies.get("token");
      const response = await axios.get("/teachers/checkTeacherProfilePicture", {
        headers: {
          Authorization: ` ${accessToken}`,
        },
      });

      if (response.data.hasProfilePicture) {
        navigate("/teacherProfile");
      } else {
        navigate("/teacherProfilePictureUpload");
      }
    } catch (error) {
      console.error("Error checking profile picture:", error);
    }
  };

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
          // "https://melodymusic.online/teachers/teacherLogin",
          "/teachers/teacherLogin",
          body,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("response-signup"+JSON.stringify(response.status));
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
          checkProfilePicture();
        } else if (response.status === 401) {
          if (response.data && response.data.error === "Teacher blocked") {
            Swal.fire("Error", "Teacher is blocked", "error");
          } else if (response.data && response.data.error === "Admin approval pending") {
            Swal.fire("Error", "Cannot login, admin approval pending", "error");
          } else if (response.data && response.data.error === "Invalid password") {
            Swal.fire("Error", "Invalid password", "error");
          } else if (response.data && response.data.error === "Teacher not found") {
            Swal.fire("Error", "Teacher not found", "error");
          } else {
            Swal.fire(
              "Error",
              "An error occurred. Please try again later.",
              "error"
            );
          }
        } else {
          Swal.fire(
            "Error",
            "An unexpected error occurred. Please try again later.",
            "error"
          );
        }
      } catch (err) {
        console.error(err);
        if (err.response) {
          console.log(err.response);
      
          if (err.response.status === 401) {
            Swal.fire("Error", "Some specific error message", "error");
          } else if (err.response.status === 400) {
            const errorMessage = err.response.data && err.response.data.error
              ? err.response.data.error
              : "Bad Request";
      
            Swal.fire("Error", errorMessage, "error");
          } else {
            Swal.fire("Error", "An unexpected error occurred. Please try again later.", "error");
          }
        } else {
          Swal.fire("Error", "An error occurred. Please try again later.", "error");
        }
      }
    }
  };
  return (
    <div className="teacher-login-container">
      <form className="teacher-login-form" onSubmit={(e) => handleSubmit(e)}>
        <img
          src={LOGO}
          alt="Logo"
          className="teacher-login-logo"
          style={{ width: "80px" }}
        />
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
          Don't have an account? <Link to="/signup">Sign up as a Teacher</Link>
        </p>
      </form>
    </div>
  );
}

export default TeacherLogin;
