import dotenv from "dotenv";
import connectDB from "./db/index.js";
import mongoose from "mongoose";
import express  from "express";
import {app} from "./app.js"
dotenv.config({path : './env'})
// const app = express();
connectDB().then((res) => {
    app.on("error", (error) => {
        console.log("Error", error);
        throw error;
    })    
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server started at PORT : ${process.env.PORT}`); 
    });
}).catch((err)=>{
    console.log("\n MONGO DB CONNECTION", err);
});

//traditionalApproach
// import express  from "express";
// const app = express();
// (async() => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${dbname}`);
//         app.on("error", (error) => {
//             console.log("Error", error);
//             throw error;
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`Application is listening on PORT ${process.env.PORT}`);
//         });
//     }
//     catch(err){
//         console.log(err);
//         throw err;
//     }
// })();