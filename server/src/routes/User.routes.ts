import { Router } from "express";
import { signup, login, verifyEmail, googleLogin, facebookLogin } from "../controllers/User.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/google-login", googleLogin);
router.post("/facebook-login", facebookLogin);

export default router;
