const { json } = require('express');
const User=require('../model/userMode');
const jwt = require('jsonwebtoken')

const TeacherGetAllUsers = async(req,res)=>{        
    try{
        let users= await User.find();
        console.log(users+'ohyeah')
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
}
