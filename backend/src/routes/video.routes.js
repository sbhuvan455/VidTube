import { Router } from "express";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllVideos);
router.route("/publish-video").post(verifyJWT, upload.fields(
    [
        { name: 'videoFile', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]
) ,publishVideo)
router.route("/:videoId").get(verifyJWT, getVideoById);
router.route("/update/:videoId").patch(verifyJWT, upload.single('thumbnail'), updateVideo);
router.route("/delete/:videoId").delete(verifyJWT, deleteVideo);
router.route('/togglepublishstatus/:videoId').patch(verifyJWT, togglePublishStatus);

export default router;