import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const router = express.Router();

router.route("/getLikedVideos").post(verifyJWT, getLikedVideos);

router.route("/toggleVideoLike/:videoId").post(verifyJWT, toggleVideoLike);

router
  .route("/toggleCommentLike/:commentId")
  .post(verifyJWT, toggleCommentLike);

router.route("/toggleTweetLike/:tweetId").post(verifyJWT, toggleTweetLike);

export default router;
