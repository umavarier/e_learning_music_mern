const mongoose=require('mongoose');

const User= new mongoose.Schema({
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
    role: {
        type: Number,
        default: 0 // 0 = user, 1 = admin
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
    image:
    {
        type:String
    },
    certificate: {
        type: String
    },
    credentials:
    {
        type: String
    }
},
{ 
    collection:'users'
})
const model=mongoose.model('UserData',User);

module.exports=model