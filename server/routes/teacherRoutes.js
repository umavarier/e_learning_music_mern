const express = require('express');
const router = express.Router();
const multer = require('../util/multer1');
const multerConfig = require('../util/multerConfig');
const { uploadSingleFile } = require('../util/multer1');
const {verifyToken} = require('../midleware/verifyToken')
const {authenticateTeacher} = require('../midleware/authTeacher')
// const teacherController = require('../controllers/TeacherController');
const {teacherLogin, teacherData, teacherUploadProfilePhoto, addAvailability} = require('../controllers/TeacherController')
const {teacherViewCourse} = require('../controllers/TeacherController')

router.post('/teacherLogin', teacherLogin);
router.get('/teacher-data',authenticateTeacher, teacherData);
router.get('/teacherViewCourse', teacherViewCourse);
router.post('/Course',)
router.post('/teacherUploadProfilePhoto', multerConfig.logRequestMiddleware, multerConfig.uploadProfilePhoto.single('profilePhoto'), teacherUploadProfilePhoto)
router.post('/addAvailability',authenticateTeacher,  addAvailability) 

module.exports = router;
