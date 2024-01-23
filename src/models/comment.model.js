import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const commentsSchema = new Schema({
    content: {
        type: "String"
    },

    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})


commentsSchema.plugin(mongooseAggregatePaginate);

export const Comments = mongoose.model("Comment", commentsSchema);