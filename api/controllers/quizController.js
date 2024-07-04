const QuizQuestion = require('../models/quizQuestion');
const quizResult = require('../models/quizResult');
const user = require('../models/users');
// Controller function to fetch quiz questions
const fetchQuizQuestions = async (req, res) => {
    const { level, numQuestions } = req.query;

    // Validate level
    const validLevels = ['Easy', 'Intermediate', 'Hard'];
    if (!validLevels.includes(level)) {
        return res.status(400).json({ error: 'Invalid level provided. Valid levels are Easy, Intermediate, and Hard.' });
    }

    // Validate numQuestions
    const numQuestionsInt = parseInt(numQuestions, 10);
    if (isNaN(numQuestionsInt) || numQuestionsInt <= 0) {
        return res.status(400).json({ error: 'numQuestions must be a positive integer.' });
    }

    try {
        const questions = await QuizQuestion.aggregate([
            { $match: { level } },
            { $sample: { size: numQuestionsInt } }
        ]);

        if (questions.length === 0) {
            return res.status(404).json({ error: 'No questions found for the specified level.' });
        }

        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching quiz questions.' });
    }
};

// Controller function to post a new quiz question
const postQuizQuestion = async (req, res) => {
    const { question, options, correctAnswer, level } = req.body;


    const questionExists = await QuizQuestion.findOne({ question });
    if (questionExists) {
        console.log('Question already exists');
        return res.status(409).json({ error: 'Question already exists' });
    }
    // Validate level
    const validLevels = ['Easy', 'Intermediate', 'Hard'];
    if (!validLevels.includes(level)) {
        return res.status(400).json({ error: 'Invalid level provided. Valid levels are Easy, Intermediate, and Hard.' });
    }

    // Validate that there are exactly 3 options
    if (!Array.isArray(options) || options.length !== 3) {
        return res.status(400).json({ error: 'There must be exactly 3 options.' });
    }

    // Validate that the correct answer is one of the options
    if (!options.includes(correctAnswer)) {
        return res.status(400).json({ error: 'Correct answer must be one of the options.' });
    }

    try {
        const newQuestion = new QuizQuestion({ question, options, correctAnswer, level });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving the question:' + error });
    }
};

const calculateUserRating = async (userId) => {
    try {
        const results = await quizResult.find({ userId });
        if (results.length === 0) {
            console.log('No quiz results found for the user.');
            return; // No quiz results to calculate rating
        }

        let totalWeightedScore = 0;
        let totalWeight = 0;

        results.forEach(result => {
            console.log(result);
            let weight = 1;
            if (result.level === 'Intermediate') weight = 2;
            if (result.level === 'Hard') weight = 3;
            totalWeightedScore += (result.score / result.totalQuestions) * weight;
            totalWeight += weight;
        });

        if (totalWeight > 0) {
            const weightedAverage = totalWeightedScore / totalWeight;
            await user.findByIdAndUpdate(userId, { userRating: weightedAverage });
            console.log(await user.findById(userId));
            console.log(`User rating updated successfully for userId: ${userId}`);
        } else {
            console.log('No valid quiz results to calculate user rating.');
        }
    } catch (error) {
        console.error(`Error calculating user rating: ${error.message}`);
    }
};

const calculateQuizScore = async (req, res) => {
    const { userId, userAnswers, level } = req.body;
    try {
        const userExists = await user.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (userAnswers.length < 1) {
            return res.status(404).json({ error: 'User answers not recieved.' });
        }

        const validLevels = ['Easy', 'Intermediate', 'Hard'];
        if (!validLevels.includes(level)) {
            return res.status(400).json({ error: 'Invalid level provided. Valid levels are Easy, Intermediate, and Hard.' });
        }
        let score = 0;
        for (const userAnswer of userAnswers) {
            const question = await QuizQuestion.findById(userAnswer.questionId);
            if (!question) {
                return res.status(404).json({ error: `Question with ID ${userAnswer.questionId} not found.` });
            }
            if(!question.options.includes(userAnswer.selectedOption))
            {
                return res.status(400).json({ error: `Invalid selected option "${userAnswer.selectedOption}" for question: ${question.question}` });
            }
            if (question.correctAnswer === userAnswer.selectedOption) {
                score++;
            }
        }
        const result = new quizResult({
            userId,
            totalQuestions: userAnswers.length,
            score,
            level
        });
        await result.save();
        await calculateUserRating(userId);

        res.status(200).json({ score });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while calculating the quiz score.' });
    }

};


module.exports = {
    fetchQuizQuestions,
    postQuizQuestion,
    calculateQuizScore
};