const mongoose=require('mongoose');

const teacherSchema =  new mongoose.Schema({
    userName : {
        type : String,
        required : true,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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
    description: {
        type: String,
    },
    headline: {
        type: String,
    },  
    certificate:{
        type: String,
    },
    isBlock:
    {
        type : Boolean,
        default : false,
    }
})

const Teacher =  mongoose.model('Teacher', teacherSchema)
module.exports = Teacher;