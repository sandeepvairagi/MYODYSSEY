import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/my-odyssey';
  const conn = await mongoose.connect(uri);
  isConnected = true;
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
