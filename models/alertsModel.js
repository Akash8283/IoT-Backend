const mongoose = require('mongoose')

const alertsModal = new mongoose.Schema({
    device:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "devices",
        required:true
    },
    type:{
        type: String,
        enum: ["LOW_BATTERY","HIGH_TEMP","LOW_HUM","DISCONNECTED"],
        required: true
    },
    message:{
        type: String,
        required: true
    },
    severity:{
        type: String,
        enum: ["low","med","high"],
        default: "low"
    },
    status:{
        type: String,
        enum: ["active","resolve"],
        default: "active"
    },
    resolvedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },
    resolvedAt:{
        type: Date,
        default: null
    }
},{timestamps:true}
)

module.exports = mongoose.model("alerts",alertsModal)