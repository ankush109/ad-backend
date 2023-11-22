const mongoose=require("mongoose");
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter the product name"],
    },
    description:{
        type:String,
        required:[true,"Enter the product description"],
    },
    price:{
        type:Number,
        //required:[true,"Enter the product price"],
        maxLength:[8,"Price cannot be greater than 8 charecters"],
    },
    AdUrl:[
    ],
    ratings:{
        type:Number,
        default:0,
    },
    images:[
        {
            public_id:{
                type:String,
                require:true,
            },
            url:{
                type:String,
                require:true,
            }
        }
    ],
    catagory:{
        type:String,
        // required:[true,"Enter the product catagory"],
    },
    Stock:{
        type:Number,
        //required:[true,"Enter the product Stock"],
        maxLength:[4,"Stock cannot exceed 4 charecter"],
        default:1,
    },
    numberOfReviews:{
        type:String,
        default:0,
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true,
        },
        name:{
            type:String,
            required:true,
        },
        rating:{
            type:Number,
            required:true,
        },
        Comment:{
            type:String,
            required:true,
        }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})

module.exports= mongoose.model("Product",productSchema);