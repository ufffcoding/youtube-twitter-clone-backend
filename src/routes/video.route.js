import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  getAllVideos,
  uploadVideo,
  deleteVideo,
} from "../controllers/video.controller.js";

const router = express.Router();

router.route("/getAllVideos").post(verifyJWT, getAllVideos);

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

router.route("/deleteVideo").post(verifyJWT, deleteVideo);

export default router;
