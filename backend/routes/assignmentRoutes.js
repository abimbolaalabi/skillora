import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();
import { createAssignment, getAssignments, getMyAssignedModules } from "../controllers/assignmentController.js";

// TODO: wire up assignment controller methods
router.get(
    "/getAssignments", 
    authMiddleware, 
    roleMiddleware("admin", "manager"),
    getAssignments);

router.get(
    "/getMyAssignedModules/:id", 
    authMiddleware,  
    getMyAssignedModules); //for employees to view their assigned modules

router.post(
    "/createAssignment", 
    authMiddleware, 
    roleMiddleware("admin", "manager"), 
    createAssignment);

export default router;
