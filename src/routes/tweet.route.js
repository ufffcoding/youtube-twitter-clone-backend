import express from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addTweet,
  deleteTweet,
  getAllTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";

const router = express.Router();

router.route("/getAllTweets/:userId").post(getAllTweets);

router.route("/addTweet").post(verifyJWT, addTweet);

router.route("/updateTweet").post(verifyJWT, updateTweet);

router.route("/deleteTweet/:tweetId").post(verifyJWT, deleteTweet);

export default router;
