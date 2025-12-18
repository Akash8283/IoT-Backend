const mongoose = require('mongoose')

const metricsSchema = mongoose.Schema({
    deviceID:{
        type:String,
        required:true,
        index:true
    },
    temperature:{
        type:Number,
    },
    humidity:{
        type:Number,
    },
    battery:{
        type:Number,
    },
    timestamp:{
        type:Date,
        required:true
    }
},
    {versionKey:false,
    timestamps:false,
    collection: "metrics"})

module.exports = mongoose.model("metrics",metricsSchema)