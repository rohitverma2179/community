import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  images: string[];
  likes: mongoose.Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
