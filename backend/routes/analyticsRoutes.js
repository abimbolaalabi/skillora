import express from "express";
import {
  getOverview,
  getModuleAnalytics,
  getUserAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

// All routes → GET /api/analytics/...
router.get("/overview", getOverview);
router.get("/modules",  getModuleAnalytics);
router.get("/users",    getUserAnalytics);

export default router;
