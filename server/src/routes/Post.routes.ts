import { Router } from "express";
import { createPost, getPosts, getUserPosts, likePost } from "../controllers/Post.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getPosts);
router.get("/user/:userId", getUserPosts);
router.post("/", protect, createPost);
router.post("/:postId/like", protect, likePost);

export default router;
