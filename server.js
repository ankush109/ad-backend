const app = require("./app.js")
const cors =  require ("cors");
const connectdb=require("./config/database.js")
const cloudinary = require("cloudinary");
const helmet = require("helmet");
const morgan =require("morgan");
const express = require("express");
// process.on("uncaughtException",(err)=>{
//     console.log(`Error : ${err.message}`);
//     console.log("Shutting down server due to uncaughtError");
//     process.exit(1);
// })

app.use(cors({
    origin:['https://ad-hub-frontend-995v.vercel.app/',"http://localhost:3000"],
    credentials:true,
    optionSuccessStatus: 200,
}))


app.use(helmet());
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require("dotenv").config({ path: "secret.env" });
//   }
connectdb();
cloudinary.config({
    cloud_name:"dsd8hp9wx",
    api_key:241217624559331,
    api_secret:"0dlZUeXVVZkU45-quw4wLmG2ixc",
})

// const server = app.listen('5000',()=>{
//     console.log("Server is working ");
// })



app.all("/", (res) => {
    res.send({ message: "API is Up and Running on render 😎🚀" });
  });

//unhandled rejections
// process.on("unhandledRejection",(err)=>{
//     console.log(`Error : ${err.message} `);
//     console.log("Shutting down server due to unhandled error");
//     server.close(()=>{
//         process.exit();
//     });
    
// })