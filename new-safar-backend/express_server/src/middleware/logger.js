const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config();

module.exports = (req , res , next)=>{
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message : "No token is present here"})
    }

    try{
        const decoded = jwt.verify(token , process.env.SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message : "Invalid token"})
    }

  
}