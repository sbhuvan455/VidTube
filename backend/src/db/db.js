import mongoose from "mongoose";
import { DB_name } from "../constants.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(`Connected to Database: ${DB_name}`);
    } catch (error) {
        console.log("Error Connecting to Data Base", error);
        process.exit(1);
    }
}