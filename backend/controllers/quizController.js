// controllers/quizController.js
import Quiz from '../models/Quiz.js';
import Module from "../models/Module.js"

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, userId } = req.params;
    const { answers } = req.body;

    // Validation
    if (!quizId) {
      return res.status(400).json({ success: false, message: 'quizId is required' });
    }
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'answers must be an array' });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Check if quiz is published
    if (!quiz.isPublished) {
      return res.status(403).json({ success: false, message: 'Quiz is not available' });
    }

    // Auto-grade and submit
    const submission = quiz.submitQuiz(userId, answers);
    await quiz.save();

    // Prepare response
    res.json({
      success: true,
      data: {
        submissionId: submission._id,
        totalScore: submission.totalScore,
        percentage: submission.percentage,
        passed: submission.passed,
        passingPercentage: quiz.passingPercentage,
        answers: submission.answers.map(ans => ({
          isCorrect: ans.isCorrect,
          score: ans.score,
          maxPoints: quiz.questions.find(q => q._id.toString() === ans.questionId.toString())?.points || 0
        }))
      }
    });
    
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getQuizScore = async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    if (!quizId) {
      return res.status(400).json({ success: false, message: 'quizId is required' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const submission = quiz.getLatestScoreForUser(userId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'No submissions found for this user' });
    }

    res.json({
      success: true,
      data: {
        score: submission.totalScore,
        percentage: submission.percentage,
        passed: submission.passed,
        submittedAt: submission.submittedAt,
        answers: submission.answers
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const {
      title,
      moduleId,
      questions,
      passingPercentage = 70,
      isPublished = false
    } = req.body;

    if (!title || !moduleId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title, moduleId, and questions are required'
      });
    }

    const quiz = new Quiz({
      title,
      moduleId,
      questions,
      passingPercentage,
      isPublished
    });

    await Module.findByIdAndUpdate(moduleId, {
      $addToSet: {
        quizzes: quiz._id
      }
    });

    await quiz.save();

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().lean();
    res.json({ success: true, data: quizzes });
  } catch (error) {
    console.error('Get all quizzes error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getQuizzesByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    if (!moduleId) {
      return res.status(400).json({ success: false, message: 'moduleId is required' });
    }

    const quizzes = await Quiz.find({ moduleId }).lean();
    res.json({ success: true, data: quizzes });
  } catch (error) {
    console.error('Get quizzes by module error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

