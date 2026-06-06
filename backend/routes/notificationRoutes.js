import express from "express";
import { getNotifications, markAsRead, markMyAssignmentAsRead } from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const Router = express.Router()


Router.get("/getNotifications", authMiddleware, getNotifications)
Router.patch("/markAsRead/:id", authMiddleware, markAsRead);
Router.patch("/markMyAssignmentAsRead", authMiddleware, markMyAssignmentAsRead);

export default Router;