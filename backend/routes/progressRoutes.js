import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUserProgress,
  getUserDashboard,
  getCompletionStats,
  startModule,
  getModuleProgress
} from '../controllers/progressController.js';


const router = express.Router();

router.post('/start-module/:userId/:moduleId', authMiddleware, startModule);
router.get('/module-progress/:userId/:moduleId', authMiddleware,  getModuleProgress);
router.get('/userProgress/:userId', authMiddleware,  getUserProgress);
router.get('/dashboard/:userId', authMiddleware,  getUserDashboard);
router.get('/stats/:userId/', authMiddleware,  getCompletionStats);

export default router;
