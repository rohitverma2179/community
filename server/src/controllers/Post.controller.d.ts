import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
export declare const createPost: (req: AuthRequest, res: Response) => Promise<any>;
export declare const getPostById: (req: Request, res: Response) => Promise<any>;
export declare const getPosts: (req: Request, res: Response) => Promise<any>;
export declare const getUserPosts: (req: Request, res: Response) => Promise<any>;
export declare const likePost: (req: AuthRequest, res: Response) => Promise<any>;
//# sourceMappingURL=Post.controller.d.ts.map