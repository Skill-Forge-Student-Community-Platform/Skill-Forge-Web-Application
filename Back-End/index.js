import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { connectDB } from "../Back-End/DataBase/DBconnector.js";

import authRoutes from "./Features/User-Authentication/routes/Authentication.js";
import profileRoutes from "./Features/User-Authentication/routes/profileRoutes.js";

// Environment configuration
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

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
app.use(express.json()); // to allow parse incoming requests with JSON payloads
app.use(cookieParser()); // to allow us parse incoming cookies

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", profileRoutes);

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is now running on port ${port}`);
});
