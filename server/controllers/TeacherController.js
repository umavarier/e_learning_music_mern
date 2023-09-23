const { json } = require('express');
const User=require('../model/userMode');
const jwt = require('jsonwebtoken')
const Teacher = require('../model/teacherModel')
const bcrypt = require('bcrypt');

const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the teacher by email
    const teacher = await Teacher.findOne({ 'user.email': email }).populate('user');

    if (!teacher) {
      return res.status(404).json({ status: 'error', message: 'Teacher not found' });
    }

    // Check if the provided password matches the hashed password in the User model
    const passwordValid = await bcrypt.compare(password, teacher.user.password);

    if (!passwordValid) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Create a JWT token for the teacher
    const token = jwt.sign(
      {
        id: teacher._id,
        email: teacher.user.email,
        role: 'teacher',
      },
      'secret123', // Replace with your own secret key
      { expiresIn: '7d' }
    );

    return res.status(200).json({ status: 'ok', message: 'Teacher login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const TeacherGetAllUsers = async(req,res)=>{        
    try{
        let users= await User.find();
        console.log(users+'userslist')
        if(users){               
            res.json({status:"ok",users:users})
        }else{
            console.log("users not found");
            res.json({status:"error",users:"users not found"})
        }
    } catch(err) {
        res.json({status:"error",error:"Data not find"})
        console.log(err);
    }
};

module.exports = {
    TeacherGetAllUsers,
    teacherLogin,
}
