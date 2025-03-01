// wjUKK4m1ebtl9ghk
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from "../Back-End/DataBase/DBconnector.js";

import authRoutes from "./Features/User-Authentication/routes/Authentication.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); // to allow parse incoming requests with JSON payloads
app.use(cookieParser()); // to allow us parse incoming cookies
app.use("/api/auth", authRoutes);

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  connectDB();
  console.log("Server is now running on port 5000");
});
