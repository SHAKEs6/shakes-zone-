import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Get allowed origins from environment
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];

// Setup socket.io server
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ Mongo error:", err);
    process.exit(1);
  });

// Simple API test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connection working ✅" });
});

// Serve static frontend if needed
app.use(express.static(path.join(__dirname, "../")));

// -------------------- SOCKET.IO LOGIC --------------------
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  // Register user
  socket.on("registerUser", (username) => {
    onlineUsers.set(socket.id, username);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.values()));
    console.log("Online:", Array.from(onlineUsers.values()));
  });

  // Handle game request
  socket.on("sendGameRequest", (data) => {
    const { to, from, game } = data;
    console.log(`🎮 Game request from ${from} to ${to} for ${game}`);
    // Find recipient socket
    const targetSocket = [...onlineUsers.entries()].find(([_, name]) => name === to);
    if (targetSocket) {
      io.to(targetSocket[0]).emit("receiveGameRequest", { from, game });
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    const username = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.values()));
    console.log("🔴 User disconnected:", username);
  });
});

// ---------------------------------------------------------

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
