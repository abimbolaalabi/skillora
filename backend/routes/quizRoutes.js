import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { submitQuiz, getQuizScore, createQuiz, getAllQuizzes, getQuizzesByModule } from '../controllers/quizController.js';

const router = express.Router();

router.get('/getAllQuiz', getAllQuizzes);
router.get('/module/:moduleId', getQuizzesByModule);
router.post('/createQuiz', authMiddleware, createQuiz);
router.post('/:quizId/submit/:userId', submitQuiz);
router.get('/:quizId/score/:userId', getQuizScore);



export default router;
