const Errorhandler = require("../utils/errorHandler");
const CatchAsyncError=require("../middlewares/CatchAsyncError")
const User=require("../models/userModel");
const sendToken=require("../utils/JwtToken")
const crypto=require("crypto")
// const getResetPasswordToken =require ("../models/userModel")
const sendEmail = require("../utils/Email")
const cloudinary = require("cloudinary")

exports.registerUser=CatchAsyncError(async (req,res,next)=>{
  let myCloud;
  //if(req.body.avatar){
  myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  //}

  const { name, email, password,role } = req.body;


  if(!email|!password|!role){
    return next(new Errorhandler("Enter email and password and role",400))
}
const userr=await User.findOne({email});

if(userr){
    return next(new Errorhandler("Already exists",401));
}

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    role,
  });

  sendToken(user, 201, res);
})


exports.loginUser=CatchAsyncError(async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email|!password){
        return next(new Errorhandler("Enter email and password",400))
    }
    const user=await User.findOne({email}).select("+password");

    if(!user){
        return next(new Errorhandler("Invalid email or password",401));
    }

    const isMatched=await user.compare(password);

    if(!isMatched){
        return next(new Errorhandler("Invalid email or password",401));
    }

    sendToken(user,200,res);
})



exports.logoutUser=CatchAsyncError(async(req,res,next)=>{
    await res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        success:true,
        message:"Logged Out",
    })
})

exports.forgotPassword = CatchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new Errorhandler("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new Errorhandler(error.message, 500));
    }
  });
  


  //reset password
  exports.resetPassword=async(req,res,next)=>{
    console.log("came to reset password")
    const resetPasswordToken=crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
    const user=await User.findOne({resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
      next(new Errorhandler("reset password token is invalid or the reset password token is expired"));
    }

    if(req.body.password!=req.body.confirmPassword){
      next(new Errorhandler("Password doesn't match"));
    }

    user.password=req.body.password;
    console.log(user.password)
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendToken(user,200,res);

  }



  //getUserDetails
  exports.getUserDetails=CatchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.user.id);

    if(!user){
      next(new Errorhandler("User not found",400))
    }
    res.status(200).json({
      success:true,
      user,
    })
  });


  //changePassword
  exports.userChangePassword=CatchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password");
    if(!user){
      next(new Errorhandler("User not found",400))
    }

    if(!await user.compare(req.body.oldPassword)){
      next(new Errorhandler("The old password entered is wrong"),400);
    }

    if(req.body.newPassword!==req.body.confirmPassword){
      next(new Errorhandler("The passwords does not match"));
    }

    user.password=req.body.newPassword;
    await user.save();

    sendToken(user,200,res)

  
  })

//update profile
  exports.updateProfile=CatchAsyncError(async(req,res,next)=>{
    const newUser={
      name:req.body.name,
      email:req.body.email,
    }

    const user=await User.findByIdAndUpdate(req.user.id,newUser,{
      new:true,
      runValidators:true,
      useFindAndModify:false,
    })

    res.status(200).json({
      success:true,
    })

  })


  //getAllUsers(admin)
  exports.getAllUsers=CatchAsyncError(async(req,res,next)=>{
    users=await User.find();
    res.status(200).json({
      success:true,
      users
    })
  })

  //getSingleUser(admin)
  exports.getSingleUser=CatchAsyncError(async(req,res,next)=>{
    user=await User.findById(req.params.id);
    if(!user){
      next(new Errorhandler(`User not found with id ${req.params.id}`,404));
    }
    res.status(200).json({
      success:true,
      user
    })
  })

  //updateRoles(Admin)
  exports.updateRoles=CatchAsyncError(async(req,res,next)=>{
    
    let user=await User.findById(req.params.id);
    if(!user){
      next(new Errorhandler(`User not found with id ${req.params.id}`,404))
    }
    const newUser={
      name:req.body.name,
      email:req.body.email,
      role:req.body.role
    }
    if(req.body.name!==user.name||req.body.email!==user.email){
      next(new Errorhandler("The email or name does not match"))
    }
    user=await User.findByIdAndUpdate(req.params.id,newUser,{
      new:true,
      runValidators:true,
      useFindAndModify:false,
    })

    res.status(200).json({
      success:true,
    })
  })



  //delete user
  exports.deleteUser=CatchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
      next(new Errorhandler(`User not found with id ${req.params.id}`,404))
    }
    await user.deleteOne();
    res.status(200).json({
      success:true,
      message:"User Deleted Successfully"
    })
  })