import express from 'express';
import { submitQuiz, getQuizScore, createQuiz, getAllQuizzes, getQuizzesByModule } from '../controllers/quizController.js';

const router = express.Router();

router.get('/getAllQuiz', getAllQuizzes);
router.get('/module/:moduleId', getQuizzesByModule);
router.post('/createQuiz', createQuiz);
router.post('/:quizId/submit/:userId', submitQuiz);
router.get('/:quizId/score/:userId', getQuizScore);



export default router;
