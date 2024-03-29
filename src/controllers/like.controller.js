import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideo = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
        liked: true,
      },
    },
    {
      $project: {
        _id: 0,
        video: 1,
      },
    },
  ]);

  if (!likedVideo) {
    throw new ApiError(400, "Liked videos not fetched");
  }

  res
    .status(200)
    .json(new ApiResponse(200, likedVideo[0], "Fetched all liked videos"));
});

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "VideoId is missing");
  }

  const liked = await Like.findOne({
    video: videoId,
  });

  if (!liked) {
    // If not liked, create a new like
    await Like.create({
      likedBy: req.user?._id,
      video: videoId,
      liked: true,
    });
    res.status(200).json(new ApiResponse(200, {}, "Liked"));
  } else {
    // If already liked, toggle like status
    liked.liked = !liked.liked;
    await liked.save();
    res
      .status(200)
      .json(new ApiResponse(200, {}, ` ${liked.liked ? "Liked" : "Unliked"}`));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "CommentId is missing");
  }

  const liked = await Like.findOne({
    comment: commentId,
  });

  if (!liked) {
    // If not liked, create a new like
    await Like.create({
      likedBy: req.user?._id,
      comment: commentId,
      liked: true,
    });
    res.status(200).json(new ApiResponse(200, {}, "Liked"));
  } else {
    // If already liked, toggle like status
    liked.liked = !liked.liked;
    await liked.save();
    res
      .status(200)
      .json(new ApiResponse(200, {}, ` ${liked.liked ? "Liked" : "Unliked"}`));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "TweetId is missing");
  }

  const liked = await Like.findOne({
    tweet: tweetId,
  });

  if (!liked) {
    // If not liked, create a new like
    await Like.create({
      likedBy: req.user?._id,
      tweet: tweetId,
      liked: true,
    });
    res.status(200).json(new ApiResponse(200, {}, "Liked"));
  } else {
    // If already liked, toggle like status
    liked.liked = !liked.liked;
    await liked.save();
    res
      .status(200)
      .json(new ApiResponse(200, {}, ` ${liked.liked ? "Liked" : "Unliked"}`));
  }
});

export { getLikedVideos, toggleVideoLike, toggleCommentLike, toggleTweetLike };

// this is done
