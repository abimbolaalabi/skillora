import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from './config/db.js';
import authController from "./controllers/authController.js";

dotenv.config();

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
// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Skillora server running on port ${PORT}`));
