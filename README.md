⚙️ IoT Monitoring System – Backend

A scalable and secure backend built with Node.js, Express, MongoDB, and MQTT to handle real-time IoT device communication, data storage, and alert generation.

🎯 About the Backend

The backend acts as the core engine of the IoT system. It listens to MQTT messages from devices, validates them securely, stores sensor data, monitors thresholds, and generates alerts automatically.
It also exposes REST APIs for frontend dashboards with role-based access control.

🧩 Features

📡 MQTT-based real-time data ingestion
🔐 Secure device authentication using deviceID & secretKey
🗄️ Sensor metrics storage with MongoDB
🚨 Automated alert generation (battery, temperature, humidity, offline)
🧑‍💼 Role-based access control using JWT
⚡ Device status tracking (online/offline, last seen)

🛠️ Tech Stack

Node.js,
Express.js,
MongoDB & Mongoose,
MQTT (HiveMQ / EMQX),
JWT Authentication

🌐 Deployment: 
https://iot-backend-2hr9.onrender.com
