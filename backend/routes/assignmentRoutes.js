import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
import { createAssignment, getAssignments, getMyAssignedModules } from "../controllers/assignmentController.js";

// TODO: wire up assignment controller methods
router.get("/getAssignments", getAssignments);
router.get("/getMyAssignedModules/:id", getMyAssignedModules);
router.post("/createAssignment", authMiddleware, roleMiddleware("admin"), createAssignment);

export default router;
