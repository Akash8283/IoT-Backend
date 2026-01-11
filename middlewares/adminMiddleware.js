const jwt = require('jsonwebtoken')

const adminMiddleware = async(req,res,next)=>{
    console.log("Inside adminMiddleware");
    // logic to verify token
    // get token from headers
    const token = req.headers['authorization'].split(" ")[1]
    console.log(token);
    if (token) {
        try{
           const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
           console.log(jwtResponse);
           req.payload = jwtResponse.userMail
           req.role = jwtResponse.role
           if (jwtResponse.role == "admin") {
            next()
           }
           else{
            res.status(401).json("Aauthorization Failed!!! Invalid User")
           }
        }catch(err){
            res.status(401).json("Aauthorization Failed!!! Invalid token")
        }
    }
    else{
        res.status(401).json("Aauthorization Failed!!! Token missing")
    }
    
}

module.exports = adminMiddleware