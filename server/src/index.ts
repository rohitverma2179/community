import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import UserRoutes from "./routes/User.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
await connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow your React app's origin
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});