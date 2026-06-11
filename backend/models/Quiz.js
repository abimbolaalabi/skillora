
// models/Quiz.js
import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  passingPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ['single-choice', 'multiple-choice', 'true-false', 'short-answer', 'essay'],
      required: true
    },
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    correctAnswer: [String], // For short-answer and essay questions
    points: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  submissions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    answers: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      selectedAnswer: mongoose.Schema.Types.Mixed, // Can be string, array, etc.
      isCorrect: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        default: 0
      }
    }],
    totalScore: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    passed: {
      type: Boolean,
      default: false
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Method to autograde and submit quiz
quizSchema.methods.submitQuiz = function(userId, userAnswers) {
  // Find if user already submitted
  let existingSubmission = this.submissions.find(
    sub => sub.userId.toString() === userId.toString()
  );
  
  // Calculate total possible points
  const totalPossiblePoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  
  // Process each answer
  const gradedAnswers = this.questions.map((question, index) => {
    const userAnswer = userAnswers.find(a => a.questionId === question._id.toString());
    
    if (!userAnswer) {
      return {
        questionId: question._id,
        selectedAnswer: null,
        isCorrect: false,
        score: 0
      };
    }
    
    // Autograde based on question type
    const gradingResult = this.gradeQuestion(question, userAnswer.selectedAnswer);
    
    return {
      questionId: question._id,
      selectedAnswer: userAnswer.selectedAnswer,
      isCorrect: gradingResult.isCorrect,
      score: gradingResult.score
    };
  });
  
  // Calculate total score
  const totalScore = gradedAnswers.reduce((sum, ans) => sum + ans.score, 0);
  const percentage = (totalScore / totalPossiblePoints) * 100;
  const passed = percentage >= this.passingPercentage;
  
  const submissionData = {
    userId,
    answers: gradedAnswers,
    totalScore,
    percentage,
    passed,
    submittedAt: new Date()
  };
  
  // Update or create submission
  if (existingSubmission) {
    Object.assign(existingSubmission, submissionData);
  } else {
    this.submissions.push(submissionData);
  }
  
  return submissionData;
};

// Method to grade individual question
quizSchema.methods.gradeQuestion = function(question, userAnswer) {
  let isCorrect = false;
  let score = 0;
  
  switch (question.questionType) {
    case 'single-choice':
      // Find the correct option
      const correctOption = question.options.find(opt => opt.isCorrect === true);
      isCorrect = userAnswer === correctOption.text;
      score = isCorrect ? question.points : 0;
      break;
      
    case 'true-false':
      const correctTF = question.options.find(opt => opt.isCorrect === true);
      isCorrect = userAnswer === correctTF.text;
      score = isCorrect ? question.points : 0;
      break;
      
    case 'multiple-choice':
      // Handle array of selected answers
      const selectedAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      const correctAnswers = question.options
        .filter(opt => opt.isCorrect === true)
        .map(opt => opt.text);
      
      const sameCount = correctAnswers.length === selectedAnswers.length;
      const allMatch = selectedAnswers.every(ans => correctAnswers.includes(ans));
      isCorrect = sameCount && allMatch;
      score = isCorrect ? question.points : 0;
      break;
      
    case 'short-answer':
      // Case-insensitive comparison, trim whitespace
      const normalizedUserAnswer = userAnswer?.toString().toLowerCase().trim();
      const normalizedCorrectAnswers = question.correctAnswer?.map(ans => ans.toLowerCase().trim());
      
      isCorrect = normalizedCorrectAnswers?.some(
        correct => correct === normalizedUserAnswer
      ) || false;
      score = isCorrect ? question.points : 0;
      break;
      
    case 'essay':
      // Essay questions need manual grading
      isCorrect = false;
      score = 0; // Will be updated by instructor
      break;
      
    default:
      isCorrect = false;
      score = 0;
  }
  
  return { isCorrect, score };
};

// Method to get latest submission for a user
quizSchema.methods.getLatestScoreForUser = function(userId) {
  const userSubmissions = this.submissions.filter(
    sub => sub.userId.toString() === userId.toString()
  );
  
  if (userSubmissions.length === 0) return null;
  
  // Return latest submission
  return userSubmissions.sort((a, b) => b.submittedAt - a.submittedAt)[0];
};

// Method to get all submissions for a user
quizSchema.methods.getAllSubmissionsForUser = function(userId) {
  return this.submissions.filter(
    sub => sub.userId.toString() === userId.toString()
  );
};

// Static method to get quiz statistics
quizSchema.statics.getQuizStatistics = async function(quizId) {
  const quiz = await this.findById(quizId);
  if (!quiz) return null;
  
  const submissions = quiz.submissions;
  const totalAttempts = submissions.length;
  const averageScore = submissions.reduce((sum, sub) => sum + sub.percentage, 0) / totalAttempts || 0;
  const passRate = (submissions.filter(sub => sub.passed).length / totalAttempts) * 100 || 0;
  
  return {
    totalAttempts,
    averageScore,
    passRate,
    highestScore: Math.max(...submissions.map(s => s.percentage), 0),
    lowestScore: Math.min(...submissions.map(s => s.percentage), 0)
  };
};

export default mongoose.model('Quiz', quizSchema);