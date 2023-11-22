const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const errorMiddlewear = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const path = require("path");
const app = express();
const corsOptions = {
  origin: ["https://ad-hub-frontend-995v.vercel.app", "http://localhost:3000"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());

const product = require("./routes/ProductRoutes");

app.use(product);

const user = require("./routes/userRoutes");

app.use(user);

const order = require("./routes/orderRoutes");

app.use(order);

app.use(errorMiddlewear);
module.exports = app;
