import Post from "../models/Post.model.js";
import { getIO } from "../utils/socket.js";
export const createPost = async (req, res) => {
    try {
        const { content, images, mediaType } = req.body;
        if (!content) {
            return res.status(400).json({ status: "fail", message: "Post content is required" });
        }
        const newPost = await Post.create({
            user: req.user._id,
            content,
            images: images || [],
            mediaType: mediaType || 'image'
        });
        const populatedPost = await newPost.populate("user", "name email");
        // Emit real-time update
        const io = getIO();
        io.emit("newPost", populatedPost);
        res.status(201).json({
            status: "success",
            data: { post: populatedPost },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate("user", "name email");
        if (!post) {
            return res.status(404).json({ status: "fail", message: "Post not found" });
        }
        res.status(200).json({
            status: "success",
            data: { post },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name email")
            .sort("-createdAt");
        res.status(200).json({
            status: "success",
            results: posts.length,
            data: { posts },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ user: userId })
            .populate("user", "name email")
            .sort("-createdAt");
        res.status(200).json({
            status: "success",
            results: posts.length,
            data: { posts },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ status: "fail", message: "Post not found" });
        }
        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            // Like
            post.likes.push(userId);
        }
        else {
            // Unlike
            post.likes.splice(likeIndex, 1);
        }
        await post.save();
        res.status(200).json({
            status: "success",
            data: { likes: post.likes },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
//# sourceMappingURL=Post.controller.js.map