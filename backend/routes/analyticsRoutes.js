import express from "express";
import {
  getOverview,
  getModuleAnalytics,
  getUserAnalytics,
} from "../controllers/analyticsController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes → GET /api/analytics/...
router.get(
  "/overview", 
  authMiddleware,
  roleMiddleware("admin"), 
  getOverview);

router.get(
  "/modules",  
  authMiddleware, 
  roleMiddleware("admin", "manager"), 
  getModuleAnalytics);

router.get(
  "/users",    
  authMiddleware, 
  roleMiddleware("admin"), 
  getUserAnalytics);

export default router;
