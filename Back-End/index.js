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
import saveEventsRoutes from "./Features/SaveEvents/routes/saveEventsRoutes.js";
import registerRoutes from "./Features/EventRegister/routes/registerRoutes.js";



import messageRoutes from "./Features/Team-Chat/routes/message.route.js"

import teamRoutes from './Features/Team-collaboration/routes/team.route.js'

import friendRoutes from "./Features/Network/routers/friendRoutes.js";

import notificationRoutes from './Features/Notifications/routes/Notification.route.js';

import resumeRoutes from './Features/Portfolio-Builder/routes/resumeRoutes.js';



// Environment configuration
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 5000;

// Dynamic CORS configuration based on environment
const allowedOrigins = [
  'http://localhost:3000',  // Local development
  process.env.DEPLOYED_CLIENT_URL || 'https://skill-forge-web-application-frontend.onrender.com',
  'https://www.skill-forge.io',  // Custom domain with www
  'https://skill-forge.io',      // Root domain (no www)
  'https://server.skill-forge.io' // Backend domain
];

// Create HTTP server using Express app
const server = http.createServer(app);

// Create Socket.IO server with cross-origin support
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`Origin ${origin} not allowed by CORS policy`);
        callback(null, false); // IMPORTANT: Reject unauthorized origins in production
      }
    },
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

  // Listen for join event (called after authentication)
  socket.on('join', ({ userId }) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined personal room`);
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

  // Friend-related events
  socket.on('friendRequest', (data) => {
    if (data.to) {
      io.to(`user:${data.to}`).emit('friend_request_received', data);
    }
  });

  socket.on('friendRequestAccepted', (data) => {
    if (data.to) {
      io.to(`user:${data.to}`).emit('friend_request_accepted', data);
    }
  });

  socket.on('friendRequestRejected', (data) => {
    if (data.to) {
      io.to(`user:${data.to}`).emit('friend_request_rejected', data);
    }
  });

  socket.on('friendRequestCancelled', (data) => {
    if (data.to) {
      io.to(`user:${data.to}`).emit('friend_request_cancelled', data);
    }
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

// Configure CORS with dynamic origins
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Origin ${origin} not allowed by CORS policy`);
      callback(null, false); // Reject unauthorized origins in production
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Increased payload limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increased payload limit
app.use(cookieParser()); // to allow us parse incoming cookies



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
app.use("/api/teams", teamRoutes);
app.use("/api/messages", messageRoutes);

// Notification routes
 app.use("/api/notifications", notificationRoutes);

// Ensure the notifications route is properly registered
// Check if it's already registered before adding it
if (!app._router.stack.some(layer =>
    layer.route &&
    (layer.route.path === '/api/notifications' || layer.regexp.toString().includes('notifications'))
)) {
  app.use('/api/notifications', notificationRoutes);
  console.log('📣 Notification routes registered successfully');
}

app.use("/Details", eventRoutes);
app.use("/api", saveEventsRoutes);
app.use("/api", registerRoutes);

app.use("/api/messages", messageRoutes);
app.use("/api/teams", teamRoutes);

app.use("/api/friends", friendRoutes);

app.use("/api/resumes", resumeRoutes);



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
