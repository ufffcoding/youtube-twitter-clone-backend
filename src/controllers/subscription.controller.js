import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (req.user?._id.equals(channelId)) {
    throw new ApiError(400, "Can't subscribe to yourself");
  }

  // Check if the user is already subscribed to the channel
  const subscription = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (!subscription) {
    // If not subscribed, create a new subscription
    await Subscription.create({
      subscriber: req.user?._id,
      channel: channelId,
      subscribed: true,
    });
    res.status(200).json(new ApiResponse(200, {}, "Subscribed to channel"));
  } else {
    // If already subscribed, toggle subscription status
    subscription.subscribed = !subscription.subscribed;
    await subscription.save();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          ` ${subscription.subscribed ? "Subscribed" : "Unsubscribe"}`
        )
      );
  }
});

const getUserChannelSubscribers = async (req, res) => {
  const { channelId } = req.params;

  try {
    const subscribers = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
          subscribed: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscriber",
        },
      },
      {
        $unwind: "$subscriber",
      },
      {
        $project: {
          _id: 0,
          subscriber: {
            username: 1,
          },
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(200, subscribers, "Subscriber fetched successfully")
      );
  } catch (error) {
    console.error("Error while fetching subscribers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSubscribedChannels = async (req, res) => {
  const { channelId } = req.params;

  try {
    const subscriberTO = await Subscription.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(channelId),
          subscribed: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "subscribedTo",
        },
      },
      {
        $unwind: "$subscribedTo",
      },
      {
        $project: {
          _id: 0,
          subscribedTo: {
            username: 1,
          },
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(200, subscriberTO, "Subscriber fetched successfully")
      );
  } catch (error) {
    console.error("Error while fetching subscribers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };

// this is done
