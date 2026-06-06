import express from "express";
import {deleteLesson, updateLesson, getLessons} from "../controllers/lessonController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const Router = express.Router()

Router.get("/getLessons", authMiddleware, getLessons);
Router.patch("/updateLesson/:id", authMiddleware, roleMiddleware("admin"), updateLesson);
Router.delete("/deleteLesson/:id", authMiddleware, roleMiddleware("admin"), deleteLesson);

export default Router