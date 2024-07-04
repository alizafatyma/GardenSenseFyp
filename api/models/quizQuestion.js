const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true , unique: true},
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  level: { type: String, enum: ['Easy', 'Intermediate', 'Hard'], required: true },
});

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

module.exports = QuizQuestion;
