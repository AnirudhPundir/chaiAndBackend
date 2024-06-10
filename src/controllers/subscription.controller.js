import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js";
import {Subscriptions} from "../models/subscription.models.js"
import {User} from "../models/user.models.js"

export const toggleSubscription = asyncHandler(async(res, res) => {
    const {channelId} = req.params;
    // TODO: toggle subscription

    if(!channelId) throw new ApiError(401, "Channel Id Missing");

    if(!req.user?._id) throw new ApiError(401, "User not present");

    const subscription = await Subscriptions.create({
        channel : channelId,
        subscriber : req.user?._id
    });

    if(!subscription) throw new ApiError(401, "Subscription unsuccessful");

    return res.status(200).json(200, subscription, "Subscription successfull");
});

export const getUserChannelSubscribers = asyncHandler(async(req, res) => {
    const {channelId} = req.params;

    if(!channelId) throw new ApiError(401, "Channel Id missing");

    const SubsciberList = await User.aggregate([
        {
            $match : {
                _id : channelId
            },
            $lookup: {
                from : "subscriptions",
                localField : "_id",
                foreignField : "subscriber",
                as : "userList",
                pipeline : [
                    {
                        $lookup: {
                            from : "user",
                            localField : "subscriber",
                            foreignField : "_id",
                            as : "subscriber",
                            pipeline : {
                                $project : {
                                    fullName : 1,
                                    username : 1,
                                    avatar : 1
                                }
                            }
                        }
                    }
                ]
            }
        }   
    ]);

    if(!(SubsciberList && SubsciberList.length <= 0)) throw new ApiError(401, "No Subs found");

    return res.status(200).json(200, SubsciberList, "Channel Subscribers");
});

export const getSubscribedChannels = asyncHandler(async(req, res) => {
    const {subscriberId} = req.params;

    if(!subscriberId) throw new ApiError(401, "Subscriber Id missing");

    const subbedChannels = await User.aggregate([
        {$match : {_id : subscriberId}},
        {
            $lookup : {
                from : "subscription",
                localField: "_id",
                foreignField: "channel",
                as: "channel",
                pipeline: [
                    {
                        $lookup: {
                            from : "user",
                            localField: "channel",
                            foreignField : "_id",
                            as : "channel",
                            pipeline: {
                                $project: {
                                    fullName: 1,
                                    username: 1,
                                    avatar : 1
                                }
                            }
                        }
                    }
                ]
            }
        }

    ]);
});