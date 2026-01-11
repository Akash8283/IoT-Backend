// user model
const { findOne } = require('../models/alertsModel');
const users = require('../models/userModel')
const jwt = require('jsonwebtoken')
// register user
exports.registerController = async(req,res)=>{
    console.log("Inside registerController");
    const {username,email,password} = req.body
    console.log(username,email,password);
    try{
        // check existing user
        const existingUser = await users.findOne({email})
        if (existingUser) {
            res.status(409).json("User Already Exists")
        }
        else{
            const newUser = new users({
                username,email,password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

// Login user
exports.loginController = async(req,res)=>{
    console.log("loginUserController");
    const {email,password} = req.body
    try{
        const existingUser = await users.findOne({email})
        if (existingUser) {
            if (password == existingUser.password) {
                // generate token
                const token = jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.JWTSECRET)
                res.status(200).json({user:existingUser,token})
            }
            else{
                res.status(401).json("Incorrect Email or Password")
            }
        }
        else{
            res.status(404).json("Account does not exists")
        }
    }catch(err){
        console.log(err);
        res.status(500).json("Something went wrong")
    }
    
}

// get all users (adddevice)
exports.getAllUserController = async (req,res)=>{
    console.log("inside getAllUserController");
    try{
        const allUsers = await users.find({role:{$ne:"admin"}})
        res.status(200).json(allUsers)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

// get all users (manageusers)
exports.UserController = async (req,res)=>{
    console.log("inside UserController");
    try{
        const allUsers = await users.aggregate([
            {
                $match:{
                    role: "user"
                }
            },
            {
                $lookup:{
                    from: "devices",
                    localField: "_id",
                    foreignField: "assignedUser",
                    as: "devices"
                }
            },
            {
                $addFields:{
                    assignedDevicesCount: {$size : "$devices"}
                }
            },
            {
                $project:{
                    password:0,
                    "devices.secretKey": 0,
                    "devices.__v": 0,
                    "devices.createdAt": 0,
                    "devices.updatedAt": 0
                }
            }
        ])

        res.status(200).json(allUsers)
    }catch(err){
        console.log(err);
        res.status(500).json("Something went wrong")
    }
}

// get admin details
exports.adminDetailsController = async(req,res)=>{
    console.log("inside adminDetailsController");
    try{
       const adminDetails = await users.findOne({role:{$eq:"admin"}})
       res.status(200).json(adminDetails)
    }catch(err){
      console.log(err);
      res.status(500).json("Something went wrong")
    }
}

// password update
exports.updatePasswordController = async(req,res)=>{
    console.log("inside updatePasswordController");
    const {password} = req.body
    console.log(password);
    
    const email = req.params
    try{
        const user = await users.findOne(email)
        const passwordUpadte = await users.findByIdAndUpdate({_id:user._id},{
            password:password
        },{new:true})
        res.status(200).json(passwordUpadte)
    }catch(err){
        console.log(err);
        res.status(500).json("Something went wrong")
    }
} 
