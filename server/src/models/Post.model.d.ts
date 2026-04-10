import mongoose, { Document } from "mongoose";
export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    images: string[];
    mediaType: 'image' | 'video' | 'pdf' | 'gif';
    likes: mongoose.Types.ObjectId[];
    commentsCount: number;
    createdAt: Date;
}
declare const _default: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost, {}, mongoose.DefaultSchemaOptions> & IPost & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPost>;
export default _default;
//# sourceMappingURL=Post.model.d.ts.map