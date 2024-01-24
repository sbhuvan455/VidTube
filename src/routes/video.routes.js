import { Router } from "express";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT)

router.route("/").get(getAllVideos);
router.route("/publish-video").post(upload.fields(
    [
        { name: 'videoFile', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]
) ,publishVideo)
router.route("/:videoId").get(getVideoById);
router.route("/update/:videoId").patch(upload.single('thumbnail'), updateVideo);
router.route("/delete/:videoId").delete(deleteVideo);
router.route('/togglepublishstatus/:videoId').patch(togglePublishStatus);

export default router;