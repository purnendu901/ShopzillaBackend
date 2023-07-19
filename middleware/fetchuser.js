const JWT_CODE = require("../JWTCODE")
const jwt = require('jsonwebtoken');

fetchuser =(req,res,next)=>{


    // Get the user from jwt token and add id to req object 
    const token = req.header('auth-token')
    if(!token)
    {
     res.status(401).send({error:"Access Denied"})
    }


    try {

        const data = jwt.verify(token,JWT_CODE)
        req.user = data.user
        res.header({"Access-Control-Allow-Origin": "*"});
        

    next()
        
    } catch (error) {
     res.status(401).send({error:"Access Denied"})
    }

    
}


module.exports = fetchuser