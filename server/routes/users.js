var express = require('express');
var router = express.Router();

const { userSignup, userLogin, verifyUserToken,userImageUpdate , viewTeachers, getCourseDetails, usergetUserDetails, userLoginwithOtp, getPricing, getTeachersInCourse, getCourseForSignup, userGetCourses, userGetTeachers,userGetTeachersTiming,bookDemo,getNotifications,sendNotifications, checkAppointmentTiming} = require('../controllers/userController');
const { adminLoginn,getAllUsers,deleteUsers,updateUsers,getUserDetails,adminSearchUser,adminAddTeacher, adminGetTeachers, adminBlockTeacher, getEnrollmentPricing, updateEnrollmentPricing } = require('../controllers/adminControllers');

const {TeacherGetAllUsers, } = require('../controllers/TeacherController')
// const {addCourse, viewCourses, getCourseById} = require('../controllers/courseController')
const { viewCourses, getCourseById} = require('../controllers/courseController')
const { uploadSingleFile } = require('../util/multer1');
const {authenticateTeacher} = require('../midleware/authTeacher'); 
const {scheduleDemo , getAppointmentDetails} = require('../controllers/appointmentController')
const {userotpsend} = require('../controllers/userController')
const {auth} = require('../midleware/auth');
const {processPayment}= require ('../controllers/userController');


/* GET home page. */
router.post('/signup',userSignup);
router.post('/login',userLogin);
router.post('/sendotp',userotpsend)
router.post('/loginOtp', userLoginwithOtp)
// router.get('/user', auth, usergetUserDetails);
router.get('/user/:userId', usergetUserDetails);
// router.post('/verifyUserToken',verifyToken)
router.post('/verifyUserToken',verifyUserToken);
router.post('/adminLogin',adminLoginn)  
router.get('/getallusers',getAllUsers)
router.delete('/deleteUser/:id',deleteUsers)        
router.get('/admineditUser/:id',getUserDetails)
router.put('/updateUser/:id',updateUsers);
router.post('/updateImage/:id',uploadSingleFile,userImageUpdate)
router.get('/searchUser/:userkey',adminSearchUser)
router.post('/adminAddTeacher',adminAddTeacher)
router.get('/adminGetTeachers',adminGetTeachers)
router.patch('/adminToggleBlockTeacher/:teacherId', adminBlockTeacher)
router.get('/admingetEnrollmentPricing',getEnrollmentPricing)
router.post('/adminUpdateEnrollmentPricing',updateEnrollmentPricing)
// router.get('/courses/:id',getCourseDetails);
// router.get('/getCourseDetails/:id',getCourseDetails)
// router.get('/getCourseDetails/:courseId', getCourseById)

router.get('/TeacherGetAllUsers',TeacherGetAllUsers)
router.get('/viewCourses',viewCourses)
// router.post('/addCourse', addCourse)
router.get('/viewTeachers', viewTeachers)
router.get('/getTeachersInCourse',getTeachersInCourse)
router.get('/userGetCourses', userGetCourses)
router.get('/userGetTeachers/:courseId', userGetTeachers)
router.get('/userGetTeachersTiming/:teacherId/availableTimings',userGetTeachersTiming)
router.post('/book-demo',auth, bookDemo)
router.get('/getNotifications/:userId', getNotifications)
router.post('/sendNotifications',auth, sendNotifications)


router.post('/schedule-demo',scheduleDemo);
// router.get('/mentDetails', getAppointmentDetails)
router.get('/getPricing', getPricing)
router.post('/process-payment', processPayment)
router.get('/getCourseForSignup',getCourseForSignup)
router.get('/check-appointment-timing/:appointmentId',checkAppointmentTiming)
module.exports = router;
