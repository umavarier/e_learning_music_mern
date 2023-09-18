const { json } = require('express');
const User=require('../model/userMode');
const jwt = require('jsonwebtoken')

    const adminLoginn = async(req,res)=>{      
        try{
            let adminData=req.body;
            let adminEmail="admin@gmail.com";
            let password="admin123";
            if(adminEmail==adminData.email && password== adminData.password){          
                res.json({status:"ok",admin:true})
            }else{
                res.json({status:"not Ok",error:"admin details invalid"})
            }
        }catch(err){
             res.json({status:"error",error:"oops catch error"})
        }
    };

    const getAllUsers = async(req,res)=>{        
        try{
            let users= await User.find();
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

    const deleteUsers = async(req,res)=>{
        try{
               
                const deletUser= await User.deleteOne({_id:req.params.id});
                console.log("delete user")
                res.json({status:"ok",message:"user deleted"})
        }catch(err){
                console.log("user not found")
                res,json({status:"error",error:"something went wrong"})
        }
    };

    const getUserDetails = async(req,res)=>{
        try{
            
            const user= await User.findOne({_id:req.params.id});
            if(!user){
                res.json({status:"error",message:"user not found"})
            }
            else{
                res.json({status:"ok",message:"user found",userData:user})
            }
        }catch(err){
                console.log("user not found with the edit id ");
                res.status(400).json({status:"error",message:"oops errror"})
        }

    };

   const updateUsers = async(req,res)=>{
        try{
            const {userName,email}=req.body;
            let user=await User.findOne({email:email})           
            if(user){
                        const update=await User.findOneAndUpdate({_id:req.params.id},
                        {
                        $set:{
                            userName,
                            email
                        }                       
                    },
                    {new: true}
                    );
                    console.log(update,"user updated")
                res.json({status:"ok",message:"user updated",userexists:false})
            }else{
                console.log("user already exists")
                res.json({status:"error",message:"user already exists",userexists:true})
            }
        } catch(err){
            console.log("error123")
            res.json({status:"error",error:"update error"})
        }
    };

    const adminSearchUser = async(req,res)=>{
        const username=req.params.userkey;
        try{
            const users=await User.find({
                "$or": [
                    {
                        userName: { $regex: username }
                    },
                    {
                        email: { $regex: username }
                    }
                ]
            })
            res.json({status:"ok",message:"user found",users})
        } catch(err)
        {
            res.json({status:"error",message:"no user found"})
        }
    };

    module.exports = {
        adminLoginn,
        getAllUsers,
        deleteUsers,
        getUserDetails,
        updateUsers,
        adminSearchUser,
    }