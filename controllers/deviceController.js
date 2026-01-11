const devices = require('../models/deviceModel')
const alerts = require('../models/alertsModel')
const metrics = require('../models/metricsModel')
const users = require('../models/userModel')
const crypto = require("crypto");

// device added by admin
exports.addDeviceController = async (req,res)=>{
    console.log("Inside Admin deviceController");
    const {name,type,location,assignedUser} = req.body
    console.log(name,type,location,assignedUser);
    try{
        const existingDevice = await devices.findOne({
            name,
            type,
            location,
            // assignedUser
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
              approved:false,
              lastSeen:null,
              status:"offline"
            })
            
              res.status(200).json(newDevice,"Device Added Successfully")
              
       }
    }
    catch(err){
       console.log(err);
       res.status(500).json(err)
    }
}

// get all device details
exports.getAllDeviceAdminController = async(req,res)=>{
  console.log("getAllDeviceAdminController");
  try{
    const allDevivces = await devices.find().populate("assignedUser", "username email")
    res.status(200).json(allDevivces)
  }catch(err){
    console.log(err);
    res.status(500).json(err)
  }
}

// update approve status
exports.updateApprovalController = async(req,res)=>{
  console.log("Inside updateApprovalController");
  const {id} = req.params
  try{
    const device = await devices.findById(id)
    if (!device) {
      res.status(404).json("Device not found")
    }
    else if (device.approved == true){
      res.status(400).json("Device already approved")
    }
    else{
      device.approved = true
      await device.save()
      res.status(200).json("Device approved successfully")
    }
  }
  catch(err){
      console.log(err);
      res.status(500).json("Something went wrong")
  }
}

// disable approval
exports.disableApprovalController = async(req,res)=>{
  console.log("Inside disableApprovalController");
  const {id} = req.params
  try{
    const device = await devices.findById(id)
    if (!device) {
      res.status(404).json("Device not found")
    }
    else if (device.approved == false){
      res.status(400).json("Device already disabled")
    }
    else{
      device.approved = false
      await device.save()
      res.status(200).json("Device disabled")
    }
  }
  catch(err){
      console.log(err);
      res.status(500).json("Something went wrong")
  }

}

// delete device
exports.deleteDeviceController = async(req,res)=>{
  console.log("Inside deleteDeviceController");
  const {id} = req.params
  try{
    const device = await devices.findById(id)
    if (!device) {
      res.status(404).json("Device not found")
    }

    if (device.approved == false) {
      await devices.findByIdAndDelete(id)
      res.status(200).json("Device deleted successfully")
    }
    else{
      res.status(403).json("Approved device can't be deleted")
    }
  }
  catch(err){
      console.log(err);
      res.status(500).json("Something went wrong")
  }
}

// get device (device-simulator)
exports.getAllDevicesController = async(req,res)=>{
  try{
    const device = await devices.find({},{
    deviceID:1,
    status:1,
    approved:1,
    _id:0
  })
  res.status(200).json(device)
  }catch(err){
    console.log(err);
    res.status(500).json(err)
  }
}

// config
exports.getDeviceConfigController = async(req,res)=>{
  try{
    // get device id from the url (requested by iot device)
    const {deviceID} = req.params
    // search db for the deviceID
    const device = await devices.findOne({deviceID})

    if (!device) {
      res.status(404).json("Device not Found")
    }
    
    if (!device.approved) {
      res.status(403).json("Device not approved")
    }
    // config for fakedevice
    const config ={
      deviceID: device.deviceID,
      secretKey: device.secretKey,
      brokerURL: process.env.BROKER_URL,
      topic: `/iot/${device.deviceID}/data`,
      interval:7000
    }

    return res.status(200).json(config)
    
    
  }catch(err){
    console.log(err);
    res.status(500).json(err)
  }
}

// get recentalerts
exports.getRecentAlertController = async(req,res)=>{
  console.log("inside getRecentAlertController");
   try{
     const recentAlerts = await alerts.find().populate("resolvedBy","username").sort({createdAt: -1}).limit(5).populate({
      path: "device",
      select: "deviceID"
     })
     res.status(200).json(recentAlerts)
   }catch(err){
    console.log(err);
    res.status(500).json("Something went wrong")
   }
  
}

// get allalerts
exports.getAllAlertController = async(req,res)=>{
  console.log("inside getRecentAlertController");
   try{
     const recentAlerts = await alerts.find().populate("resolvedBy","username").sort({createdAt: -1}).populate({
      path: "device",
      select: "deviceID"
     })
     res.status(200).json(recentAlerts)
   }catch(err){
    console.log(err);
    res.status(500).json("Something went wrong")
   }
  
}

// get logined user device details
exports.getLoginUserDeviceDetails = async(req,res)=>{
  console.log("inside tLoginUserDeviceDetails");
  
  const email = req.payload
  console.log(email);
    try{
      const user = await users.findOne({email})
      console.log(user);
      if (!user) {
        res.status(404).json("User not found")
      }
      else{
        const userDevices = await devices.find({
          assignedUser:user._id,
          approved:true
        },{secretKey:0})
        res.status(200).json(userDevices)
      }
    }catch(err){
      console.log(err);
      res.status(500).json("Something went wrong")
    }
}

// get single device detail
exports.singleDeviceDetailscontroller = async(req,res)=>{
  console.log("checkstatuscontroller");
  const {id} = req.params
  try{
    const details = await devices.findOne({_id:id})
    res.status(200).json(details)
  }catch(err){
    console.log(err);
    res.status(500).json("Something went wrong")
  }
}

// get metrics
exports.getMetricsController = async(req,res)=>{
  console.log("inside getMetricsController");
  const {id} = req.params
  try{
    const latestMetrics = await metrics.findOne({device:id}).sort({timestamp:-1}).limit(20)
    res.status(200).json(latestMetrics)
  }
  catch(err){
    console.log(err);
    res.status(500).json("Something went wrong")
  }
}

// get recent alerts for user dashboard
exports.getUserRecentAlertController = async(req,res)=>{
  console.log("inside getRecentAlertUserController");
  const email = req.payload
  console.log(email);
  
  try{
    const user = await users.findOne({email})
    if (!user) {
      res.status(404).json("User not found")
    }
    else{
      const device = await devices.find({
        assignedUser:user._id
      },"_id")

      const deviceIds = device.map(d=>d._id)
      const alert = await alerts.find({
        device: {$in:deviceIds}
      }).populate("device","deviceID").sort({createdAt:-1}).limit(5)
      res.status(200).json(alert)
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json("Something went wrong")
  }
}

// get all alerts for user dashboard
exports.getUserAllAlertController = async(req,res)=>{
  console.log("inside getRecentAlertUserController");
  const email = req.payload
  console.log(email);
  
  try{
    const user = await users.findOne({email})
    if (!user) {
      res.status(404).json("User not found")
    }
    else{
      const device = await devices.find({
        assignedUser:user._id
      },"_id")

      const deviceIds = device.map(d=>d._id)
      const alert = await alerts.find({
        device: {$in:deviceIds},
        status: "active"
      }).populate("device","deviceID").sort({createdAt:-1})
      res.status(200).json(alert)
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json("Something went wrong")
  }
}

// update alert status
exports.updateAlertStatusController = async (req,res)=>{
  console.log("inside updateAlertStatusController");
  const {id} = req.params
  const email = req.payload
  try{
    const user = await users.findOne({email})
    const status = await alerts.findByIdAndUpdate({_id:id},{
      status:"resolve",
      resolvedBy: user._id,
      resolvedAt: new Date()
    },{new:true})
    res.status(200).json(status)
  }catch(err){
    console.log(err);
    res.status(500).json("Something went wrong")
  }
}