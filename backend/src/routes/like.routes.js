import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleVideoReaction, toggleCommentReaction, toggleTweetReaction, getLikesAndDislikes } from "../controllers/like.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoReaction);
router.route("/toggle/c/:commentId").post(toggleCommentReaction);
router.route("/toggle/t/:tweetId").post(toggleTweetReaction);
router.route("/videos").get(getLikedVideos);
router.route("/videos/:videoId").get(getLikesAndDislikes);

export default router;