import React from "react";
// import { GoogleOAuthProvider , GoogleLogin } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; 

import AdminDash from "./Components/AdminComponents/Dashboard/AdminDash";
import AdminSignUp from './Components/AdminComponents/AdminSignUp/AdminSignUp';
import RoleSelection from "./Components/UserComponets/RoleSelection/RoleSelection";
import AdminaddUsers from "./Components/AdminComponents/Users/AdminaddUsers";
import UpdateUser from "./Components/AdminComponents/Users/UpdateUser";
import Usermanagement from "./Components/AdminComponents/Users/Usermanagement";
import AdminPage1 from "./Pages/AdminPages/AdminPage1";
import AdminTeacherManagement from "./Components/AdminComponents/Teachers/TeacherManagement";
import AdminAddTeacher from "./Components/AdminComponents/Teachers/AdminAddTeacher";
import AdminGetTeachers from "./Components/AdminComponents/Teachers/TeacherManagement";
import AdminCoursePrice from "./Components/AdminComponents/CoursePricing/AdminEnrollmentPricing";

import TeacherLogin from "./Components/TeacherComponents/TeacherLogin/teacherLogin";
import FetchteacherData from "./Components/TeacherComponents/Header/TeacherHeader";
import TeacherUserManagement from "./Components/TeacherComponents/TeacherStudentManagement/teacherUserManagement";
import AddCourse from "./Components/TeacherComponents/TeacherCourse/AddCourse";
import ViewCourses from "./Components/UserComponets/Home/Home";
import CourseDetails from "./Components/CourseComponent/CourseDetails";
import TeacherDash from "./Components/TeacherComponents/TeacherDash/TeacherDash";
import TeacherViewCourse from "./Components/TeacherComponents/TeacherCourse/ViewCourse";
import TeacherProfile from "./Components/TeacherComponents/TeacherProfile/teacherProfile";
import TeacherUploadProfilePhoto from './Components/TeacherComponents/TeacherProfile/teacherProfile';

// import { getCourseById } from './Components/CourseComponent/Course';
import usergetUserDetails from "./Components/CourseComponent/CourseDetails";
// import CourseDetails from './Components/CourseComponent/CourseDetails';
import Home from "./Pages/UserPages/HomePage";
import Login from "./Pages/UserPages/LoginPage";
// import UserLoginwithOTP from "./Components/UserComponets/Login/Login";
import Loginwithotp  from "./Components/UserComponets/Login/loginwithotp";
import Otp from "./Components/UserComponets/Login/otp";
import ProfilePage from "./Pages/UserPages/ProfilePage";
import TeacherSpec from "./Components/TeacherComponents/TeacherSpec/TeacherSpec"

import Signup from "./Pages/UserPages/SignupPage";
import TeacherHome from "./Pages/TeacherPages/TeacherHomepage";
import ScheduleDemo from "./Components/CourseComponent/CourseDetails";
import Pricing from "./Components/CourseComponent/Pricing";
import VideoRoom from "./Components/TeacherComponents/VideoRoom";
import Payment from './Components/UserComponets/Payment/Payment'
import Gallery from './Components/UserComponets/Gallery/Gallery'
import TeacherAvailabilityPage from "./Components/TeacherComponents/TeacherAvailability/TeacherAvailability.js";
import CourseTeacherSelection from "./Components/UserComponets/CourseTeacherSelection/CourseTeacherSelection";
import AdminCourseManagement from "./Components/AdminComponents/AdminCourses/AdminCourses";
import Notifications from "./Components/UserComponets/Notification/Notifications";
import EnrolledCourses from "./Components/UserComponets/Profile/EnrolledCourse";
import TeacherChat from "./Components/TeacherComponents/TeacherChat/TeacherChat";
import StudentChat from "./Components/UserComponets/StudentChat/StudentChat";
import EnrolledUsersList from "./Components/AdminComponents/AdminEnrolledUsers/AdminEnrolledUsers.js";
import GetPricingDetails from "./Components/AdminComponents/CoursePricing/AdminViewPricing.js";
import AdminBookingLists from "./Components/AdminComponents/AdminBookingList/AdminBookingLists.js";
import TeacherProfilePictureUpload from "./Components/TeacherComponents/Header/TeacherProfilePictureUpload.js";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* <Route exact path="/login" element={<Login />} /> */}
        <Route path="/loginwithotp" element={<Loginwithotp />} />
        <Route path="/" element={<Home />} />
        <Route path="/Profile" element={<ProfilePage />} />  
        <Route path="/signup" element={<Signup />} />
        <Route path="/CourseDetails" element={<CourseDetails />} />
        <Route path="/EnrolledCourses" element={<EnrolledCourses/>} />
        <Route path="/StudentChat" element={<StudentChat/>} />

        <Route path="/adminLogin" element={<AdminPage1 />} />
        <Route path="/adminSignUp" element={<AdminSignUp />} />
        <Route path="/adminHome" element={<AdminDash />} />
        <Route path="/users" element={<Usermanagement />} />
        <Route path="/teachers" element={<AdminTeacherManagement />} />

        <Route path="/adminAddUser" element={<AdminaddUsers />} />
        <Route path="/updateUser/:id" element={<UpdateUser />} />
        <Route path="/adminAddTeacher" element={<AdminAddTeacher />} />
        <Route path="/adminGetTeachers" element={<AdminGetTeachers />} />
        <Route path="/AdminTeacherManagement" element={<AdminTeacherManagement />}/>
        <Route path="/adminUpdateEnrollmentPricing" element={<AdminCoursePrice/>} />
        <Route path="/adminCourseManagement" element={<AdminCourseManagement />} />
        <Route path="/roleselection" element={<RoleSelection />} />
        <Route path="/getEnrolledUsersList" element={<EnrolledUsersList />} />
        <Route path="/adminGetPricingDetails" element={<GetPricingDetails />} />
        <Route path="/adminGetBookingLists" element={<AdminBookingLists />} />


        {/* <Route path = '/teacher'element={<Login/>}/> */}
        <Route path="/teacherLogin" element={<TeacherLogin />} />
        
        <Route path="/teacherProfilePictureUpload" element={<TeacherProfilePictureUpload />} />
        <Route path="/teacher-data" element={<FetchteacherData />} />
        <Route path="/teacherhome" element={<TeacherDash />} />
        <Route path="/TeacherGetAllUsers" element={<TeacherUserManagement />} />
        <Route path="/teacherViewCourse" element={<TeacherViewCourse />} />
        <Route path="/teacherProfile" element={<TeacherProfile/>} />
        <Route path="/teacherUploadProfilePhoto" element={<TeacherUploadProfilePhoto/>} />
        {/* <Route path="/teacherAvailability" element={<TeacherAvailabilityPage/>} /> */}
        <Route path="/teacherSpec" element={<TeacherSpec/>} />
        <Route path="/teacherChat" element={<TeacherChat/>} />



        <Route path="/addCourse" element={<AddCourse />} />
        <Route path="/ViewCourses" element={<ViewCourses />} />
        {/* <Route path="/courses/:courseId" element={<getCourseById/>} /> */}
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        {/* <Route path="/courses/:courseId?userId=:userId" element={<CourseDetails />}/> */}
        <Route path="/select-course-teacher" element={<CourseTeacherSelection />} /> 
        {/* <Route path="/schedule-demo" element={<ScheduleDemo />} /> */}
        <Route path="/videoRoom/:teacherId/:appointmentId" element={<VideoRoom />} />
        <Route path="/user:userId" element={<usergetUserDetails />} />
        <Route path = '/otp' element={<Otp/>} />
        {/* <Route path="/userLoginWithOTP" element={<UserLoginwithOTP />} /> */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/gallery" element={< Gallery />}/>
        <Route path="/notifications" element={< Notifications />}/>
    

      </Routes>
    </Router>
  );
}

export default App;
