import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
export declare const createComment: (req: AuthRequest, res: Response) => Promise<any>;
export declare const getPostComments: (req: Request, res: Response) => Promise<any>;
export declare const likeComment: (req: AuthRequest, res: Response) => Promise<any>;
//# sourceMappingURL=Comment.controller.d.ts.map