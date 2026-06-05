import express from "express";
import {
  getUserProgress,
  getUserDashboard,
  getCompletionStats,
  startModule,
  getModuleProgress
} from '../controllers/progressController.js';

const router = express.Router();

router.post('/start-module', startModule);
router.get('/module-progress/:userId/:moduleId', getModuleProgress);
router.get('/user/:userId/progress', getUserProgress);
router.get('/dashboard/:userId', getUserDashboard);
router.get('/stats/:userId/', getCompletionStats);


export default router;
