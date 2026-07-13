import mongoose from "mongoose";
import "dotenv/config"
// set up db connection

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected ');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
