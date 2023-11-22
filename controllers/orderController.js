const Order=require("../models/orderModel");
const Errorhandler = require("../utils/errorHandler");
const CatchAsyncError=require("../middlewares/CatchAsyncError");
const Product = require("../models/productModel");

exports.newOrder=CatchAsyncError(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    }=req.body;
    const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user:req.user._id,
        paidAt:Date.now(),
    })

    res.status(201).json({
        success:true,
        order
    })
})

//get single order deytails
exports.getSingleOrder=CatchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )
    if(!order){
        next(new Errorhandler("Order not found",404));
    }

    res.status(200).json({
        success:true,
        order
    })
})

//get all order details
exports.myOrders=CatchAsyncError(async(req,res,next)=>{
    const order=await Order.find({user:req.user._id})

    res.status(200).json({
        success:true,
        order
    })
})


//get all order details -- Admin
exports.getAllOrder=CatchAsyncError(async(req,res,next)=>{
    const orders=await Order.find();
    let totamt=0;
    orders.forEach(order=>{
        totamt+=order.totalPrice;
    })
    res.status(200).json({
        success:true,
        totamt,
        orders
    })
})


//Update Order --Admin
exports.updateOrder=CatchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        next(new Errorhandler("No Such order is available",404))
    }
    if(order.orderStatus==="Delivered"){
        next(new Errorhandler("The product is already delivered",400));
    }
    
    order.orderItems.forEach(async function (order) {
        await updateStock(order.product, order.quantity);
    });
    console.log(req.body.status)
    if(req.body.status==="Delivered"){
        order.DeliveredAt=Date.now();
        order.orderStatus=req.body.status;
    }
    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    })
})
//update Stock called from update order
async function updateStock(id,quantity){
    const product=await Product.findById(id);
    product.Stock-=quantity;
    await product.save({
        validateBeforeSave:false
    })
}


//deleteOrder -- Admin
exports.deleteOrder=CatchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        next(new Errorhandler("The order not found",400));
    }

    await order.deleteOne();
    

    res.status(200).json({
        success:true,
        message:"Order is deleted",
    })
})