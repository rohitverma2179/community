import mongoose, { Document } from "mongoose";
export interface IComment extends Document {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    parentComment: mongoose.Types.ObjectId | null;
    content: string;
    likes: mongoose.Types.ObjectId[];
    replies: mongoose.Types.ObjectId[];
    createdAt: Date;
}
declare const _default: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment, {}, mongoose.DefaultSchemaOptions> & IComment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IComment>;
export default _default;
//# sourceMappingURL=Comment.model.d.ts.map