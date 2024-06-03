import { Comment } from "../models/comment.models";
import { Video } from "../models/video.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const comments = await Video.aggregate([
        {
            $match: {
                _id : videoId
            },
            $lookup: {
                from : "comment",
                localField : "_id",
                foreignField : "video",
                as : "comments"
            },
        }
    ]); 
    if(comments === 0) throw new ApiError(401, "No Commenst Found");

    console.log(comments);

    return res.status(200).json(new ApiError(200, comments, "Comments fetchded successfully"));
});

export const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId, content, ownerId} = req.params;
    
    //validations for fields
    if([videoId, content, content].some(field => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const comment = await Comment.create(
        
    )
});

export const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId, content} = req.params;

    if(!(commentId && content)) throw new ApiError(401, "Comment info N/A")

    const comment = await Comment.findByIdAndUpdate(commentId, {
    $set : {
        content : content
    }},
    {
        new: true
    });

    return res.status(200).json(200, comment, "Comment updated successfully")
});

export const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params;

    if(!commentId) throw new ApiError(401, "Comment Id N/A");

    Comment.findByIdAndDelete(commentId);

    return res.status(200).json(200, {}, "Comment deleted successfully");
});




