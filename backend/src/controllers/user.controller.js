import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { response } from "express";

const generateAccessAndRefreshToken = async (user_id) => {
    try {
        const user = await User.findById(user_id);
    
        if(!user) {
            throw new ApiError(500, "User not found while generating refresh token");
        }
    
        const access_token = await user.generateAccessToken();
        const refresh_token = await user.generateRefreshToken();
    
        if(!access_token){
            throw new ApiError(500, "Problem while generating access token");
        }
    
        if(!refresh_token){
            throw new ApiError(500, "Problem while generating refresh token");
        }
    
        user.refreshTokens = refresh_token;
        user.save({validateBeforeSave: false});
    
        return { access_token, refresh_token }
    } catch (error) {
        throw new ApiError(500, error.message);
    }

}

export const RegisterUser = AsyncHandler(async (req, res) => {
    const { username, password, email, fullname } = req.body;

    if(!username || !password || !email || !fullname){
        throw new ApiError(409, "All the Required fields are not filled");
    }

    const existingUser = await User.findOne({ $or:[ {username}, {email} ] });

    if(existingUser){
        throw new ApiError(409, "User Already Exists");
    }

    const avatarLocalStorage = req.files?.avatar?.[0]?.path;
    const coverImgLocalStorage = req.files?.coverImage?.[0]?.path;

    const avatar = (avatarLocalStorage) ? await uploadOnCloudinary(avatarLocalStorage) : undefined;
    const coverImage = (coverImgLocalStorage) ? await uploadOnCloudinary(coverImgLocalStorage) : undefined;

    const currentUser = await User.create({
        username,
        email,
        password,
        fullname,
        avatar: avatar?.url,
        coverImage: coverImage?.url
    })

    if(!currentUser){
        throw new ApiError(500, "Something went wrong while creating the new user");
    }

    const { access_token, refresh_token } = await generateAccessAndRefreshToken(currentUser._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("AccessToken", access_token, options)
    .cookie("RefreshToken", refresh_token, options)
    .json(
        new ApiResponse(200, "successfully logged in", currentUser)
    )
    
})

export const LoginUser = AsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if(!email && !username) {
        throw new ApiError(401, "Enter your username or email");
    }
    console.log('2');
    const user = await User.findOne({
        $or:[
            { username },
            {email}
        ]
    })

    if(!user) {
        throw new ApiError(401, "User not found");
    }

    const validatePassword = await user.isPasswordCorrect(password);

    if(!validatePassword) {
        throw new ApiError(400, "Invalid password");
    }

    const { access_token, refresh_token } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser =  await User.findById(user._id).select("-password -refresh-token");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("AccessToken", access_token, options)
    .cookie("RefreshToken", refresh_token, options)
    .json(
        new ApiResponse(200, "successfully logged in", loggedInUser)
    )

})

export const Logout = AsyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshTokens: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("RefreshToken", options)
    .json(new ApiResponse(200, "successfully logged out"))
})

export const refreshAccessToken = AsyncHandler(async (req, res) => {
    const refreshTokenFromBrowser = req.cookies?.RefreshToken;

    if(!refreshTokenFromBrowser){
        throw new ApiError(404, "RefreshToken not found");
    }

    const decoded_token = jwt.verify(refreshTokenFromBrowser, process.env.REFRESH_TOKEN_SECRET);

    if(!decoded_token) {
        throw new ApiError(409, "Invalid Refresh Token");
    }

    const user = await User.findById(decoded_token._id);

    if(!user) {
        throw new ApiError(409, "Invalid Refresh Token");       
    }

    if(refreshTokenFromBrowser != user.refreshTokens){
        throw new ApiError(409, "Refresh Token expired"); 
    }

    const options = {
        httpOnly: true,
        secure: true,
    }

    const { newAccessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    user.refreshTokens = newRefreshToken;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .cookie("AccessToken", newAccessToken, options)
    .cookie("RefreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(
            200, 
            "AccessToken updated successfully", 
            { AccessToken:newAccessToken, RefreshToken:newRefreshToken }
        )
    )
})

export const changeUserPassword = AsyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword){
        throw new ApiError("Both feilds needed");
    }

    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(404, "user not found");
    }

    const validatePassword = await user.isPasswordCorrect(oldPassword);

    if(!validatePassword){
        throw new ApiError(409, "Invalid Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res
    .status(201)
    .json(
        new ApiResponse(201, "password changed successfully")
    )
})

export const getCurrentUser = AsyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, "Current User Sent successfully", req.user)
    )
})

export const getUserChannelProfile = AsyncHandler(async (req, res) => {
    const { username } = req.params;

    if(!username) {
        throw new ApiError(400, "username not found");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup:
              {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "Subscribers"
              }
        },
        {
            $lookup:
              {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "SubscribedTo"
              }
        },
        {
            $addFields: {
                SubscribersCount: {
                    $size: "$Subscribers"
                },
                ChannelsSubscribedTo: {
                    $size: "$SubscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$Subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                fullname: 1,
                SubscribersCount: 1,
                ChannelsSubscribedTo: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404, "Channel not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Channel Data Fetched Successfully", channel[0])
    )
})

export const getUserWatchHistory = AsyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:
              {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullname: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    }
                ]
              }
         }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Watch History Fetched successfully", user[0].watchHistory)
    )
})