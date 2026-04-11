import { Server } from "socket.io";
import http from "http";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      // origin: "http://localhost:5173",
       origin: "https://community-chi-eight.vercel.app", 
      //  origin: "https://testing.bexex.in", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};


export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
