const mongoose = require("mongoose")

const connectionString = process.env.ATLASDBCOLLECTION

mongoose.connect(connectionString).then(res=>{
    console.log("MonogoBD connection Succesfull");
}).catch(err=>{
    console.log("MongoBD connection error");
    console.log(err);
})