import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import { Tweet } from "../models/tweet.model.js"

export const getVideoComments = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 100 } = req.query

    if(!videoId) throw new ApiError(400, "videoId not found")
    const video = await Video.findById(videoId)

    if(!video) throw new ApiError(404, "video not found")

    const options = {
        page,
        limit
    }

    const CommentList = await Comment.aggregate([
        {
            $match: {
                'video': new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner_details'
            }
        },
        {
            $unwind: '$owner_details',
        },
        {
            $sort: {
                'createdAt': -1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Success", CommentList)
    )
})

export const addComment = AsyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { comment } = req.body;

    if(!videoId) throw new ApiError(400, "No Video ID provided")
    if(!comment) throw new ApiError(400, "comment not Provided from the user")
    
    const video = await Video.findById(videoId);
    if(!video) throw new ApiError(400, "Video not Found")

    const user = req.user._id;
    if(!user) throw new ApiError(400, "User not Authenticated")

    const newComment = await Comment.create({
        content: comment,
        video: new mongoose.Types.ObjectId(videoId),
        owner: new mongoose.Types.ObjectId(user)
    })

    if(!newComment) throw new ApiError(500, "Unable to create Comment")

    const populatedComment = await Comment.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(newComment._id) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner_details'
            }
        },
        {
            $unwind: '$owner_details'
        }
    ]);
    

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Comment Added", populatedComment[0])
    )
})

export const updateComment = AsyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body;

    const originalComment = await Comment.findById(commentId);
    if(!originalComment) throw new ApiError(404, "Comment not found");

    if(!comment) throw new ApiError(404, "new commwnt not recieved");

    const user = req.user._id;
    if(!user) throw new ApiError(400, "User not Authenticated")

    if(!user.equals(originalComment.owner)) throw new ApiError(400, "User not Authorised to edit the comment");

    originalComment.content = comment;
    await originalComment.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, "comment updated successfully", originalComment)
        )

})

export const deleteComment = AsyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if(!commentId) throw new ApiError(404, "Comment ID not recieved");

    const comment = await Comment.findById(commentId);
    if(!comment) throw new ApiError(400, "invalind comment Id");

    const userId = req.user._id;
    if(!userId) throw new ApiError(400, "User not Authenticated")

    if(!userId.equals(comment.owner)) throw new ApiError(400, "User not Authorised to delete the comment");

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if(!deletedComment) throw new ApiError(500, "Unable to delete the comment");

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Comment deleted successfully", deletedComment)
        )

})

export const getTweetComments = AsyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if(!tweetId) throw new ApiError(400, "tweetId is required");

    const comments = await Comment.aggregate([
        {
            '$match': {
                tweet: new mongoose.Types.ObjectId(tweetId)
            }
        },
        {
            '$lookup': {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        {
            '$unwind': '$ownerDetails',
        },
        {
            $sort: {
                'createdAt': -1
            }
        }
    ])

    if(!comments) throw new ApiError(400, "tweet comments not found");

    res.status(200).json(
        new ApiResponse(200, "comments fetched successfully", comments)
    )
})

export const addTweetComment = AsyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { comment } = req.body;

    if(!tweetId) throw new ApiError(400, "No Tweet ID provided")
    if(!comment) throw new ApiError(400, "comment not Provided from the user")
    
    const tweet = await Tweet.findById(tweetId);
    if(!tweet) throw new ApiError(400, "Tweet not Found")

    const user = req.user._id;
    if(!user) throw new ApiError(400, "User not Authenticated")

    const newComment = await Comment.create({
        content: comment,
        tweet: new mongoose.Types.ObjectId(tweetId),
        owner: new mongoose.Types.ObjectId(user)
    })

    if(!newComment) throw new ApiError(500, "Unable to create Comment")

    const populatedComment = await Comment.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(newComment._id) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        {
            $unwind: '$ownerDetails'
        }
    ]);
    

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Comment Added", populatedComment[0])
    )
})