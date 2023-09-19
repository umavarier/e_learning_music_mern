var express = require('express');
var router = express.Router();

const { userSignup, userLogin, verifyToken,userImageUpdate , viewTeachers, getCourseDetails} = require('../controllers/userController');
const { adminLoginn,getAllUsers,deleteUsers,updateUsers,getUserDetails,adminSearchUser } = require('../controllers/adminControllers');
const {TeacherGetAllUsers} = require('../controllers/TeacherController')
const {addCourse, viewCourses} = require('../controllers/courseController')
const { uploadSingleFile } = require('../util/multer');

/* GET home page. */
router.post('/signup',userSignup);
router.post('/login',userLogin);
router.post('/verifyUserToken',verifyToken)
router.post('/adminLogin',adminLoginn)
router.get('/getallusers',getAllUsers)
router.delete('/deleteUser/:id',deleteUsers)        
router.get('/admineditUser/:id',getUserDetails)
router.put('/updateUser/:id',updateUsers);
router.post('/updateImage/:id',uploadSingleFile,userImageUpdate)
router.get('/searchUser/:userkey',adminSearchUser)
// router.get('/courses/:id',getCourseDetails);
router.get('/getCourseDetails/:id',getCourseDetails)

router.get('/TeacherGetAllUsers',TeacherGetAllUsers)
router.get('/viewCourses',viewCourses)
router.post('/addCourse', addCourse)
router.get('/viewTeachers', viewTeachers)

module.exports = router;
