const mongoose =require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter your name"],
        minLength:[4,"Please enter atleast 4 charecters"],
        maxLength:[30,"Name cannot be greater than 30 charecters"],
    },
    email:{
        type:String,
        required:[true,"Enter your email"],
        validate: [validator.isEmail, "Please Enter a valid Email"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Enter your password"],
        select:false,
        minLength:[8,"Password must be greater or equals than 8 charecters"],
    },
    avatar:{
        public_id:{
            type:String,
            default:"ABC123"
            // required:true,
        },
        url:{
            type:String,
            default:"https://i.ibb.co/DRST11n/1.webp"
            // require:true,
        },
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    role:{
        type:String,
        default:"user",
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,
})


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });
  

userSchema.methods.compare = (async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
})

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };
module.exports=mongoose.model("User",userSchema)