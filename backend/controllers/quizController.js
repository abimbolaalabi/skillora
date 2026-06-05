import Quiz from '../models/Quiz.js';

export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId, answers } = req.body;

    if (!quizId) {
      return res.status(400).json({ success: false, message: 'quizId is required' });
    }
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }
    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'answers must be an array' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const submission = quiz.submitQuiz(userId, answers);
    await quiz.save();

    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getQuizScore = async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    if (!quizId || !userId) {
      return res.status(400).json({ success: false, message: 'quizId and userId are required' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const submission = quiz.getLatestScoreForUser(userId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'No submissions found for this user' });
    }

    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
