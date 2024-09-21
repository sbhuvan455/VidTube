import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComments, updateComment, getTweetComments, addTweetComment } from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/:videoId").get(getVideoComments).post(addComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);
router.route("/t/:tweetId").get(getTweetComments)
router.route("/t/:tweetId").post(addTweetComment);

export default router;