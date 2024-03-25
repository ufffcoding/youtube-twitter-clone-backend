import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "TweetId is missing");
  }

  const tweets = await Tweet.find({ owner: userId });

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "All tweets fetched successfully"));
});

const addTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is missing");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });

  if (!tweet) {
    throw new ApiError(400, "Tweet not created");
  }

  res.status(200).json(new ApiResponse(200, tweet, "Tweet added successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId, content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is missing");
  }

  if (!tweetId) {
    throw new ApiError(400, "TweetId is missing");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
    content,
  });

  if (!updatedTweet) {
    throw new ApiError(400, "Tweet not updated");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "TweetId is missing");
  }

  await Tweet.findByIdAndDelete(tweetId);

  res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { getAllTweets, addTweet, updateTweet, deleteTweet };

// this is done