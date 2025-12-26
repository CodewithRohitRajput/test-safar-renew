const LoginService = require("../services/LoginService");


module.exports = {
    userLogin : async(req , res) => {
        try{
       const data = await LoginService.login(req.body , res);

       
            return res.status(200).json(data);

        }catch(err){
            return res.status(400).json({message : "Internal server error" });
        }   

    }
}
