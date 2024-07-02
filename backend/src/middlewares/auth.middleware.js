import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import  jwt  from "jsonwebtoken";

export const verifyJWT = AsyncHandler(async (req, res, next) => {
    try {
        const access_token = req.cookies?.AccessToken;

        if(!access_token){
            throw new ApiError(500, "Access token not Found");
        }

        const verifiedUser = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
        if(!verifiedUser){
            throw new ApiError(409, "access token not valid");
        }

        const user = await User.findById(verifiedUser._id).select("-password -refreshTokens");

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(500, error.message);
    }
})