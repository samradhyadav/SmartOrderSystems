const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(" Attempting MongoDB connection...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Optional, default is 30s
      socketTimeoutMS: 45000, // Increase if needed
    });
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error(" MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
