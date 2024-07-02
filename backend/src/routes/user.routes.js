import { Router } from "express";
import { LoginUser, Logout, RegisterUser, changeUserPassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]),RegisterUser)

router.route('/login').post(LoginUser);
router.route('/logout').post(verifyJWT, Logout);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeUserPassword);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/c/:username').get(verifyJWT, getUserChannelProfile);
router.route('/history').get(verifyJWT, getUserWatchHistory);

export default router;