const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL || process.env.DATABASE_URL;
    
    if (!mongoUri) {
      console.error("ERROR: No MongoDB URI found. Set MONGO_URI, MONGO_URL, or DATABASE_URL");
      process.exit(1);
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
