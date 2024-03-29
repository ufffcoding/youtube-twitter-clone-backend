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

router.route("/getAllVideos").get(getAllVideos);

router.route("/uploadVideo").post(
  verifyJWT,
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

router.route("/deleteVideo/:videoId").get(verifyJWT, deleteVideo);

router.route("/updateVideo").get(verifyJWT, updateVideo);

router
  .route("/togglePublishStatus/:videoId")
  .get(verifyJWT, togglePublishStatus);

export default router;
