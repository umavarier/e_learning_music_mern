import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../utils/axios"; // Import axios
import Swal from "sweetalert2";
import "./teacherLogin.css";
import { useDispatch } from "react-redux";
import { fetchTeacherData } from "../../../Redux/teacherActions";
import setTeacherName from "../../../Redux/teacherSlice";
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
      console.log("body   " + body.email);

      try {
        const response = await axios.post(
          "http://localhost:4000/teachers/teacherLogin",
          body,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("response.data   " + response.data.token);
        localStorage.setItem("token", response.data.token);
        console.log("response  " + response.status);
        if (response.data.teacher.isBlock) {
          Swal.fire(
            "Error",
            "Teacher is blocked. Contact administrator.",
            "error"
          );
        } else if (response.status === 200) {
          Swal.fire("Good job!", "Teacher Login Success!", "success");
          localStorage.setItem("token", response.data.token);
          console.log("data from login ", response.data);
          console.log("propic from db" ,response.data.teacher.profilePhoto)
          //   dispatch(fetchTeacherData());
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

          // Redirect to the teacher home page
          navigate("/teacherhome");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops..",
            text: "Invalid credentials!",
          });
          console.log("Invalid credentials");
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
