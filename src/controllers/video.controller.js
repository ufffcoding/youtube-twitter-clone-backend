import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { query } from "express";

const getAllVideos = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const sortType = req.query.sortType || "desc";
  const userId = req.query.userId;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const totalDocuments = await Video.countDocuments();

  if (userId) {
    query;
  }

  if (sortBy && sortType) {
    query;
  }

  const video = await Video.find()
    .skip(startIndex)
    .limit(limit)
    .sort({ [sortBy]: sortType })
    .where({ userId: userId });

  res.status(200).json(new ApiResponse(200, [{ totalDocuments }, { video }]));
});

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;

  if (!title && !description) {
    throw new ApiError(400, "Title and description is required");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;

  if (!videoFileLocalPath) {
    throw new ApiError(500, "Video is required");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(500, "Thumbnail is required");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);

  if (!videoFile) {
    throw new ApiError(500, "Video not uploaded on cloudinary");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(500, "Thumbnail not uploaded on cloudinary");
  }

  const video = await Video.create({
    videoFile: [{ url: videoFile.url }, { public_url: videoFile.public_id }],
    thumbnail: [{ url: thumbnail.url }, { public_url: thumbnail.public_id }],
    title,
    description,
    isPublished,
    owner: req.user?._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video Uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(404, "VideoId is needed");
  }

  const video = await Video.findById(videoId);

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(404, "Id is needed");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  if (!req.user?._id.equals(video.owner)) {
    throw new ApiError(404, "Only owner can delete video");
  }

  await Video.findByIdAndDelete(videoId);

  res
    .status(200)
    .json(new ApiResponse(200, videoId, "Video deleted successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId, title, description } = req.body;

  if (!videoId) {
    throw new ApiError(404, "VideoId is needed");
  }

  const video = await Video.findById(videoId);

  if (!req.user?._id.equals(video.owner)) {
    throw new ApiError(404, "Only owner can delete video");
  }

  const updatedVideo = await Video.findByIdAndUpdate(videoId, {
    title,
    description,
  });

  res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "Video updated successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(404, "VideoId is needed");
  }

  const video = await Video.findById(videoId);

  const status = video.isPublished ? false : true;

  await Video.findByIdAndUpdate(videoId, { isPublished: status });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        status,
        `${status ? "Your video is public" : "Your video is private"}`
      )
    );
});

export {
  getAllVideos,
  uploadVideo,
  getVideoById,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
};

// this is done
