import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import "./config/env.js";

import connectDB from './config/db.js';

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js"
import quizRoutes from "./routes/quizRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"



connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL , credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/progress',    progressRoutes);
app.use('/api/analytics',   analyticsRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/notifications', notificationRoutes);
// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Skillora server running on port ${PORT}`));
