import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  getAllVideos,
  uploadVideo,
  getVideoById,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/getAllVideos").get(getAllVideos);

router.route("/uploadVideo").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

router.route("/getVideoById/:videoId").get(getVideoById);

router.route("/deleteVideo/:videoId").get(deleteVideo);

router.route("/updateVideo").get(updateVideo);

router.route("/togglePublishStatus/:videoId").get(togglePublishStatus);

export default router;
