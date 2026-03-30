const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    // Debug: log all env vars starting with MONGO
    console.log("Environment check:");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "SET" : "NOT SET");
    console.log("MONGO_URL:", process.env.MONGO_URL ? "SET" : "NOT SET");
    
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    
    if (!mongoUri) {
      console.error("ERROR: No MongoDB connection string found!");
      console.error("Please set MONGO_URI or MONGO_URL environment variable.");
      process.exit(1);
    }
    
    const conn = await mongoose.connect(mongoUri, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
