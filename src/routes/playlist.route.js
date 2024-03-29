import express from "express";

import {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/getUserPlaylists/:userId").post(getUserPlaylists);

router.route("/getPlaylistById/:playlistId").post(getPlaylistById);

router.route("/createPlaylist/").post(verifyJWT, createPlaylist);

router.route("/updatePlaylist/:playlistId").post(verifyJWT, updatePlaylist);

router
  .route("/addVideoToPlaylist/:playlistId/:videoId")
  .post(verifyJWT, addVideoToPlaylist);

router
  .route("/removeVideoFromPlaylist/:playlistId/:videoId")
  .post(verifyJWT, removeVideoFromPlaylist);

export default router;
