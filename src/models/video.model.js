import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    duration: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginates);

export const Video = mongoose.model("Video", videoSchema);
