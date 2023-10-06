const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const {addCourse, viewCourses, getCourseById} = require('../controllers/courseController')


router.get('/getCourseById/:courseId', getCourseById);
// router.get('/viewCourses',viewCourses)
// router.post('/addCourse', addCourse)



module.exports = router;
