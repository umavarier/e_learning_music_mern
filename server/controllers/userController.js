const express = require('express');
const User = require('../model/userMode');
const Course = require('../model/courseModel')
const Teacher = require('../model/teacherModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs')
const storage = require('../util/multer')
const directoryPath = 'public/'

//   const userSignup= async (req, res) => {
//         try {
//                 let userEmail = req.body.email
//                 const users = await User.findOne({ email: userEmail })
//                 if (users) {
//                     res.json({ status: "userRegistered", error: "user already registered" })
//                 }
//                 else 
//                 {
//                     const hashPassword = await bcrypt.hash(req.body.password, 10)
//                     const user = await User.create({
//                         userName: req.body.userName,
//                         email: req.body.email,
//                         password: hashPassword
//                     })
//                     res.json({ status: "ok", _id: user._id, name: user.userName })
//                 }

//             } catch (err) {
//                 console.log("err", err)
//                 res.json({ status: 'error', error: "Duplicate email" })
//             }
//         }




const userSignup = async (req, res) => {
  try {
    const { userName, email, password, phoneNumber, isTeacher, description, headline, certificate } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      userName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    // If the user is a teacher, save additional data to the Teacher model
    if (isTeacher) {
      const teacher = new Teacher({
        userName,
        email,
        password: hashedPassword,
        role: 1,
        isTeacher,
        description,
        headline,
        certificate,
      });

      await teacher.save();
    }

    // Save the user data
    await user.save();

    return res.status(201).json({ status: 'ok', message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password, isTeacher } = req.body;

    if (isTeacher) {
      // Check in the teacher database
      const teacher = await Teacher.findOne({ email });

      if (teacher) {
        const passwordValid = await bcrypt.compare(password, teacher.password);

        if (passwordValid) {
          const token = jwt.sign(
            {
              name: teacher.userName,
              email: teacher.email,
              id: teacher._id,
              role: 1, // Set the role as 'teacher' for teachers
            },
            'secret123',
            {
              expiresIn: '7d',
            }
          );

          return res.json({
            status: 'ok',
            message: 'Login Success',
            user: token,
            role: 1,
          });
        }
      }
    } else {
      // Check in the user database
      const user1 = await User.findOne({ email });

      if (user1) {
        const passwordValid = await bcrypt.compare(password, user1.password);

        if (passwordValid) {
          const token = jwt.sign(
            {
              name: user1.userName,
              email: user1.email,
              id: user1._id,
              role: 0,
            },
            'secret123',
            {
              expiresIn: '7d',
            }
          );

          return res.json({
            status: 'ok',
            message: 'Login Success',
            user: token,
            role: 0,
          });
        }
      }
    }

    res.json({ status: 'error', error: 'Invalid Credentials', user: false });
  } catch (err) {
    res.json({ status: 'error', error: 'Oops, catch error' });
    console.log(err);
  }
};


  
  
      const verifyToken= async (req, res) => {
          try {

              const decodedToken = jwt.verify(req.body.Token, 'secret123')
              const user = await User.findOne({ email: decodedToken.email });

              if (user.image) {
                  user.image = `http://localhost:4000/${user.image}`
              }
              else {
                  user.image = `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`
              }
              return res.status(200).json({ message: "token valid", user, token: true });

          } catch (err) {
              res.json({ status: 'error', error: "invalid token", token: false })
          }
      }
      const upload = multer ({ storage : multer })
      const userImageUpdate = async (req, res) => {
          try {
            let Token = req.params.id;
            let token2 = JSON.parse(Token);
            console.log(token2);
            const decodedToken = jwt.verify(token2, 'secret123');
            console.log(decodedToken);
            const user = await User.findOne({ _id: decodedToken.id });
            if (user) {
              // Check if there are uploaded files
              if (!req.files || !req.files.image) {
                return res.status(400).json({ status: 'error', message: 'No image uploaded' });
              }
        
              // Update the user's image field in the database
              const update = await User.updateOne(
                { _id: decodedToken.id },
                {
                  $set: {
                    image: req.files.image[0].filename,
                  },
                }
              );  
        
              const image = `http://localhost:4000/uploads/${req.files.image[0].filename}`;
              return res.status(200).json({ message: 'Image updated successfully', image });
            } else {
              return res.json({ status: 'error', message: 'User not found' });
            }
          } catch (err) {
            res.status(500).json({ status: 'error', message: 'Internal server error' });
          }
        };
        
        module.exports = { userImageUpdate, upload };

    const viewTeachers = async (req, res) => {
        try {
          // Query your database to fetch the list of users who are teachers
          const teachers = await User.find({ isTeacher: true });
      console.log(teachers+"teachers")
          // Send the list of teachers as a JSON response
          res.json(teachers);
        } catch (error) {
          console.error('Error fetching teachers:', error);
          res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
      };
     const getCourseDetails=  async (req, res) => {
        try {
          const courseId = req.params.id;
          const course = await Course.findById(courseId);
      
          if (!course) {
            return res.status(404).json({ message: 'Course not found' });
          }
      
          res.status(200).json(course);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        }
      };
      
module.exports = {
    userSignup,
    userLogin,
    verifyToken,
    userImageUpdate,
    viewTeachers,
    getCourseDetails
}