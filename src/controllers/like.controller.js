import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import Like from "../models/like.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";

// TODO : Assignment to self for creating a common controller for all types of likes
export const toggleLike = asyncHandler(async(req, res) => {
    //TODO: toggle like on video
    // Steps : 
    // 1. Fetch the user id and video Id
    // 2. Check the user id
    // 3. create a record for like with user and video id, with like model
    // 4. return the like record
    const {videoId} = req.user?._id;

    if(!(req.user?._id && videoId)) throw new ApiError(401, "User or video details are missing ")
    
    
    
});

export const toggleVideoLike = asyncHandler(async(req, res) => {
    //TODO: toggle like on video
    // Steps : 
    // 1. Fetch the user id and video Id
    // 2. Check the user id
    // 3. create a record for like with user and video id, with like model
    // 4. return the like record
    const {videoId} = req.user?._id;

    if(!(req.user?._id && videoId)) throw new ApiError(401, "User or video details are missing ");
    
    const like = await Like.create({
        video : videoId,
        likedBy : req.user?._id
    });

    if(!like) throw new ApiError(401, "Video was not liked");

    return res.status(200).json(new ApiResponse(200, like, "Video was liked"));
});

export const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    // Steps : 
    // 1. Fetch the comment Id from req and check it
    // 2. Fetch the user Id from req and check it
    // 3. create a like reacord with the given comment Id
    const {commentId} = req.params;

    if(!(commentId && req.user?._id)) throw new ApiError(401, "Comment Id N/A");

    const like = await Like.create({
        comment : commentId,
        likedBy : req.user?._id
    });
    
    if(!like) throw new ApiError(401, "comment was not liked");

    return res.status(200).json(new ApiResponse(200, like, "Comment was liked"));
});

export const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    // Steps : 
    // 1. Fetch the tweet Id from req and check it
    // 2. Fetch the user Id from req and check it
    // 3. create a like reacord with the given comment Id
    const {tweetId} = req.params

    if(!(tweetId && req.user?._id)) throw new ApiError(401, "Tweet Id N/A");

    const like = await Like.create({
        tweet : tweetId,
        likedBy : req.user?._id
    });
    
    if(!like) throw new ApiError(401, "Tweet was not liked");

    return res.status(200).json(new ApiResponse(200, like, "Tweet was liked"));
});

export const getLikedVideos = asyncHandler(async(req, res) => {
    // TODO :- get all liked videos
    // Steps :- 
    // Fetch the user Id and check it
    // Match the user
    // Look for all the liked records
    // Filter the one with video field
    // regex to check for empty :- /^\s*$/

    if(!req.user?._id) throw new ApiError(401, "User not found");

    const likedVideos = await User.aggregate([
        {
            $match : {
                _id : req.user?.id
            }
        },
        {
            $lookup : {
                from : "likes",
                foreignField : "likedBy",
                localField : _id,
                as : "likes"
            }
        },
        {
            $filter : {
                input : "$Likes",
                as : "like",
                cond : {$regexMatch: { input: "$$like.video", regex: /^p/ }}
            }
        },
        // TODO :- Fetch the Liked Videos
    ]); 

});
