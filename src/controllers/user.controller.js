import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

export const RegisterUser = AsyncHandler(async (req, res) => {
    const { username, password, email, fullname } = req.body;

    if(!username || !password || !email || !fullname){
        throw new ApiError(409, "All the Required fields are not filled");
    }

    const existingUser = await User.findOne({ $or:[ {username}, {email} ] });

    if(existingUser){
        throw new ApiError(409, "User Already Exists");
    }

    const avatarLocalStorage = req.files?.avatar[0]?.path;

    if(!avatarLocalStorage){
        throw new ApiError(409, "Avatar not found");
    }

    const coverImgLocalStorage = req.files?.coverImage[0]?.path;

    const avatar = await uploadOnCloudinary(avatarLocalStorage);
    const coverImage = (coverImgLocalStorage)? uploadOnCloudinary(coverImgLocalStorage): "";

    if(!avatar) throw new ApiError(500, "Cloudinary avatar not found");

    const currentUser = await User.create({
        username,
        email,
        password,
        fullname,
        avatar: avatar.url,
        coverImage: (coverImage)?coverImage.url: ""
    })

    if(!currentUser){
        throw new ApiError(500, "Something went wrong while creating the new user");
    }

    return res.status(201).json(
        new ApiResponse(200, "Success", currentUser)
    )
    
})