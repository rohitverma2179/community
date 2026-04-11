import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import UserRoutes from "./routes/User.routes.js";
import PostRoutes from "./routes/Post.routes.js";
import CommentRoutes from "./routes/Comment.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { initSocket } from "./utils/socket.js";


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.io
initSocket(server);

// Connect to DB
await connectDB();

// Middleware
app.use(cors({

  origin: "https://community-chi-eight.vercel.app", // Allow your React app's origin
  // origin: "https://testing.bexex.in", // Allow your React app's origin
  // origin: "http://localhost:5173", // Allow your React app's origin
  credentials: true,               // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

// Home Check
app.get("/", (req, res) => {
  res.send("Server running! 🚀");
});

// Routes
app.use("/api/users", UserRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/comments", CommentRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});