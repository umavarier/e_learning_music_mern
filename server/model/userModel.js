const mongoose=require('mongoose');
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRECT_KEY = "abcdefghijklmnop"


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
    image:
    {
        type:String
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

User.methods.generateAuthtoken = async function(){
    try {
        console.log("generated")
        let newtoken = jwt.sign({_id:this._id},"secret123",{
            expiresIn:"1d"
        });
        console.log("newtoken ", newtoken)
        this.tokens = this.tokens.concat({token:newtoken});
        await this.save();
        return newtoken;
    } catch (error) {
        res.status(400).json(error)
    }
}

const model=mongoose.model('UserData',User);

module.exports=model