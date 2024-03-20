import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const video = await Video.aggregate([
    {
      $match: {
        owner: req.user?._id,
      },
    },
  ]);

  res.status(200).json(new ApiResponse(200, video));
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

const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(404, "Id is needed");
  }

  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  if (!req.user?._id.equals(video.owner)) {
    throw new ApiError(404, "Only owner can delete video");
  }

  await Video.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, id, "Video deleted successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { id, title, description } = req.body;
});

export { getAllVideos, uploadVideo, deleteVideo };
