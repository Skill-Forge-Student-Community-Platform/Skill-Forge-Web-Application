import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {v2 as cloudinary } from 'cloudinary';
import http from 'http'; // Import HTTP
import { Server } from 'socket.io'; // Import Socket.IO

 import fileUpload from 'express-fileupload'; // Add this import

import { connectDB } from "../Back-End/DataBase/DBconnector.js";

import authRoutes from "./Features/User-Authentication/routes/Authentication.js";
import profileRoutes from "./Features/User-Authentication/routes/profileRoutes.js";
import userSocialRoutes from "./Features/User-Data_flow/routes/user.route.js";
import postRoutes from "./Features/Posting-Feed/routes/Post.route.js";
import eventRoutes from "./Features/EventListing/routes/eventRoutes.js";

// Environment configuration
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server using Express app
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Match your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their own room based on user ID if authenticated
  socket.on('authenticate', (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} authenticated and joined personal room`);
    }
  });

  // Listen for post creation
  socket.on('createPost', (post) => {
    // Broadcast to all connected clients except sender
    socket.broadcast.emit('newPost', post);
  });

  // Listen for post likes
  socket.on('likePost', (data) => {
    io.emit('postLiked', data);
  });

  // Listen for comments
  socket.on('addComment', (data) => {
    io.emit('postCommented', data);
  });

  // Listen for shares/reposts
  socket.on('sharePost', (post) => {

    socket.broadcast.emit('newPost', post); // Shared posts appear as new posts
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Export io instance for use in controllers
export { io };

// Ensure upload directories exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads', 'profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created upload directories at:', uploadDir);
}

// Middleware setup
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: '5mb' })); // Increased payload limit
app.use(express.urlencoded({ limit: '5mb', extended: true })); // Increased payload limit
app.use(cookieParser()); // to allow us parse incoming cookies

// Comment out file upload middleware until package is installed

app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}));


// Alternative approach for file uploads using built-in middleware
// This is a temporary solution until express-fileupload is installed
const uploadMiddleware = express.static(path.join(process.cwd(), 'uploads'));
app.use('/uploads', uploadMiddleware);

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", profileRoutes);
app.use("/api/users", userSocialRoutes);
app.use("/api/posts", postRoutes);


app.use("/Details", eventRoutes);


app.get("/api", (req, res) => {
  res.send("Hello World");
});

// Add this test endpoint
app.get("/api/test-cloudinary", (req, res) => {
  try {
    const config = {
      cloudinaryConfig: {
        cloudName: cloudinary.config().cloud_name ? "✓ Set" : "✗ Missing",
        apiKey: cloudinary.config().api_key ? "✓ Set" : "✗ Missing",
        apiSecret: cloudinary.config().api_secret ? "✓ Set" : "✗ Missing",
      },
      envVars: {

        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
        apiKey: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing",
        apiSecret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing",
      }
    };

    res.json({
      status: "success",
      message: "Cloudinary configuration test",
      config
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// Use the HTTP server instead of the Express app to listen
server.listen(port, () => {
  connectDB();
  console.log(`Server is now running on port ${port}`);
  console.log(`Socket.IO server is ready`);
});
