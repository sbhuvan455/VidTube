import mongoose from "mongoose"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.models.js"
import { ApiError } from "../utils/ApiError.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"
import { Dislike } from "../models/dislike.model.js"

export const toggleVideoReaction = AsyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { type } = req.body;

    if (!videoId) throw new ApiError(400, "VideoId is required");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    const user = req.user._id;
    if (!user) throw new ApiError(404, "User not found");


    const likedVideo = await Like.findOne({
        video: new mongoose.Types.ObjectId(videoId),
        likedBy: new mongoose.Types.ObjectId(user)
    });


    const dislikedVideo = await Dislike.findOne({
        video: new mongoose.Types.ObjectId(videoId),
        dislikedBy: new mongoose.Types.ObjectId(user)
    });


    if (type === 'like') {
        if (dislikedVideo) {
            await Dislike.findByIdAndDelete(dislikedVideo._id);
        }

        if (likedVideo) {
            await Like.findByIdAndDelete(likedVideo._id);
            return res.status(200).json(
                new ApiResponse(200, "Like removed successfully")
            );
        } else {
            const newLikedVideo = await Like.create({
                video: new mongoose.Types.ObjectId(videoId),
                likedBy: new mongoose.Types.ObjectId(user)
            });

            if (!newLikedVideo) throw new ApiError(500, "Unable to like video");

            return res.status(200).json(
                new ApiResponse(200, "Video liked successfully", newLikedVideo)
            );
        }
    }


    if (type === 'dislike') {
        if (likedVideo) {
            await Like.findByIdAndDelete(likedVideo._id);
        }

        if (dislikedVideo) {
            await Dislike.findByIdAndDelete(dislikedVideo._id);
            return res.status(200).json(
                new ApiResponse(200, "Dislike removed successfully")
            );
        } else {
            const newDislikedVideo = await Dislike.create({
                video: new mongoose.Types.ObjectId(videoId),
                dislikedBy: new mongoose.Types.ObjectId(user)
            });

            if (!newDislikedVideo) throw new ApiError(500, "Unable to dislike video");

            return res.status(200).json(
                new ApiResponse(200, "Video disliked successfully", newDislikedVideo)
            );
        }
    }
});

export const toggleCommentReaction = AsyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { type } = req.body;

    if (!commentId) throw new ApiError(400, "CommentId is required");

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    const user = req.user._id;
    if (!user) throw new ApiError(404, "User not authenticated");

    const likedComment = await Like.findOne({
        comment: new mongoose.Types.ObjectId(commentId),
        likedBy: new mongoose.Types.ObjectId(user)
    });


    const dislikedComment = await Dislike.findOne({
        comment: new mongoose.Types.ObjectId(commentId),
        dislikedBy: new mongoose.Types.ObjectId(user)
    });


    if (type === 'like') {
        if (dislikedComment) {
            await Dislike.findByIdAndDelete(dislikedComment._id);
        }

        if (likedComment) {
            await Like.findByIdAndDelete(likedComment._id);
            return res.status(200).json(new ApiResponse(200, "Like removed successfully"));
        } else {
            const newLikedComment = await Like.create({
                comment: new mongoose.Types.ObjectId(commentId),
                likedBy: new mongoose.Types.ObjectId(user)
            });

            if (!newLikedComment) throw new ApiError(500, "Unable to like the comment");

            return res.status(200).json(new ApiResponse(200, "Comment liked successfully", newLikedComment));
        }
    }

    if (type === 'dislike') {
        if (likedComment) {
            await Like.findByIdAndDelete(likedComment._id);
        }

        if (dislikedComment) {
            await Dislike.findByIdAndDelete(dislikedComment._id);
            return res.status(200).json(new ApiResponse(200, "Dislike removed successfully"));
        } else {
            const newDislikedComment = await Dislike.create({
                comment: new mongoose.Types.ObjectId(commentId),
                dislikedBy: new mongoose.Types.ObjectId(user)
            });

            if (!newDislikedComment) throw new ApiError(500, "Unable to dislike the comment");

            return res.status(200).json(new ApiResponse(200, "Comment disliked successfully", newDislikedComment));
        }
    }
});

export const toggleTweetReaction = AsyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { type } = req.body; // "like" or "dislike"

    if (!tweetId) throw new ApiError(400, "TweetId is required");

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new ApiError(404, "Tweet not found");

    const user = req.user._id;
    if (!user) throw new ApiError(404, "User not authenticated");

    const likedTweet = await Like.findOne({
        tweet: new mongoose.Types.ObjectId(tweetId),
        likedBy: new mongoose.Types.ObjectId(user)
    });

    const dislikedTweet = await Dislike.findOne({
        tweet: new mongoose.Types.ObjectId(tweetId),
        dislikedBy: new mongoose.Types.ObjectId(user)
    });


    if (type === 'like') {
        if (dislikedTweet) {
            await Dislike.findByIdAndDelete(dislikedTweet._id);
        }


        if (likedTweet) {
            await Like.findByIdAndDelete(likedTweet._id);
            return res.status(200).json(new ApiResponse(200, "Like removed successfully"));
        } else {
            const newLikedTweet = await Like.create({
                tweet: new mongoose.Types.ObjectId(tweetId),
                likedBy: new mongoose.Types.ObjectId(user)
            });

            if (!newLikedTweet) throw new ApiError(500, "Unable to like the tweet");

            return res.status(200).json(new ApiResponse(200, "Tweet liked successfully", newLikedTweet));
        }
    }


    if (type === 'dislike') {
        if (likedTweet) {
            await Like.findByIdAndDelete(likedTweet._id);
        }

        if (dislikedTweet) {
            await Dislike.findByIdAndDelete(dislikedTweet._id);
            return res.status(200).json(new ApiResponse(200, "Dislike removed successfully"));
        } else {
            const newDislikedTweet = await Dislike.create({
                tweet: new mongoose.Types.ObjectId(tweetId),
                dislikedBy: new mongoose.Types.ObjectId(user)
            });

            if (!newDislikedTweet) throw new ApiError(500, "Unable to dislike the tweet");

            return res.status(200).json(new ApiResponse(200, "Tweet disliked successfully", newDislikedTweet));
        }
    }
});

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