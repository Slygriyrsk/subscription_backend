import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI) {
  throw new Error("Database URI is not defined in the environment var .env.*.local.");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to MongoDB in ${NODE_ENV} mode`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        //throw error; // Re-throw the error to handle it in the calling function
        process.exit(1); // Exit the process if connection fails
    }
}

export default connectToDatabase;