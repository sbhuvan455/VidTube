import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
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

    if(!videos.length <= 0) throw new ApiError(404, "No videos found");

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Videos Found", videos)
        )
})