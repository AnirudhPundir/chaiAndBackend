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

//TODO :- create a token controller as well
// TODO :- create a common controller for creating different entities

//routes import
import userRouter from "../src/routes/user.routes.js";
import commentRouter from "..src/routes/comments.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js";
import healthCheckRouter from "./routes/healthcheck.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";

//routes declaration

//users
app.use("/api/v1/users", userRouter);

//comments
app.use("/api/v1/comments", commentRouter);

//dashboard
app.use("/api/v1/dashboard", dashboardRouter);

//healthcheck
app.use("/api/v1/healthCheck", healthCheckRouter);

//healthcheck
app.use("/api/v1/like", likeRouter);

app.use("/api/v1/like", playlistRouter)

export {app};