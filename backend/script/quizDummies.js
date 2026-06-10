import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Quiz from '../models/Quiz.js';

dotenv.config();
connectDB();

const quizDummies = async () => {
  try {
    await connectDB();

    const existingQuiz = await Quiz.findOne({ title: 'JavaScript Basics Quiz' });
    if (existingQuiz) {
      console.log('Quiz already exists:', existingQuiz._id);
      return;
    }

    const quiz = new Quiz({
      title: 'JavaScript Basics Quiz',
      description: 'A 10-question quiz covering JavaScript fundamentals.',
      passingPercentage: 70,
      durationMinutes: 30,
      isPublished: true,
      questions: [
        {
          questionText: 'What is the output of typeof null?',
          questionType: 'multiple-choice',
          options: [
            { text: 'object', isCorrect: true },
            { text: 'null', isCorrect: false },
            { text: 'undefined', isCorrect: false }
          ],
          points: 1
        },
        {
          questionText: 'Which keyword declares a block-scoped variable?',
          questionType: 'multiple-choice',
          options: [
            { text: 'var', isCorrect: false },
            { text: 'let', isCorrect: true },
            { text: 'function', isCorrect: false }
          ],
          points: 1
        },
        {
          questionText: 'Which array method returns a new array by transforming each element?',
          questionType: 'multiple-choice',
          options: [
            { text: 'forEach', isCorrect: false },
            { text: 'map', isCorrect: true },
            { text: 'filter', isCorrect: false }
          ],
          points: 1
        },
        {
          questionText: 'let variables can be re-declared in the same scope.',
          questionType: 'multiple-choice',
          options: [
            { text: 'True', isCorrect: false },
            { text: 'False', isCorrect: true }
          ],
          points: 1
        },
        {
          questionText: 'Which built-in method converts a JSON string into a JavaScript object?',
          questionType: 'multiple-choice',
          options: [
            { text: 'JSON.parse()', isCorrect: true },
            { text: 'JSON.stringify()', isCorrect: false },
            { text: 'Object.fromJSON()', isCorrect: false }
          ],
          points: 1
        },
        {
          questionText: 'Write the syntax of an arrow function that returns x * 2.',
          questionType: 'multiple-choice',
          options: [
            { text: 'x => x * 2', isCorrect: true },
            { text: '(x) => { return x * 2 }', isCorrect: false },
            { text: 'function(x) { x * 2 }', isCorrect: false }
          ],
          points: 2
        },
        {
          questionText: 'Which operator checks strict equality in JavaScript?',
          questionType: 'multiple-choice',
          options: [
            { text: '==', isCorrect: false },
            { text: '===', isCorrect: true },
            { text: '=', isCorrect: false }
          ],
          points: 1
        },
        {
          questionText: 'Select all primitive types in JavaScript.',
          questionType: 'multiple-choice',
          options: [
            { text: 'string', isCorrect: true },
            { text: 'number', isCorrect: true },
            { text: 'boolean', isCorrect: true },
            { text: 'object', isCorrect: false },
            { text: 'null', isCorrect: true }
          ],
          points: 2
        },
        {
          questionText: 'What is the value of a after executing: let a = [1, 2]; a.push(3);?',
          questionType: 'multiple-choice',
          options: [
            { text: '[1,2,3]', isCorrect: true },
            { text: '[1,2]', isCorrect: false },
            { text: '[1,2,3,4]', isCorrect: false }
          ],
          points: 1
        },
        {
          questionText: 'const declarations must be initialized when they are created.',
          questionType: 'multiple-choice',
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false }
          ],
          points: 1
        }
      ]
    });

    await quiz.save();
    console.log('Quiz created successfully:', quiz._id);
  } catch (error) {
    console.error('Error creating quiz:', error);
  } finally {
    process.exit();
  }
};

quizDummies();
