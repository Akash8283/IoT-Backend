const jwt = require('jsonwebtoken')

const jwtMiddleware = async(req,res,next)=>{
    console.log("inside userMiddleware");

    const token = req.headers['authorization'].split(" ")[1]
    console.log(token);
    if (token) {
        try{
          const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
          console.log(jwtResponse);
          req.payload = jwtResponse.userMail
          next()
        }
        catch(err){
            res.status(401).json("Aauthorization Failed!!! Invalid Token")
        }
    }
    else{
        res.status(401).json("Aauthorization Failed!!! Token missing")
        
    }
}

module.exports = jwtMiddleware