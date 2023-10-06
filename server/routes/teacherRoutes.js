const express = require('express');
const router = express.Router();
const {verifyToken} = require('../midleware/verifyToken')
const {authenticateTeacher} = require('../midleware/authTeacher')
// const teacherController = require('../controllers/TeacherController');
const {teacherLogin, teacherData} = require('../controllers/TeacherController')
const {teacherViewCourse} = require('../controllers/TeacherController')

router.post('/teacherLogin', teacherLogin);
router.get('/teacher-data',authenticateTeacher, teacherData);
router.get('/teacherViewCourse', teacherViewCourse)
router.post('/teacherAddCourse',)

module.exports = router;
