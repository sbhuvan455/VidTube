import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet, getTweetById } from "../controllers/tweet.controller.js";


const router = Router();

router.use(verifyJWT);

router.route("/").post(createTweet)
router.route("/users/:userId").get(getUserTweets)
router.route("/:tweetId").patch(updateTweet).get(getTweetById);
router.route("/:tweetId").delete(deleteTweet)

export default router;