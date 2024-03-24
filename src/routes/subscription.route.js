import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/:channelId").get(toggleSubscription);

router
  .route("/getUserChannelSubscribers/:channelId")
  .get(getUserChannelSubscribers);

router
  .route("/getSubscribedChannels/:channelId")
  .get(getSubscribedChannels);

export default router;
