const devices = require('../models/deviceModel')
const crypto = require("crypto")

// device added by admin
exports.addDevice = async (req,res)=>{
    console.log("Inside Admin deviceController");
    const {name,type,location,assignedUser} = req.body
    console.log(name,type,location,assignedUser);
    try{
        const existingDevice = await devices.findOne({
            name,
            type,
            location,
            assignedUser
        })
        if (existingDevice) {
           res.status(409).json("Device already exists for this user at this location.")
        }

       else{
            // generating deviceid
            const deviceID = "dev-" + crypto.randomBytes(4).toString("hex")

            // generating secretkey
            const secretKey = crypto.randomBytes(16).toString("hex")  

            const newDevice = await devices.create({
              deviceID,
              secretKey,
              name,
              type,
              location,
              assignedUser,
              approved:true,
              lastSeen:null,
              status:"offline"
            })
            
              res.status(200).json({
              message:"Device added successfully",
              device: newDevice
            })
       }
    }
    catch(err){
       console.log(err);
       res.status(500).json(err)
    }
}