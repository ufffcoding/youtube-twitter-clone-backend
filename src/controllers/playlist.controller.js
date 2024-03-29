import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "All the fields are requiered");
  }

  const userPlaylist = await Playlist.find({ owner: userId });

  if (!userPlaylist) {
    throw new ApiError(400, "Playlist not available user");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "Fetched user playlist successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "All the fields are requiered");
  }

  const playlist = await Playlist.findOne(playlistId);

  if (!playlist) {
    throw new ApiError(400, "Playlist does not exists");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Fetched user playlist successfully"));
});

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name && !description) {
    throw new ApiError(400, "All the fields are requiered");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user?._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  try {
    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { _id: playlistId },
      {
        name: name,
        description: description,
      },
      {
        new: true,
      }
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
      );
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  if (!videoId && !playlistId) {
    throw new ApiError(400, "All the fields are requiered");
  }

  const playlist = await Playlist.findOne({ _id: playlistId });

  if (!playlist.video.includes(videoId)) {
    await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $push: {
          video: videoId,
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, videoId, "Video added to playlist successfully")
      );
  } else {
    res.status(200).json(new ApiResponse(200, videoId, "Video already exists"));
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  if (!videoId && !playlistId) {
    throw new ApiError(400, "All the fields are requiered");
  }

  await Playlist.findByIdAndUpdate(playlistId, {
    $pull: {
      video: videoId,
    },
  });

  if (!playlistId) {
    throw new ApiError(400, "Invalid fields");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, videoId, "Video removed form playlist successfully")
    );
});

export {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  addVideoToPlaylist,
  updatePlaylist,
  removeVideoFromPlaylist,
};

// this is done
