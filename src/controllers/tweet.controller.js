import mongoose, { Schema } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";


export const createTweet = AsyncHandler(async (req, res) => {
    const { content } = req.body;

    if(!content){
        throw new ApiError(400, "Content not Recieved");
    }

    const newTweet = await Tweet.create({
        owner: req.user,
        content
    })

    if(!newTweet){
        throw new ApiError(500, "Unable to Tweet");
    }

    res.status(200)
    .json(
        new ApiResponse(200, "Tweet created successfully", newTweet)
    )
})

export const getUserTweets = AsyncHandler(async (req, res) => {
    const { userId } = req.params;

    if(!userId){
        throw new ApiError(400, "UserId not Recieved");
    }

    const requiredTweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        }
    ])

    if(requiredTweets.length === 0){
        throw new ApiError(404, "No Tweets Found");
    }

    res.status(200)
    .json(
        new ApiResponse(200, "Tweets fetched successfully", requiredTweets)
    )
})

export const updateTweet = AsyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if(!tweetId) {
        throw new ApiError(404, "No Tweets Found");
    }

    const { content } = req.body;

    if(!content){
        throw new ApiError(401, "New Content not recieved")
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "Tweets not found")
    }

    if(!req.user._id.equals(tweet.owner._id)){
        throw new ApiError(401, "unauthorized User");
    }

    tweet.content = content;
    tweet.save();

    res.status(200)
    .json(
        new ApiResponse(200, "Tweet updated successfully", tweet)
    )

})

export const deleteTweet = AsyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if(!tweetId){
        throw new ApiError(404, "Tweet not found")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!req.user._id.equals(tweet.owner._id)){
        new ApiError(401, "UnAuthorized User")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    res.status(200)
    .json(
        new ApiResponse(200, "tweet deleted successfully", deletedTweet)
    )
})