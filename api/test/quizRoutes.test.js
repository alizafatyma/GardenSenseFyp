(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const server = await import('../index'); // Replace with your server entry point
    const should = chai.should();
    const { fetchQuizQuestions, postQuizQuestion, calculateQuizScore } = require('../controllers/quizController');
    const { QuizQuestion } = require('../models/quizQuestion');
    const { quizResult } = require('../models/quizResult');
    const { user } = require('../models/users');

    chai.use(chaiHttp);

    describe('Quiz Controller', () => {

        describe('fetchQuizQuestions', () => {
            it('should fetch quiz questions', (done) => {
                chai.request(server.default)
                    .get('/api/quiz') // Adjust endpoint based on your route setup
                    .query({ level: 'Easy', numQuestions: 5 })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('array');
                        // Add more assertions based on your expected output
                        done();
                    });
            });

            it('should handle invalid level', (done) => {
                chai.request(server.default)
                    .get('/api/quiz')
                    .query({ level: 'InvalidLevel', numQuestions: 5 })
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('error').eql('Invalid level provided. Valid levels are Easy, Intermediate, and Hard.');
                        done();
                    });
            });

            // Add more test cases for fetchQuizQuestions as needed
        });

        describe('postQuizQuestion', () => {
            it('should post a new quiz question', (done) => {
                const newQuestion = {
                    question: "What is 2 + 2?",
                    options: ["3", "4", "5"],
                    correctAnswer: "4",
                    level: "Easy"
                };
                chai.request(server.default)
                    .post('/api/quiz')
                    .send(newQuestion)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.an('object');
                        res.body.should.have.property('question').eql(newQuestion.question);
                        done();
                    });
            });

            // Add more test cases for postQuizQuestion as needed
        });

        describe('calculateQuizScore', () => {
            it('should calculate quiz score', (done) => {
                const scoreData = {
                    userId: 'valid_user_id',
                    userAnswers: [
                        { questionId: 'valid_question_id', selectedOption: '4' },
                        // Add more user answers as needed
                    ],
                    level: 'Easy'
                };
                chai.request(server.default)
                    .post('/api/quiz/score')
                    .send(scoreData)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('score');
                        // Add more assertions based on your expected output
                        done();
                    });
            });

            // Add more test cases for calculateQuizScore as needed
        });

        // Add test cases for calculateUserRating if needed

    });

})();
