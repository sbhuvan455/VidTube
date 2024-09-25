import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import { Tweet } from "../models/tweet.model.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";

export const getChannelStats = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    if(!userId) throw new ApiError(400, "user not verified");

    const channelStats = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "owner",
            as: "videos",
            pipeline: [
              {
                $lookup: {
                  from: "likes",
                  localField: "_id",
                  foreignField: "video",
                  as: "likes"
                }
              },
              {
                $addFields: {
                  totalLikes: {
                    $size: "$likes"
                  }
                }
              }
            ]
          }
        },
      
        {
          $lookup: {
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
          }
        },
        {
          $addFields: {
              totalVideoViews: {
              $sum: "$videos.views"
            },
            totalSubscribers: {
              $size: "$subscribers"
            },
            totalVideos: {
              $size: "$videos"
            },
            totalLikes: {
              $sum: "$videos.totalLikes"
            }
          }
        },
        {
          $project: {
            totalVideoViews: 1,
            totalSubscribers: 1,
            totalVideos: 1,
            totalLikes: 1  
          }
        }
    ])

    if(!channelStats) throw new ApiError(500, "Unable to get channel stats")
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, "Channel Stats Fetched", channelStats)
        )
})

export const getChannelVideos = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    if(!userId) throw new ApiError(400, "user not verified");

    const videos = await Video.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(userId)
          }
        }
    ])

    if(videos.length <= 0) throw new ApiError(404, "No videos found");

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Videos Found", videos)
        )
})

export const getChannelTweets = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

    if(!userId){
        throw new ApiError(400, "User is not authorized");
    }

    const requiredTweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'tweet',
            as: 'likes'
          }
        },
        {
          $lookup: {
            from: 'dislikes',
            localField: '_id',
            foreignField: 'tweet',
            as: 'dislikes'
          }
        },
        {
          $addFields: {
            totalLikes: {
              $size: '$likes'
            },
            totalDislikes: {
              $size: '$dislikes'
            }
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

export const getChannelPlaylists = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  if(!userId){
    throw new ApiError(400, "User is not authorized");
  }

  const playlist = await Playlist.find({
      owner: new mongoose.Types.ObjectId(userId)
  })

  if(playlist.length < 1) throw new ApiError(404, "No Playlist found");

  return res
  .status(200)
  .json(
      new ApiResponse(200, "Playlist found successfully", playlist)
  )

})