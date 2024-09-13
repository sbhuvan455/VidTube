import { Router } from "express"; 
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription, isChannelSubscribed } from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT);

router
.route("/c/:channelId")
.post(toggleSubscription)

router.route("/c/get-subscribed-channels").get(getSubscribedChannels)

router.route("/u/:channelId").get(getUserChannelSubscribers);
router.route("/u/s/:channelId").get(isChannelSubscribed);

export default router;