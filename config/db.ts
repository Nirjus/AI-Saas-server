import mongoose from "mongoose";
import { mongoUri } from "../secret/secret";

export const connectDB = async () => {
    try {
       await mongoose.connect(mongoUri);
        console.log(`database is connected at ${mongoose.connection.host}`);
        mongoose.connection.on("error",(error) => {
            console.error(error);
        })
    } catch (error) {
        console.log(error);
    }
}