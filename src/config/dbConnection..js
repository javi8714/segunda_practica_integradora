import mongoose from "mongoose";
import { config } from "./config.js";


export const connectDB = async()=>{
    try {
        console.log("conectando db...");
        await mongoose.connect(config.mongo.url);
        console.log("Conectada a la base de datos");
    } catch (error) {
        console.log(error.message);
    }
}