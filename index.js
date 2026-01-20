require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/routing')
require('./config/db')

const iotServer = express()
iotServer.use(cors())
iotServer.use(express.json())
iotServer.use(router)

require("./mqtt/mqttlistener")

const PORT = 3000 || process.env.PORT

iotServer.listen(PORT,()=>{
    console.log("Server started listening");
    
})

iotServer.get('/',(req,res)=>{
    res.status(200).send("<h1>Server Started Listening<h1/>")
})

