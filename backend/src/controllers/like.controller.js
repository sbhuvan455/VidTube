import mongoose from "mongoose"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.models.js"
import { ApiError } from "../utils/ApiError.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"
import { Dislike } from "../models/dislike.model.js"

export const toggleVideoLike = AsyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    if(!videoId) throw new ApiError(400, "VideoId is required")
    const video = await Video.findById(videoId)

    if(!video) throw new ApiError(404, "Video not found")
    const user = req.user._id;

    if(!user) throw new ApiError(404, "User not found");

    const likedVideo = await Like.findOne({
        Video: new mongoose.Types.ObjectId(videoId),
        likedBy: new mongoose.Types.ObjectId(user)
    })

    if(likedVideo){
        const dislikeVideo = await Like.findByIdAndDelete(likedVideo._id);

        if(!dislikeVideo) throw new ApiError(500, "Unable to dislike video")
        
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Video Disliked Successfully", dislikeVideo)
        )
    }else{
        const newLikedVideo = await Like.create({
            Video: new mongoose.Types.ObjectId(videoId),
            likedBy: new mongoose.Types.ObjectId(user)
        })

        if(!newLikedVideo) throw new ApiError(500, "Unable to Like Video")

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Video Liked Successfully", newLikedVideo)
        )
    }
})

export const toggleCommentLike = AsyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    if(!commentId) throw new ApiError(400, "Comment Not Found")

    const comment = await Comment.findById(commentId);
    if(!comment) throw new ApiError(400, "Comment Not Found")

    const user = req.user._id;
    if(!user) throw new ApiError(400, "User Not Authenticated")

    const LikedComment = await Like.findOne({
        Comment: new mongoose.Types.ObjectId(commentId),
        likedBy: new mongoose.Types.ObjectId(user)
    })

    if(LikedComment){
        const dislikedComment = await Like.findByIdAndDelete(LikedComment._id);
        if(!dislikedComment) throw new ApiError(500, "Unable to dislike the comment")

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Disliked The Comment", dislikedComment)
        )
    }else{
        const newLikeComment = await Like.create({
            Comment: new mongoose.Types.ObjectId(commentId),
            likedBy: new mongoose.Types.ObjectId(user)
        })

        if(!newLikeComment) throw new ApiError(500, "Unable to like the comment")

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Comment Liked Successfully", newLikeComment)
        )
    }
})

export const toggleTweetLike = AsyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    if(!tweetId) throw new ApiError(400, "Tweet Not Found")

    const tweet = await Tweet.findById(tweetId);
    if(!tweet) throw new ApiError(400, "Tweet Not Found")

    const user = req.user._id;
    if(!user) throw new ApiError(400, "User Not Authenticated")

    const LikedTweet = await Like.findOne({
        tweet: new mongoose.Types.ObjectId(tweetId),
        likedBy: new mongoose.Types.ObjectId(user)
    })

    if(LikedTweet){
        const dislikedTweet = await Like.findByIdAndDelete(LikedTweet._id);
        if(!dislikedTweet) throw new ApiError(500, "Unable to dislike the Tweet")

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Disliked The Tweet", dislikedTweet)
        )
    }else{
        const newLikeTweet = await Like.create({
            tweet: new mongoose.Types.ObjectId(tweetId),
            likedBy: new mongoose.Types.ObjectId(user)
        })

        if(!newLikeTweet) throw new ApiError(500, "Unable to like the tweet")

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Tweet Liked Successfully", newLikeTweet)
        )
    }    
})

export const getLikedVideos = AsyncHandler(async (req, res) => {
    const user = req.user._id;
    if(!user) throw new ApiError(400, "User Not Authenticated")

    const likedVideos = await Like.find({
        likedBy: new mongoose.Types.ObjectId(user),
        Video: {$exists: true}
    })

    if(likedVideos.length === 0) throw new ApiError(404, "no Liked Videos Found");

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Liked Videos Successfully", likedVideos)
    )
})

export const getLikesAndDislikes = AsyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if(!videoId) throw new ApiError(400, "Invalid request");
    
    const likes = await Like.find({video: new mongoose.Types.ObjectId(videoId)});
    if(!likes) throw new ApiError(500, "Unable to find likes");

    const numberOfLikes = likes.length;

    const dislikes = await Dislike.find({video: videoId});
    if(!dislikes) throw new ApiError(400, "Unable to find dislikes");

    const numberOfDislikes = dislikes.length;

    return res
        .status(200)
        .json(
            new ApiResponse(200, "fetched likes and dislikes", { numberOfLikes, numberOfDislikes })
        )
})