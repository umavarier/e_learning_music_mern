const express = require('express');
const router = express.Router();
const multer = require('../util/multer1');
const multerConfig = require('../util/multerConfig');
const { uploadSingleFile } = require('../util/multer1');
const {verifyToken} = require('../midleware/verifyToken')
const {authenticateTeacher} = require('../midleware/authTeacher')
// const teacherController = require('../controllers/TeacherController');
const {teacherLogin, teacherData, teacherUploadProfilePhoto, addAvailability,getAppointments, getNotifications, getSenderEmail,fetchProfilePhoto,saveVideoUrl,getTeacherVideos, getTeacherSpec, getEnrolledStudentsByCourse, fetchTeacherNamesForCourse, addCourseTimingOfStudent, getCourseTimings, checkTeacherProfilePicture, teacherAppointmentsList, getTeacherAppointments, cancelTeacherAppointment, updateSessionTiming, getTeacherAvailabilityList, cancelTeacherAvailabilities} = require('../controllers/TeacherController')
const {teacherViewCourse} = require('../controllers/TeacherController')

router.post('/teacherLogin', teacherLogin);
router.get('/checkTeacherProfilePicture',authenticateTeacher,checkTeacherProfilePicture)
router.get('/teacher-data',authenticateTeacher, teacherData);
router.get('/teacherViewCourse', teacherViewCourse);
router.post('/Course',)
router.post('/teacherUploadProfilePhoto', multerConfig.logRequestMiddleware, multerConfig.uploadProfilePhoto.single('profilePhoto'), teacherUploadProfilePhoto)
router.post('/addAvailability',authenticateTeacher,  addAvailability) 
router.get('/teacherGetAppointments/:teacherId',getAppointments)
router.get('/teacherGetNotifications/:teacherId', getNotifications)
router.get('/getSenderEmail/:notificationId',getSenderEmail);
router.get('/fetchProfilePhoto/:teacherId',authenticateTeacher, fetchProfilePhoto)
router.post('/saveVideoUrl/:teacherId',authenticateTeacher,saveVideoUrl)
router.get('/getTeacherVideos/:teacherId', authenticateTeacher, getTeacherVideos)
router.get('/getTeacherSpec/:teacherId',authenticateTeacher,getTeacherSpec)
router.get('/getEnrolledStudentsByCourse/:courseId',getEnrolledStudentsByCourse)
router.get('/fetchTeacherNamesForCourse/:courseId',fetchTeacherNamesForCourse)
router.post('/addCourseTimingOfStudent/:studentId/:courseId',addCourseTimingOfStudent)
router.get('/getCourseTimings/:courseId/:studentId',getCourseTimings)
router.get('/getTeacherAppointments/:teacherId',authenticateTeacher, getTeacherAppointments)
router.delete('/cancelTeacherAppointment/:appointmentId',authenticateTeacher,cancelTeacherAppointment)
router.put('/updateSessionTiming/:userId/:courseId',authenticateTeacher, updateSessionTiming)
router.get('/getTeacherAvailabilityList/:teacherId',authenticateTeacher, getTeacherAvailabilityList)
router.delete('/cancelTeacherAvailabilities/:availabilityId',authenticateTeacher,cancelTeacherAvailabilities)

module.exports = router;
