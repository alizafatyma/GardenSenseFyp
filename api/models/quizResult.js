const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    level: {
        type: String,
        enum:['Hard','Intermediate', 'Easy'],
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        require: true
    }
})

const quizResult = mongoose.model('quizResult', quizResultSchema);

module.exports = quizResult;