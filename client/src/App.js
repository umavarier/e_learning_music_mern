import React from 'react'
import { GoogleOAuthProvider , GoogleLogin } from '@react-oauth/google';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import AdminDash from './Components/AdminComponents/Dashboard/AdminDash'
import AdminaddUsers from './Components/AdminComponents/Users/AdminaddUsers'
import UpdateUser from './Components/AdminComponents/Users/UpdateUser'
import Usermanagement from './Components/AdminComponents/Users/Usermanagement'
import AdminPage1 from './Pages/AdminPages/AdminPage1'
import TeacherUserManagement from './Components/TeacherComponents/TeacherStudentManagement/teacherUserManagement'
import AddCourse from './Components/TeacherComponents/TeacherCourse/AddCourse'
import ViewCourses from './Components/TeacherComponents/TeacherCourse/ViewCourse'

import Home from './Pages/UserPages/HomePage'
import Login from './Pages/UserPages/LoginPage'
import ProfilePage from './Pages/UserPages/ProfilePage'
import Signup from './Pages/UserPages/SignupPage'
import TeacherHome from './Pages/TeacherPages/TeacherHomepage';


function App() {
  return (
    
       <Router>
        
    <Routes>
    <Route exact path="/login"  element={<Login/>}/>
     <Route  path="/"  element={<Home/>}/>
     <Route  path="/Profile" element={<ProfilePage/>} />
    <Route  path="/signup"  element={<Signup/>}/>

    <Route path='/admin' element={<AdminPage1/>} />

    <Route path='/adminHome' element={<AdminDash/>} />
    <Route path='/users' element={<Usermanagement/>} />

    <Route path='/adminAddUser' element={<AdminaddUsers/>}/>
    <Route path='/updateUser/:id' element={<UpdateUser/>} />

    <Route path = '/teacher'element={<TeacherHome/>}/>
    <Route path = '/TeacherGetAllUsers' element={<TeacherUserManagement/>} />

    <Route path="/addCourse" element={<AddCourse/>} />
    <Route path="/ViewCourses" element={<ViewCourses/>} />
    </Routes>
   </Router>
 
  
  )
}

export default App