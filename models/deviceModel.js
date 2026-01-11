const mongoose = require("mongoose")

const deviceSchema = mongoose.Schema({
    deviceID:{
        type:String,
        require:true,
        unique:true
    },
    secretKey:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    type:{
        type:String,
        enum:["temp_hum"],
        default:"temp_hum"
    },
    location:{
        type:String,
        default:""
    },
    assignedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        default:null
    },
    approved:{
        type:Boolean,
        default:true
    },
    lastSeen:{
        type:Date,
        default:null
    },
    status:{
        type:String,
        enum:["online","offline"],
        default:"offline"
    },
},{timestamps:true})

const device = mongoose.model("devices",deviceSchema)
module.exports = device