import express from "express";
import {
  getUserProgress,
  getUserDashboard,
  getCompletionStats,
  startModule,
  getModuleProgress
} from '../controllers/progressController.js';


const router = express.Router();

router.post('/start-module/:userId/:moduleId', startModule);
router.get('/module-progress/:userId/:moduleId',  getModuleProgress);
router.get('/userProgress/:userId',  getUserProgress);
router.get('/dashboard/:userId',  getUserDashboard);
router.get('/stats/:userId/',  getCompletionStats);


export default router;
