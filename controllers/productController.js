const Product=require("../models/productModel");
const Errorhandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apifeatures")
const CatchAsyncError=require("../middlewares/CatchAsyncError")
const cloudinary=require("cloudinary");

// Create Product --Admin
exports.createProduct = CatchAsyncError(async(req,res,next)=>{

    let images = [];
    if(typeof(req.body.images)==="string"){
        images.push(req.body.images);
    }else{
        images=req.body.images;
    }
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result=await cloudinary.v2.uploader.upload(images[i],{
            folder:"products"
        });
    
        imagesLinks.push({
            public_id:result.public_id,
            url:result.secure_url
        })
    }
    req.body.images=imagesLinks;
    req.body.user=req.user.id;
    const product=await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
});

//get the single product details
exports.getProductDetails=CatchAsyncError(async (req,res,next)=>{
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return next(new Errorhandler("Product not found",404))
        }
        res.status(200).json({
            success: true,
            product,
        });
});



//update product
exports.updateProduct= CatchAsyncError(async (req,res,next)=>{
        let product=await Product.findById(req.params.id);
        if (!product) {
            return next(new Errorhandler("Product not found",404))
        }
        product=await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false,
        })

        res.status(200).json({
            success:true,
            product
        })   
});


//delete products  --Admin
exports.deleteProducts= CatchAsyncError(async(req,res,next)=>{
        const product=await Product.findById(req.params.id);
        console.log(product)
        if (!product) {
            return next(new Errorhandler("Product not found",404))
        }

        await product.deleteOne();

        res.status(200).json({
            success:true,
            message:"Product successfully deleted",
        }
       );
    });


//get all products
const resultPerPage=8
exports.getAllProuducts =CatchAsyncError( async(req,res,next)=>{
    
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    
    const product=await apiFeature.query;
    const countProducts=await Product.countDocuments();
    let filteredProductsCount=product.length;
    res.status(200).json({
        success:true,
        product,
        countProducts,
        resultPerPage,
        filteredProductsCount
    })
});

// get all product (admin)
exports.getAdminProuducts =CatchAsyncError( async(req,res,next)=>{
    
    const products=await Product.find();
    let product=[]
    for(let i=0;i<products.length;i++){
        if(JSON.stringify(products[i].user)===JSON.stringify(req.user._id)){
            await product.push(products[i]);
        }
    }

    res.status(200).json({
        success:true,
        product,
        
    })
});


//Review Add/Update
exports.createProductReview=CatchAsyncError(async(req,res,next)=>{
    const {rating,Comment,ProductId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        Comment,
    }
    const product=await Product.findById(ProductId);
    const isReviewed=product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating=rating,
                rev.Comment=Comment
            }
        })
    }else{
        product.reviews.push(review);
        product.numberOfReviews=product.reviews.length
    }
    let avg=0;
    product.ratings=product.reviews.forEach(rev=>{
        avg+=rev.rating
    })
    const no=product.numberOfReviews;
    product.ratings=avg/no;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        product,
    })
})



//GetAllReviews
exports.getProductReviews=CatchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.id);

    if(!product){
        next(new Errorhandler("Product Not Found"))
    }
    const show=product.reviews
    res.status(200).json({
        success:true,
        show
    })
})


//Delete Review
exports.deleteProductReview=CatchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.id);
    if(!product){
        next(new Errorhandler("Product Not Found"))
    }
    // console.log(product.name)
    const reviews=product.reviews.filter((rev)=>rev.user.toString()!==req.user._id.toString());
    const numberOfReviews=reviews.length

    let avg=0;
    reviews.forEach(rev=>{
        avg+=rev.rating
    })
    const ratings=avg/numberOfReviews


    await Product.findByIdAndUpdate(req.params.id,{
        reviews,numberOfReviews,ratings,
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });



    res.status(200).json({
        success:true,
    })
})