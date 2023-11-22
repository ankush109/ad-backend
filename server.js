const app = require("./app.js");
const dotenv = require("dotenv");
const connectdb = require("./config/database.js");
const cloudinary = require("cloudinary");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
connectdb();
app.use("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.send("api is running");
});
cloudinary.config({
  cloud_name: "dsd8hp9wx",
  api_key: 241217624559331,
  api_secret: "0dlZUeXVVZkU45-quw4wLmG2ixc",
});
app.listen(4000, () => {
  console.log(`server is working on 4000`);
});
