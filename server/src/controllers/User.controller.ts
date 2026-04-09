import type { Request, Response } from "express";
import User from "../models/User.model.js";
import type { IUser } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "30d",
  });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user._id.toString());
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1) Validation Checks
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ status: "fail", message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ status: "fail", message: "Invalid email address" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ status: "fail", message: "Passwords do not match" });
    }
    if (password.length < 8) {
      return res.status(400).json({ status: "fail", message: "Password must be at least 8 characters" });
    }

    // 2) Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "fail", message: "Email already registered" });
    }

    // 3) Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 4) Save User
    const newUser = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires,
    });

    // 5) Send Verification Email
    const verificationURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const message = `Please verify your email by clicking the link: ${verificationURL}`;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "Verify your email - Bexex Global",
        message,
      });

      res.status(201).json({
        status: "success",
        message: "Signup successful! Check your email to verify your account.",
      });
    } catch (err: any) {
      // ✅ FIX for 500 Error: If email fail, don't crash. Still allow signup in Dev mode.
      if (process.env.NODE_ENV !== 'production') {
        return res.status(201).json({
          status: "success",
          message: "Signup successful, BUT EMAIL FAILED TO SEND. check your server console for errors.",
          dev_error: err.message
        });
      }
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({ status: "error", message: "Error sending verification email. Try again." });
    }
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // 1) Validation
    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password" });
    }

    // 2) Find user & include password
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: "fail", message: "Incorrect email or password" });
    }

    // 3) Check if verified
    // ✅ FIX for 401 Error: Bypass email verify check for development
    if (!user.isVerified && process.env.NODE_ENV === 'production') {
      return res.status(401).json({ status: "fail", message: "Please verify your email to log in" });
    }

    // 4) Send token
    createSendToken(user, 200, res);
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token as any,
      verificationTokenExpires: { $gt: new Date() } as any,
    });

    if (!user) {
      return res.status(400).json({ status: "fail", message: "Token is invalid or has expired" });
    }

    user.isVerified = true;
    (user as any).verificationToken = undefined;
    (user as any).verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ status: "success", message: "Email verified successfully!" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { credential, accessToken } = req.body;

    let email, name, googleId;

    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) return res.status(400).json({ status: "fail", message: "Invalid Google token" });
      email = payload.email;
      name = payload.name;
      googleId = payload.sub;
    } else if (accessToken) {
      const { data } = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
      email = data.email;
      name = data.name;
      googleId = data.sub;
    } else {
      return res.status(400).json({ status: "fail", message: "Google credential or access token is required" });
    }

    if (!email) {
      return res.status(400).json({ status: "fail", message: "Email not provided by Google" });
    }

    let user = await User.findOne({ email });

    if (user) {
      // Update googleId if not present
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true,
      });
    }

    createSendToken(user, 200, res);
  } catch (error: any) {
    console.error("Google Login Error:", error.response?.data || error.message);
    res.status(500).json({ 
      status: "error", 
      message: error.response?.data?.error_description || error.message || "Google Login failed" 
    });
  }
};

export const facebookLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ status: "fail", message: "Facebook access token is required" });
    }

    const { data } = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
    );

    if (!data || !data.email) {
      return res.status(400).json({ status: "fail", message: "Invalid Facebook token or email missing" });
    }

    const { email, name, id: facebookId } = data;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.facebookId) {
        user.facebookId = facebookId;
        user.isVerified = true;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        facebookId,
        isVerified: true,
      });
    }

    createSendToken(user, 200, res);
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getMe = async (req: any, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};