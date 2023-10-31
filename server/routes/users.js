var express = require('express');
var router = express.Router();

const multerConfig = require('../util/multerConfig');
const { userSignup, userLogin, verifyUserToken,userImageUpdate , viewTeachers, getCourseDetails, usergetUserDetails, userLoginwithOtp, getPricing, getTeachersInCourse, getCourseForSignup, userGetCourses, userGetTeachers,userGetTeachersTiming,bookDemo,getNotifications,sendNotifications, checkAppointmentTiming, userGetAppointmentTime, fetchUserProfilePhoto, getEnrolledCourses, getPaymentHistory} = require('../controllers/userController');
const { adminLoginn,getAllUsers,deleteUsers,updateUsers,getUserDetails,adminSearchUser,adminAddTeacher, adminGetTeachers, adminBlockTeacher, getEnrollmentPricing, updateEnrollmentPricing, adminGetCourseList, adminEditCourse, adminDeleteCourse } = require('../controllers/adminControllers');

const {TeacherGetAllUsers, } = require('../controllers/TeacherController')
// const {addCourse, viewCourses, getCourseById} = require('../controllers/courseController')
const { viewCourses, getCourseById} = require('../controllers/courseController')
const { uploadSingleFile } = require('../util/multer1');
const {uploadCertificate} = require ('../util/multerConfig')
const {authenticateTeacher} = require('../midleware/authTeacher'); 
const {scheduleDemo , getAppointmentDetails} = require('../controllers/appointmentController')
const {userotpsend} = require('../controllers/userController')
const {auth} = require('../midleware/auth');
const {processPayment}= require ('../controllers/userController');
const { adminSignUp } = require('../controllers/adminControllers');


/* GET home page. */
router.post('/signup', uploadCertificate.single('certificate'),userSignup);
router.post('/login',userLogin);
router.post('/sendotp',userotpsend)
router.post('/loginOtp', userLoginwithOtp)
// router.get('/user', auth, usergetUserDetails);
router.get('/user/:userId', usergetUserDetails);
// router.post('/verifyUserToken',verifyToken)
router.post('/verifyUserToken',verifyUserToken);
router.post('/adminSignUp' ,adminSignUp)
router.post('/adminLogin',adminLoginn)  
router.get('/getallusers',getAllUsers)
router.delete('/deleteUser/:id',deleteUsers)        
router.get('/admineditUser/:id',getUserDetails)
router.put('/updateUser/:id',updateUsers);
router.post('/updateImage/:id',multerConfig.logRequestMiddleware, multerConfig.uploadProfilePhoto.single('image'),userImageUpdate)
router.get('/fetchUserProfilePhoto/:userId',fetchUserProfilePhoto)
router.get('/searchUser/:userkey',adminSearchUser)
router.post('/adminAddTeacher',adminAddTeacher)
router.get('/adminGetTeachers',adminGetTeachers)
router.patch('/adminToggleBlockTeacher/:teacherId', adminBlockTeacher)
router.get('/admingetEnrollmentPricing',getEnrollmentPricing)
router.post('/adminUpdateEnrollmentPricing',updateEnrollmentPricing)
router.get('/adminGetCourseList',adminGetCourseList)
router.put('/adminEditCourse/:id', adminEditCourse)
router.delete('/adminDeleteCourse/:id',adminDeleteCourse)
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
router.get('/userGetAppointmentTime/:userId',userGetAppointmentTime)
router.get('/enrolled-courses/:id',getEnrolledCourses)
router.get('/getPaymentHistory/:id',getPaymentHistory);
module.exports = router;
