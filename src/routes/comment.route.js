import express from "express";
import {
  getVideoComments,
  addComment,
  deleteComment,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/getVideoComments/:videoId").post(getVideoComments);

router.route("/addComment").post(verifyJWT, addComment);

router.route("/updateComment").post(verifyJWT, updateComment);

router.route("/deleteComment/:commentId").post(verifyJWT, deleteComment);

export default router;
