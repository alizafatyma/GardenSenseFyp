const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Endpoint to fetch quiz questions
router.get('/', quizController.fetchQuizQuestions);

// Endpoint to post a new quiz question
router.post('/', quizController.postQuizQuestion);

router.post('/score', quizController.calculateQuizScore);

module.exports = router;
