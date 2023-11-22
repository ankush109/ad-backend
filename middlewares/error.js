const Errorhandler=require("../utils/errorHandler");

module.exports=(err,req,res,next)=>{
    err.statuscode=err.statuscode||500;
    err.message=err.message||"Internal Server Error";

    if(err.name==="CastError"){
        const message=`Resource not found ${err.path}`
        err=new Errorhandler(message,400)
    }
    
    //mongoose duplicate key error
    if(err.code===11000){
        err.message="Duplicate email is used",
        err=new Errorhandler(message,400);
    }


    //wrong JWT error
    if(err.name==="JsonWebTokenError"){
        err.message="Json web token is invalid try again",
        err=new Errorhandler(message,400);
    }

    //wrong JWT expire
    if(err.name==="TokenExpiredError"){
        err.message="Json web token is expired try again",
        err=new Errorhandler(message,400);
    }


    res.status(err.statuscode).json({
        success:false,
        message:err.message,
    })
}