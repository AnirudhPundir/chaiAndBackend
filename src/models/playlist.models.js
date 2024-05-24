import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name : {
        type : String,
        required : triue
    },
    description : {
        type : string
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref: "User"
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ]
}, {timestamps: true});

export const Playlist = mongoose.model("Playlist", playlistSchema);