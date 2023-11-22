const User = require("../models/userModel");
const Errorhandler = require("../utils/errorHandler");
const jwt=require("jsonwebtoken")

exports.isAuthenticated=async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new Errorhandler("First Login to access these resources",401));
        
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(decodedData.id);
    next();
}

exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            next(new Errorhandler("You are not authorize for this part",401));
        }else
        next();
    }
}
