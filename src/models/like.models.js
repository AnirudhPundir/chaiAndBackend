import mongoose, { Schema } from "mongoose";

const likeSchemma = new Schema({
    comment : {
        type : Schema.Types.ObjectId,
        ref: "Comment"
    },
    video : {
        type: Schema.Types.ObjectId,
        ref : "Video"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likedby: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps : true});

export const Like = mongoose.model("Like", likeSchemma);