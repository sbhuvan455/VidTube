import mongoose from "mongoose";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js"

export const toggleSubscription = AsyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if(!channelId) {
        throw new ApiError(404, "Channel not found");
    }

    const channelExists = User.findById(channelId);

    if(!channelExists) {
        throw new ApiError(404, "Channel not found");
    }

    const userID = req.user._id;
    if(!userID){
        throw new ApiError(401, "Unauthorized user");
    }

    try {

        const document = {
            subscriber: userID,
            channel: channelId
        }
        
        const requestedDocument = await Subscription.findOne(document);

        if(requestedDocument){
            const deletedDocument = await Subscription.findByIdAndDelete(requestedDocument._id);

            return res
            .status(200)
            .json(
                new ApiResponse(200, "Unsubscribed Successfully", deletedDocument)
            )
        }else{
            const createdDocument = await Subscription.create(document);

            return res
            .status(200)
            .json(
                new ApiResponse(200, "Subscribed Successfully", createdDocument)
            )
        }

    } catch (error) {
        throw new ApiError(500, error.message);
    }
})

export const getUserChannelSubscribers = AsyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId) {
        throw new ApiError(404, "Channel not found");
    }

    const Subscribers = await Subscription.aggregate(
        [
            {
              '$match': {
                'channel': new mongoose.Types.ObjectId(channelId)
              }
            }
        ]
    )

    if(Subscribers.length < 1){
        throw new ApiError(404, "No subscribers Found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Subscribers Found", Subscribers)
    )
})

export const getSubscribedChannels = AsyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId){
        throw new ApiError(404, "Subscriber Not Found");
    }

    const Channels = await Subscription.aggregate(
        [
            {
              '$match': {
                'subscriber': new mongoose.Types.ObjectId(subscriberId)
              }
            }
        ]
    )

    if(Channels.length < 1){
        throw new ApiError(404, "No Channels Found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Channels Found", Channels)
    )
})