import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in .env file.");
  process.exit(1); // Exit if DB connection string is missing
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit on connection error
  }
};

export default connectDB;
