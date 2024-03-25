import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "VideoId is missing");
  }

  const videoComments = await Comment.find({ video: videoId });

  res
    .status(200)
    .json(
      new ApiResponse(200, videoComments, "All Comments fetched successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId, content } = req.body;

  if (!videoId) {
    throw new ApiError(400, "Video ID is missing");
  }

  if (!content) {
    throw new ApiError(400, "Content is missing");
  }

  const comment = await Comment.create({
    content,
    owner: req.user?._id,
    video: videoId,
  });

  if (!comment) {
    throw new ApiError(400, "Comment not created");
  }

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId, content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is missing");
  }

  if (!commentId) {
    throw new ApiError(400, "Comment is missing");
  }

  const updatedComment = await Comment.findByIdAndUpdate(commentId, {
    content,
  });

  if (!updatedComment) {
    throw new ApiError(400, "Comment not updated");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Comment is missing");
  }

  await Comment.findByIdAndDelete(commentId);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };

// this is done
