import express from "express";
import {deleteLesson, updateLesson} from "../controllers/lessonController.js";

const Router = express.Router()

Router.patch("/updateLesson/:id", updateLesson);
Router.delete("/deleteLesson/:id", deleteLesson);

export default Router