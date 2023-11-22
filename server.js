import { use, set, all } from "./app.js";
import cors from "cors";
import connectdb from "./config/database.js";
import cloudinary from "cloudinary";
import helmet from "helmet";
import morgan from "morgan";
import { json, urlencoded } from "express";
// process.on("uncaughtException",(err)=>{
//     console.log(`Error : ${err.message}`);
//     console.log("Shutting down server due to uncaughtError");
//     process.exit(1);
// })
connectdb();
use(
  cors({
    origin: [
      "https://ad-hub-frontend-995v.vercel.app/",
      "http://localhost:3000",
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

use(helmet());
set("trust proxy", 1);
use(json());
use(urlencoded({ extended: false }));
use(morgan("dev"));

// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require("dotenv").config({ path: "secret.env" });
//   }

// cloudinary.config({
//     cloud_name:"dsd8hp9wx",
//     api_key:241217624559331,
//     api_secret:"0dlZUeXVVZkU45-quw4wLmG2ixc",
// })

// const server = app.listen('5000',()=>{
//     console.log("Server is working ");
// })

all("/", (res) => {
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
