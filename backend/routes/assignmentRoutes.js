import express from "express";
const router = express.Router();
const {createAssignment, getAssignments, getMyAssignedModules} = require("../controllers/assignmentController.js");

// TODO: wire up assignment controller methods
router.get("/getAssignments", getAssignments);
router.get("/getMyAssignedModules/:id", getMyAssignedModules);
router.post("/createAssignment", createAssignment);

export default router;
