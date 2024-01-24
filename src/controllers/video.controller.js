import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";


export const getAllVideos = AsyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userID } = req.query;

    const pipeline = [];
    
    if(query){
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            }
        })
    }

    if(userID) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userID)
            }
        })
    }

    const sortField = sortBy || 'views';
    const sortOrder = (sortType === 'asc') ? 1 : -1;

    pipeline.push({
        $sort: {
            [sortField] : sortOrder
        }
    })

    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });

    pipeline.push({
        $limit: parseInt(limit)
    })

    const videos = await Video.aggregate(pipeline);

    if (!videos || videos.length === 0) {
        throw new ApiError(404, 'Videos not found');
    }    

    res.status(200)
    .json(
        new ApiResponse(200, "videos fetched successfully", videos)
    )

})

export const publishVideo = AsyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if((!title) || (!description)){
        throw new ApiError(400, "Both Title and description are required");
    }

    const { videoFile, thumbnail } = req.files

    if((!videoFile) || (!thumbnail)){
        throw new ApiError(400, "Both videoFile and Thumbnail are required");
    }

    console.log("file retrieved from multer")


    const videoFileLocalStorage = videoFile[0]?.path;
    const thumbnailLocalStorage = thumbnail[0]?.path;


    const ThumbnailCloudinary = await uploadOnCloudinary(thumbnailLocalStorage)
    const videFileCloudinary = await uploadOnCloudinary(videoFileLocalStorage);


    const video = await Video.create({
        videoFile: videFileCloudinary.url,
        Thumbnail: ThumbnailCloudinary.url,
        title,
        description,
        duration: (videFileCloudinary.duration/60),
        owner: req.user
    })

    if(!video){
        throw new ApiError(500, "unable to upload video on database")
    }

    res.status(200)
    .json(
        new ApiResponse(200, "video published successfully", video)
    )

})

export const getVideoById = AsyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId) {
        throw new ApiError(400, "Video Id Not Found");
    }
    
    const video = await Video.findById(videoId);

    if(!video) {
        throw new ApiError(404, "Video Not Found");
    }

    req.user.watchHistory.push(video);
    req.user.save({ validateBeforeSave: false })

    res.status(200)
    .json(
        new ApiResponse(200, "Video Found Successfully", video)
    )
})

export const updateVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId) {
        throw new ApiError(422, "VideoID not recieved")
    }

    const video = await Video.findById(videoId);

    if (!req.user._id.equals(video.owner._id)) {
        throw new ApiError(401, "User unauthorized");
    }

    const { title, description } = req.body;

    if(title){
        video.title = title;
    }

    if(description){
        video.description = description;
    }

    const thumbnail = req.file?.path;

    if(thumbnail){
        
        const newThumbnail = await uploadOnCloudinary(thumbnail);

        if(!newThumbnail){
            throw new ApiError(500, "Error uploading thumbnail")
        }

        deleteFromCloudinary(video.Thumbnail);

        video.Thumbnail = newThumbnail.url;
    }

    video.save();

    res.status(200)
    .json(
        new ApiResponse(200, "Video Updated successfully", video)
    )
})

export const deleteVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!videoId){
        throw new ApiError(422, "VideoID not found");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(422, "Video not found");
    }

    if(!req.user._id.equals(video.owner._id)){
        throw new ApiError(401, "UnAuthorized User");
    }

    await deleteFromCloudinary(video.Thumbnail)
    await deleteFromCloudinary(video.videoFile)

    const result = await Video.findByIdAndDelete(videoId);
    console.log(result);

    res.status(200)
    .json(
        new ApiResponse(200, "Video Deleted Successfully", result)
    )

})

export const togglePublishStatus = AsyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Video Id not Found")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video Not Found")
    }

    if(!req.user._id.equals(video.owner._id)){
        throw new ApiError(400, "UnAuthorized requests")
    }

    video.isPublished = !(video.isPublished)
    video.save({validateBeforeSave: false});

    res.status(200)
    .json(
        new ApiResponse(200, "Successfully updated", video)
    )
})