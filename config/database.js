const { default: mongoose } = require("mongoose");

const connectdb = () => {
  mongoose
    .connect(
      "mongodb+srv://nila_boy:nila_boy@cluster0.ssn1p3g.mongodb.net/AdHub?retryWrites=true&w=majority"
    )
    .then((data) => {
      console.log("mongo db connected with server ");
    });
};

module.exports = connectdb;
