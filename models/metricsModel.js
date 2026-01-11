const mongoose = require('mongoose')

const metricsSchema = mongoose.Schema({
    device:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"devices",
        required:true
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
    timestamps:false})

module.exports = mongoose.model("metrics",metricsSchema)