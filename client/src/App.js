import React from "react";
// import { GoogleOAuthProvider , GoogleLogin } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDash from "./Components/AdminComponents/Dashboard/AdminDash";
import RoleSelection from "./Components/UserComponets/RoleSelection/RoleSelection";
import AdminaddUsers from "./Components/AdminComponents/Users/AdminaddUsers";
import UpdateUser from "./Components/AdminComponents/Users/UpdateUser";
import Usermanagement from "./Components/AdminComponents/Users/Usermanagement";
import AdminPage1 from "./Pages/AdminPages/AdminPage1";
import AdminTeacherManagement from "./Components/AdminComponents/Teachers/TeacherManagement";
import AdminAddTeacher from "./Components/AdminComponents/Teachers/AdminAddTeacher";
import AdminGetTeachers from "./Components/AdminComponents/Teachers/TeacherManagement";

import TeacherLogin from "./Components/TeacherComponents/TeacherLogin/teacherLogin";
import FetchteacherData from "./Components/TeacherComponents/Header/TeacherHeader";
import TeacherUserManagement from "./Components/TeacherComponents/TeacherStudentManagement/teacherUserManagement";
import AddCourse from "./Components/TeacherComponents/TeacherCourse/AddCourse";
import ViewCourses from "./Components/UserComponets/Home/Home";
import CourseDetails from "./Components/CourseComponent/CourseDetails";
import TeacherDash from "./Components/TeacherComponents/TeacherDash/TeacherDash";
import TeacherViewCourse from "./Components/TeacherComponents/TeacherCourse/ViewCourse";

// import { getCourseById } from './Components/CourseComponent/Course';
import usergetUserDetails from "./Components/CourseComponent/CourseDetails";
// import CourseDetails from './Components/CourseComponent/CourseDetails';
import Home from "./Pages/UserPages/HomePage";
import Login from "./Pages/UserPages/LoginPage";
// import UserLoginwithOTP from "./Components/UserComponets/Login/Login";
import Loginwithotp  from "./Components/UserComponets/Login/loginwithotp";
import Otp from "./Components/UserComponets/Login/otp";
import ProfilePage from "./Pages/UserPages/ProfilePage";
import Signup from "./Pages/UserPages/SignupPage";
import TeacherHome from "./Pages/TeacherPages/TeacherHomepage";
import ScheduleDemo from "./Components/CourseComponent/CourseDetails";
import Pricing from "./Components/CourseComponent/Pricing";
import VideoRoom from "./Components/CourseComponent/VideoRoom";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route exact path="/login" element={<Login />} /> */}
        <Route path="/loginwithotp" element={<Loginwithotp />} />
        <Route path="/" element={<Home />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/CourseDetails" element={<CourseDetails />} />

        <Route path="/admin" element={<AdminPage1 />} />

        <Route path="/adminHome" element={<AdminDash />} />
        <Route path="/users" element={<Usermanagement />} />
        <Route path="/teachers" element={<AdminTeacherManagement />} />

        <Route path="/adminAddUser" element={<AdminaddUsers />} />
        <Route path="/updateUser/:id" element={<UpdateUser />} />
        <Route path="/adminAddTeacher" element={<AdminAddTeacher />} />
        <Route path="/adminGetTeachers" element={<AdminGetTeachers />} />
        <Route
          path="/AdminTeacherManagement"
          element={<AdminTeacherManagement />}
        />
        <Route path="/roleselection" element={<RoleSelection />} />

        {/* <Route path = '/teacher'element={<Login/>}/> */}
        <Route path="/teacherLogin" element={<TeacherLogin />} />
        <Route path="/teacher-data" element={<FetchteacherData />} />
        <Route path="/teacherhome" element={<TeacherDash />} />
        <Route path="/TeacherGetAllUsers" element={<TeacherUserManagement />} />
        <Route path="/teacherViewCourse" element={<TeacherViewCourse />} />

        <Route path="/addCourse" element={<AddCourse />} />
        <Route path="/ViewCourses" element={<ViewCourses />} />
        {/* <Route path="/courses/:courseId" element={<getCourseById/>} /> */}
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        {/* <Route path="/courses/:courseId?userId=:userId" element={<CourseDetails />}/> */}
        <Route path="/schedule-demo" element={<ScheduleDemo />} />
        <Route path="/videoRoom/:roomId" element={<VideoRoom />} />
        <Route path="/user:userId" element={<usergetUserDetails />} />
        <Route path = '/otp' element={<Otp/>} />
        {/* <Route path="/userLoginWithOTP" element={<UserLoginwithOTP />} /> */}
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </Router>
  );
}

export default App;
