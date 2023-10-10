const { json } = require('express');
const User=require('../model/userModel');
const jwt = require('jsonwebtoken')
const Teacher = require('../model/teacherModel')
const Course = require('../model/courseModel')
const bcrypt = require('bcrypt');
const multer = require('../util/multer1');


const teacherLogin = async (req, res) => {
  console.log("test")
  const { email, password } = req.body;
  console.log("body   "+req.body)

  try {
    // Check if a teacher with the provided email exists
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    if (teacher.isBlock) {
      console.log("is blocked??" +teacher.isBlock)
      return res.status(403).json({ error: 'Teacher is blocked' });     
    }

    // Verify the provided password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a token for authentication
    const token = jwt.sign({ id: teacher._id, userName: teacher.userName, role:teacher.role }, 'secret123', {
      expiresIn: '1d', 
    });

    // Send the token in the response
    console.log("Teacher  "+teacher)
    res.status(200).json({ token, teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const teacherData = async (req, res) => {
  console.log("hello")
  try {
    // Get the teacher ID from the token
    const teacherId = req.teacher.id;
    console.log("teacher:  "+teacherId)

    // Fetch the teacher data from the database using the teacher ID
    const teacher = await Teacher.findById(teacherId);
    if(!teacherId) {
      return res.status(401).json({error: 'Unauthorized: Invalid or expired toke'})
    }
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    console.log("test123")

    // Return the teacher data
    res.status(200).json({teacher});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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

// const teacherViewCourse = async (req, res) => {
  
//     try {
//       const courses = await Course.find();
//       console.log("courses   ::"+courses);
//       res.status(200).json(courses);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };
  
const teacherViewCourse = async(req,res) => {
  console.log("tvc")
  try {
    const teacherId = req.query.teacherId; // Get the teacherId from the query parameter
    console.log("teacher   "+teacherId)

    if (!teacherId || !mongoose.isValidObjectId(teacherId)) {
      return res.status(400).json({ message: 'Invalid teacherId' });
    }

    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Fetch courses for the specified teacher
    const courses = await Course.find({ instructorId: teacherId });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

}

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads'); // Specify the upload directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
//   },
// });

// const upload = multer({ storage: storage });


const teacherUploadProfilePhoto = async (req, res) => {  
  console.log("here",req.body)
    try {
      // const file = req.file;
      // if (!file) {
      //   return res.status(400).json({ error: 'No file uploaded' });
      // }

      // const filePath = file.path;
      // Access the uploaded file using req.file
      const uploadedFilePath = req.file.path;
  
      console.log(uploadedFilePath)
      // Find the teacher by ID or any unique identifier
      // console.log("req.body " + req.body)
      const teacherId = req.body.teacherId; // Assuming you have the teacher's ID in the request object
      const teacher = await Teacher.findById(teacherId);
      
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      // Update the teacher's profilePhoto field with the uploaded file path
      teacher.profilePhoto = uploadedFilePath;
      console.log("teacher  "+teacher)
  
      // Save the updated teacher object in the database
      await teacher.save();
  
      res.status(200).json({ message: 'Profile photo uploaded successfully' });
    } catch (error) {
      console.error('Error uploading profile photo', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  


module.exports = {
    TeacherGetAllUsers,
    teacherLogin,
    teacherData,
    teacherViewCourse,
    teacherUploadProfilePhoto,
    
}
