const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Mongoose 8+ default options are already optimal for MongoDB 7+
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
