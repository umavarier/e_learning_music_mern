const mongoose=require('mongoose');
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRECT_KEY = "abcdefghijklmnop"


const userSchema= new mongoose.Schema({
    userName:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true,
        unique:true
    },                       
    password:
    {
        type:String,
        required:true
    },
    enrolledCourses: [
        {
          course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
          },
          instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher', 
          },    
          day: {
            type: String,
          },
          time: {
            type: String,
          },      
        },
      ],
    enrolledCoursesTiming: [
        {
          course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
          },
          instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher', 
          },
          day: {
            type: String,
          },
          time: {
            type: String,
          },
        },
      ],
    role: {
        type: Number,
        default: 0 // 0 = user, 1 = teacher
        },
    isTeacher:{
        type : Boolean,
        required : true,
        default : false
    },
    description:{
        type : String
    },
    headline: {
        type : String
    },
    isBlock:{
      
        type : Boolean,
        default : false
    },
    image:
    {
        type: String
    },
    certificate:
     {
        type: String
    },
    enrollmentFee: 
    {
        type: Number,
       
    },
    credentials:
    {
        type: String
    },
    tokens : [
        {
            token : {
                type: String,
                required :true,
            }
        }
    ]
},
{ 
    collection:'users'
})

userSchema.methods.generateAuthtoken = async function(){
    try {
        console.log("generated")
        let newtoken = jwt.sign({_id:this._id , userName : this.userName, image:this.image, email:this.email},process.env.JWT_SECRET,{
            expiresIn:"1d"
        });
        console.log("newtoken ", newtoken)
        this.tokens = this.tokens.concat({token:newtoken});
        await this.save();
        return newtoken;
    } catch (error) {
        // res.status(400).json(error)
        throw error;
    }
}

const User=mongoose.model('User',userSchema);

module.exports=User;