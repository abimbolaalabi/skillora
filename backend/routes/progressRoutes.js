import express from "express";
import {
  getUserProgress,
  getUserDashboard,
  getCompletionStats,
  startModule,
  getModuleProgress
} from '../controllers/progressController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start-module', authMiddleware, startModule);
router.get('/module-progress/:userId/:moduleId', authMiddleware, getModuleProgress);
router.get('/user/:userId/progress', authMiddleware, getUserProgress);
router.get('/dashboard/:userId', authMiddleware, getUserDashboard);
router.get('/stats/:userId/', authMiddleware, getCompletionStats);


export default router;
