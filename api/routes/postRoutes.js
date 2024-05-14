const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const {uploadPostImages} = require("../middlewares/multer")

router.post('/create', uploadPostImages, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/user/:id', postController.getPostsByUserId);
router.put('/:id', postController.updatePost);


// Forum Posts Routes
//router.post('/create', postController.createPost);
// router.get('/posts', forumController.getAllPosts);
// router.get('/posts/:id', forumController.getPostById);
// router.put('/posts/:id', forumController.updatePost);
// router.delete('/posts/:id', forumController.deletePost);

// // Comments Routes
// router.post('/posts/:postId/comments', forumController.createComment);
// router.get('/posts/:postId/comments', forumController.getAllComments);
// router.get('/posts/:postId/comments/:commentId', forumController.getCommentById);
// router.put('/posts/:postId/comments/:commentId', forumController.updateComment);
// router.delete('/posts/:postId/comments/:commentId', forumController.deleteComment);

// // Categories Routes
// router.post('/categories', forumController.createCategory);
// router.get('/categories', forumController.getAllCategories);
// router.get('/categories/:id', forumController.getCategoryById);
// router.put('/categories/:id', forumController.updateCategory);
// router.delete('/categories/:id', forumController.deleteCategory);

// // User Interactions Routes
// router.post('/posts/:postId/upvote', forumController.upvotePost);
// router.post('/posts/:postId/downvote', forumController.downvotePost);
// router.post('/posts/:postId/comments/:commentId/upvote', forumController.upvoteComment);
// router.post('/posts/:postId/comments/:commentId/downvote', forumController.downvoteComment);

module.exports = router;
