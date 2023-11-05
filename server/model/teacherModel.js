const mongoose=require('mongoose');
const timingSchema = new mongoose.Schema({
    from: String,
    to: String,
  });

const teacherSchema =  new mongoose.Schema({
    userName : {
        type : String,
        required : [true, 'userName is required']
    },
    email: {
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: Number,
        default: 0 // 0 = user, 1 = admin
    },
    isTeacher:{
        type : Boolean,
        required : true,
        default : false
    },
    isTeacherApproved: {
      type: Boolean,
      required : true,
      default : false
    },
    isTeacherRejected: {
      type : Boolean,
      default : false,
    },
    specializations: [
        {
            type: String,
            required:[true, 'Specialization is required'] ,
        },
    ], 
    // headline: {
    //     type: String,
    // },  
    certificate:{
        type: String,
    },
    isBlock:
    {
        type : Boolean,
        default : false,
    },
    profilePhoto: 
    {
        type: String,
    },
    videos: [
        {
          url: String, 
        },
      ],
    
    courses: 
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    availableTimings: [
        {
          dayOfWeek: {
            type: String,
            required: true,
          },
          startTime: {
            type: String,
            required: true,
          },
          endTime: {
            type: String,
            required: true,
          },
        },
      ],
})

const Teacher =  mongoose.model('Teacher', teacherSchema)
module.exports = Teacher;