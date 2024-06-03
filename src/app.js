import express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
}));

app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "../src/routes/user.routes.js";
import commentRouter from "..src/routes/comments.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js";

//routes declaration

//users
app.use("/api/v1/users", userRouter);

//comments
app.use("/api/v1/comments", commentRouter);

//dashboard
app.use("/api/v1/dashboard", dashboardRouter)

export {app};