import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createAssignment,
  getAssignments,
  getMyAssignedModules,
} from "../controllers/assignmentController.js";

const router = express.Router();

router.get("/getAssignments", getAssignments);
router.get("/getMyAssignedModules/:id", getMyAssignedModules);

router.post(
  "/createAssignment",
  authMiddleware,
  roleMiddleware("admin"),
  createAssignment
);

export default router;