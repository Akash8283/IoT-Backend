const mqtt = require('mqtt')
const devices = require('../models/deviceModel')
const metrics = require('../models/metricsModel')

const brokerURL = "mqtt://broker.emqx.io:1883"

const client = mqtt.connect(brokerURL)

// Connect to the mqtt broker
client.on('connect',()=>{
    console.log("MQTT Connected");
    client.subscribe("/iot/+/data")
})

// data recieving from the broker
client.on('message',async(topic,message)=>{
    try{
        const data = JSON.parse(message.toString())
        console.log("Recieved Data:", data);
        const device = await devices.findOne({
        deviceID: data.deviceID,
        secretKey: data.secretKey
    })
    if(!device){
        console.log("Unauthorized Device");
        return
    }
    else{

        device.status = "online"
        device.lastSeen = new Date()
        await device.save()

       await metrics.create({
        deviceID: data.deviceID,
        temperature: data.temperature,
        humidity: data.humidity,
        timestamp: data.timestamp?new Date(data.timestamp):new Date
       })

       setInterval(async ()=>{
        const threshold = 20000

        const allDevices = await devices.find()

        const now = Date.now()

        for(let d of allDevices){
            if (!d.lastSeen) {
                continue
            }
            const diff = now - new Date(d.lastSeen).getTime() 
            if (diff > threshold && d.status != "offline") {
                d.status = "offline"
                await d.save()
                console.log(`Device ${d.deviceID} is offline`);
            }
        }

       },10000)
    }
    }catch(err){
      console.log(err);
    }
})


