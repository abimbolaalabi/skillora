import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createModule,
  addLessonToModule,
  getModuleWithLessons,
  getAllModule,
  getModuleById,
  updateModule,
  deleteModule,
  publishModule
} from "../controllers/assignmentController.js";

const router = express.Router();

router.get("/getAllModule", getAllModule);
router.get("/getModuleById/:id", getModuleById);
router.get("/:moduleId/getModuleWithLessons", getModuleWithLessons);
router.get("/:moduleId/addLessonToModule", addLessonToModule);
router.patch("/updateModule/:id", updateModule);
router.delete("/deleteModule/:id", deleteModule);
router.patch("/publishModule/:id", publishModule);

router.post(
  "/createModule",
  authMiddleware,
  roleMiddleware("admin"),
  createModule
);

export default router;