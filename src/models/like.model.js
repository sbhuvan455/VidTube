import mongoose, { Schema } from "mongoose";


const likesSchema = new Schema({
    Comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },

    Video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },

    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
}, {timestamps: true})


export const Like = new mongoose.model("Like", likesSchema)