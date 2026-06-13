import express from "express";
import {
  getUserProgress,
  getUserDashboard,
  getCompletionStats,
  startModule,
  getModuleProgress,
  completeLesson
} from '../controllers/progressController.js';


const router = express.Router();

router.post('/start-module/:userId/:moduleId', startModule);
router.get('/module-progress/:userId/:moduleId', getModuleProgress);
router.get('/userProgress/:userId', getUserProgress);
router.get('/dashboard/:userId',  getUserDashboard);
router.get('/stats/:userId/',  getCompletionStats);
router.post('/completeLesson/:userId/:moduleId/:lessonId', completeLesson);

export default router;
