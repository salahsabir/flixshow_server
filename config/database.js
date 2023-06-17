const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

mongoose.set('strictQuery', true);

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};