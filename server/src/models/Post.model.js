import mongoose, { Schema, Document } from "mongoose";
const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    mediaType: { type: String, enum: ['image', 'video', 'pdf', 'gif'], default: 'image' },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model("Post", PostSchema);
//# sourceMappingURL=Post.model.js.map