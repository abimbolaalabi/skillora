import mongoose from 'mongoose';



const optionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  isCorrect: { type: Boolean, default: false }
}, { _id: true });

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true, trim: true },
  questionType: {
    type: String,
    enum: ['single-choice', 'multiple-choice', 'true-false', 'short-answer'],
    default: 'single-choice'
  },
  options: [optionSchema],
  correctAnswer: [{ type: String, trim: true }],
  points: { type: Number, default: 1, min: 0 }
}, { _id: true });

const submissionAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedOptionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz.questions._id' }],
  answerText: { type: String, trim: true },
  isCorrect: { type: Boolean, default: false },
  score: { type: Number, default: 0 }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'graded'],
    default: 'draft'
  },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  gradedAt: { type: Date },
  answers: [submissionAnswerSchema],
  score: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  passed: { type: Boolean, default: false }
}, { timestamps: true });

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  questions: [questionSchema],
  passingPercentage: { type: Number, default: 70, min: 0, max: 100 },
  durationMinutes: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  submissions: [submissionSchema]
}, { timestamps: true });

quizSchema.methods.calculateTotalPoints = function () {
  return this.questions.reduce((sum, question) => sum + (question.points || 0), 0);
};

quizSchema.methods.gradeSubmission = function (submission) {
  const totalPoints = this.calculateTotalPoints();
  let earnedPoints = 0;

  submission.answers = submission.answers.map((answer) => {
    const question = this.questions.id(answer.questionId);
    if (!question) {
      return { ...answer, isCorrect: false, score: 0 };
    }

    let isCorrect = false;
    let score = 0;

    if (question.questionType === 'short-answer') {
      const expected = question.correctAnswer.map((a) => a.trim().toLowerCase()).filter(Boolean);
      const actual = (answer.answerText || '').trim().toLowerCase();
      isCorrect = expected.includes(actual);
      score = isCorrect ? question.points : 0;
    } else {
      const correctOptionIds = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt._id.toString());

      const selectedIds = (answer.selectedOptionIds || []).map((id) => id.toString());

      if (question.questionType === 'single-choice' || question.questionType === 'true-false') {
        isCorrect = selectedIds.length === 1 && correctOptionIds.includes(selectedIds[0]);
        score = isCorrect ? question.points : 0;
      } else if (question.questionType === 'multiple-choice') {
        const sameCount = correctOptionIds.length === selectedIds.length;
        const allMatch = selectedIds.every((id) => correctOptionIds.includes(id));
        isCorrect = sameCount && allMatch;
        score = isCorrect ? question.points : 0;
      }
    }

    if (isCorrect) earnedPoints += score;

    return {
      ...answer,
      isCorrect,
      score
    };
  });

  submission.score = earnedPoints;
  submission.percentage = totalPoints ? Number(((earnedPoints / totalPoints) * 100).toFixed(2)) : 0;
  submission.passed = submission.percentage >= this.passingPercentage;
  submission.status = 'graded';
  submission.gradedAt = new Date();

  return submission;
};

quizSchema.methods.submitQuiz = function (userId, answers = []) {
  const submission = {
    userId,
    status: 'submitted',
    startedAt: new Date(),
    submittedAt: new Date(),
    answers,
    score: 0,
    percentage: 0,
    passed: false
  };

  const gradedSubmission = this.gradeSubmission(submission);
  this.submissions.push(gradedSubmission);
  return gradedSubmission;
};

quizSchema.methods.getLatestScoreForUser = function (userId) {
  const userSubmissions = this.submissions
    .filter((sub) => sub.userId?.toString() === userId.toString())
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  return userSubmissions[0] || null;
};

export default mongoose.model('Quiz', quizSchema);
