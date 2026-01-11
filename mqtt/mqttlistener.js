const mqtt = require('mqtt')
const devices = require('../models/deviceModel')
const metrics = require('../models/metricsModel')
const alerts = require('../models/alertsModel')
const brokerURL = process.env.BROKER_URL

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
        device: device._id,
        temperature: data.temperature,
        humidity: data.humidity,
        battery: data.battery,
        timestamp: data.timestamp?new Date(data.timestamp):new Date()
       })

       if (data.battery < 10) {
        
        const existingAlert = await alerts.findOne({
            device: device._id,
            type: "LOW_BATTERY",
            message: `Battery low (${data.battery}%)`,
            status: "active"
        })
        if (!existingAlert) {
         await alerts.create({
            device: device._id,
            type: "LOW_BATTERY",
            message: `Battery low (${data.battery}%)`,
            severity: "high"
         })
       }
       }

       if (data.temperature > 70) {
        const existingAlert = await alerts.findOne({
            device: device._id,
            type: "HIGH_TEMP",
            message: `High temperature detected ${data.temperature}`,
            status: "active"
        })
        if (!existingAlert) {
         await alerts.create({
            device: device._id,
            type: "HIGH_TEMP",
            message: `High temperature detected ${data.temperature}`,
            severity: "high"
         })
       }
       }

       if (data.humidity < 20) {
        const existingAlert = await alerts.findOne({
            device: device._id,
            type: "LOW_HUM",
            message: `Low humidity detected ${data.humidity}%`,
            status: "active"
        })
        if (!existingAlert) {
         await alerts.create({
            device: device._id,
            type: "LOW_HUM",
            message: `Low humidity detected ${data.humidity}%`,
            severity: "med"
         })
       }
       }
    }
    }catch(err){
      console.log(err);
    }
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

                    const existingAlert = await alerts.findOne({
                        device: d._id,
                        type: "DISCONNECTED",
                        status: 'active'
                    })

                    if (!existingAlert) {
                        await alerts.create({
                            device: d._id,
                            type: "DISCONNECTED",
                            message: "Device stopped sending data",
                            severity: "high"
                        })
                    }

                    console.log(`Device ${d.deviceID} is offline`);
                }
            }

       },10000)


