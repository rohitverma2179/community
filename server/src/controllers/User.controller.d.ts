import type { Request, Response } from "express";
export declare const signup: (req: Request, res: Response) => Promise<any>;
export declare const login: (req: Request, res: Response) => Promise<any>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<any>;
export declare const googleLogin: (req: Request, res: Response) => Promise<any>;
export declare const facebookLogin: (req: Request, res: Response) => Promise<any>;
export declare const getMe: (req: any, res: Response) => Promise<any>;
export declare const logout: (req: Request, res: Response) => void;
//# sourceMappingURL=User.controller.d.ts.map