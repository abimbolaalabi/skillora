import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { submitQuiz, getQuizScore} from '../controllers/quizController.js';

const router = express.Router();

router.post('/:quizId/submit/:userId', authMiddleware, submitQuiz);
router.get('/:quizId/score/:userId', authMiddleware, getQuizScore);



export default router;
