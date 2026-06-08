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
} from "../controllers/moduleController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/getAllModule", getAllModule);
router.get("/getModuleById/:id", getModuleById);
router.get("/:moduleId/getModuleWithLessons", getModuleWithLessons);
router.post("/:moduleId/addLessonToModule", authMiddleware, roleMiddleware("admin"), upload.single("video"), addLessonToModule);
router.patch("/updateModule/:id", authMiddleware, roleMiddleware("admin"), updateModule);
router.delete("/deleteModule/:id", authMiddleware, roleMiddleware("admin"), deleteModule);
router.patch("/publishModule/:id", authMiddleware, roleMiddleware("admin"), publishModule);

router.post(
  "/createModule",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("video"),
  createModule
);

export default router;