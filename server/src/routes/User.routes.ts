import { Router } from "express";
import { signup, login, verifyEmail } from "../controllers/User.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);

export default router;
