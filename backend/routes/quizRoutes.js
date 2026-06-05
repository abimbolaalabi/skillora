import express from 'express';
import { submitQuiz, getQuizScore } from '../controllers/quizController.js';

const router = express.Router();

router.post('/:quizId/submit', submitQuiz);
router.get('/:quizId/score/:userId', getQuizScore);

export default router;
