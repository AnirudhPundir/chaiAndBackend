import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const getChannelStats = asyncHandler(async(req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    // Steps :-
    // 1. Fetch user id 
    // 2. Check if user is present
    // 3. Using agg. pipeline, match the user record
    // 4. Look for the userId in subcription model records present as channel property
    // 5. add the fetched records using agg. pipeline operator
    
    if(!req.user?._id) throw new ApiError(401, "User not logged in");

    const totalSubs = await User.aggregate([
        {$match : req.user?._id},
        {
            $lookup: {
                from: "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subs"
            },
            $lookup: {
                from: "videos",
                localField : "_id",
                foreignField : "owner",
                as : "vids"
            },
            $addFields: {
                subCount : {
                    $size: "$subs"
                },
                totalVids : {
                    $size: "$vids"
                },
                totalViews : {
                    $size : "$vids.views"
                },
                totalLikes : {
                    $size : "$vids.likes"
                }
            },
            $project: {
                subCount : 1
            }
        }
    ])



    return res.status(200).json(200, totalSubs, "Dashborad info fetched");
});

export const getChannelVideos = asyncHandler(async(req, res) => {
    // TODO: Get all the videos uploaded by the channel
    // Steps :-
    // get channel's user id
    // put a check on channel's user id 
    // create a agg pipeline
    // match for user data based on channel
    // fetch the vids based from video model

    if(!req.user?._id) throw new ApiError(401, "User id not present");

    const allVids = await User.aggregate([
        {
            $match : req.user?.id
        },
        {
            $lookup : {
                from : "Video",
                localField : "_id",
                foreignField : "owner",
                as : "Vids"
            }
        },
        {
            $project : {
                videoFile : 1,
                tile : 1,
                duration : 1,
                views : 1,
                createdAt : 1
            }
        }
    ]);
});