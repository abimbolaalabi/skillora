import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();
import { createAssignment, getAssignments, getMyAssignedModules, getAssignmentByRole, deleteAssignment } from "../controllers/assignmentController.js";

// TODO: wire up assignment controller methods
router.get(
    "/getAssignments", 
    authMiddleware, 
    roleMiddleware("admin", "manager"),
    getAssignments);

router.get(
    "/getMyAssignedModules", 
    authMiddleware,  
    getMyAssignedModules); //for employees to view their assigned modules

router.get("/getAssignmentByRole/:role", authMiddleware, getAssignmentByRole);

router.delete("/deleteAssignment/:id", authMiddleware,  roleMiddleware("admin", "manager"), deleteAssignment);

router.post(
    "/createAssignment", 
    authMiddleware, 
    roleMiddleware("admin", "manager"), 
    createAssignment);

export default router;
