const User = require("../models/user/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

class LoginUser {
    async login(data ,res) {
        const {companyId , role} = data;
        const alreadyUser = await User.findOne({companyId , role});
        if(!alreadyUser) {
            throw new Error("User not found")
        }
        
        const token = jwt.sign({
            userId : alreadyUser._id,
            companyId : alreadyUser.companyId,
            role : alreadyUser.role
        },
            process.env.SECRET,
            {expiresIn : '24h'}
        )

        res.cookie('token' , token , {
            httpOnly : true,
            secure : false,
            sameSite : 'lax'
        })

        return{
                success : true,
                message : "Login Successful",
                
        }
    
    }
}

module.exports = new LoginUser();