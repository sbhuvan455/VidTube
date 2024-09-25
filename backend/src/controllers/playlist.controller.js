import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Video } from "../models/video.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

export const createPlaylist = AsyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name) {
        throw new ApiError(410, "Please provide a name fro the playist");
    }

    const thumbnail = req.file?.path;

    const owner = req.user._id;

    if(!owner) throw new ApiError(400, "Cannot get user");
    let newPlaylist;

    if(thumbnail){

        const thumbnailPublished = await uploadOnCloudinary(thumbnail)

        newPlaylist = await Playlist.create({
            name,
            description: description || "",
            videos: [],
            thumbnail: thumbnailPublished.url,
            owner
        })

    }else{
        newPlaylist = await Playlist.create({
            name,
            description: description || "",
            videos: [],
            owner
        })

    }

    if(!newPlaylist) throw new ApiError(500, "Unable to create the PLaylist");

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Playlist created successfully", newPlaylist)
    )
})

export const getUserPlaylists = AsyncHandler(async (req, res) => {
    const {userId} = req.params
    
    if(!userId) throw new ApiError(404, "userId not found");

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

export const getPlaylistById = AsyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if(!playlistId) throw new ApiError(400, "playlistId not found");

    const playlist = await Playlist.aggregate([
        {
            '$match': {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            '$lookup': {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        }
    ])

    if(!playlist) throw new ApiError(404, "No Playlist found with this Id")

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Playlist Found", playlist)
    )
})

export const addVideoToPlaylist = AsyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId) throw new ApiError(400, "playlistId is required");
    if (!videoId) throw new ApiError(400, "videoId is required");

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(400, "Invalid playlistId");

    if (!req.user._id.equals(playlist.owner)) throw new ApiError(400, "Unauthorized user");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(400, "Invalid videoId");

    playlist.videos.push(videoId);
    await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Video added successfully", playlist)
        );
});

export const removeVideoFromPlaylist = AsyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(400, "Invalid playlistId");

    if (!req.user._id.equals(playlist.owner)) throw new ApiError(400, "Unauthorized user");

    const videoIndex = playlist.videos.findIndex(id => id.equals(new mongoose.Types.ObjectId(videoId)));
    if (videoIndex === -1) {
        throw new ApiError(400, "Video not found in playlist");
    }

    playlist.videos.splice(videoIndex, 1);
    await playlist.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Video removed successfully", playlist)
    )
});

export const deletePlaylist = AsyncHandler(async (req, res) => {
    const { playlistId } = req.params
    
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(400, "Invalid playlistId");
    
    if (!req.user._id.equals(playlist.owner)) throw new ApiError(400, "Unauthorized user");
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if(!deletedPlaylist) throw new ApiError(500, "Unable to delete playlist");

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Playlist deleted successfully", deletedPlaylist)
    )
})

export const updatePlaylist = AsyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(400, "Invalid playlistId");
    
    if (!req.user._id.equals(playlist.owner)) throw new ApiError(400, "Unauthorized user");

    if(name) playlist.name = name;
    if(description) playlist.description = description;

    playlist.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Playlist updated successfully", playlist)
    )
})