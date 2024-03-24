import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchemma = new Schema({
    videoFile : {
        type : String, //CloudinaryUrl
        required : true
    },
    thumbnail : {
        type : String, //CloudinaryURL
        required: true
    },
    title : {
        type: String,
        required : true
    },
    description: {
        type : String,
        required : true
    },
    duration : {
         type: Number,//CloudinaryURL
    },
    views : {
        type : Number,
        default : 0
    },
    isPublished : {
        type : boolean,
        default : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
}, {timestamps: true});

videoSchemma.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchemma);