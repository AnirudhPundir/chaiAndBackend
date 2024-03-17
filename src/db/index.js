import mongoose from "mongoose";
import { dbname } from "../constants.js";

const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbname}`);
        console.log(`\nMONGODB conncet || DB HOST ${connectionInstance.connection.host}`);
    }
    catch(err){
        console.log(`MONGODB connection error ${err}`);
        process.exit(1);
    }
}

export default connectDB;