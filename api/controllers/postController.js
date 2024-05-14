const User = require("../models/users");
const Post = require("../models/post");
//const Category = require('./models/Category');

const multer = require('multer');

const postController = {
    createPost: async (req, res) => {
        try {
            console.log('Request body in controller:', req.body);
            console.log('Request files in controller:', req.files);
            const { uid, content, title } = req.body;

            // Check if user ID is provided and valid
            if (!uid) {
                throw new Error('User ID is required');
            }
            const user = await User.findById(uid);
            if (!user) {
                throw new Error('Invalid user ID');
            }

            // Check if content is provided
            if (!content) {
                throw new Error('Content is required');
            }

            // Extract uploaded images from request
            let imageUrls = [];
            if (req.files && req.files.length > 0) {
                imageUrls = req.files.map(file => file.path);
            }
            const postData = new Post({
                uid: uid,
                content: content || '',
                title: title || '',
                imageUrls: imageUrls || [],
                timestamp: Date.now()
            });

            const newPost = await postData.save();
            return res.status(201).json(newPost);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    getAllPosts: async (req, res) => {
        try {

            console.log("getting posts");
            // Query all post documents from the database
            const posts = await Post.find({})
                .populate('uid') // Populate the 'uid' field with user details
                .sort({ timestamp: -1 }); // Sort by timestamp in descending order

            // Send the retrieved posts as a JSON response
            return res.status(200).json(posts);
        } catch (error) {
            // Handle errors
            return res.status(500).json({ error: error.message });
        }
    },

    getPostById: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id).populate('uid');
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            res.status(200).json(post);
        }
        catch (error) {
            // Handle errors
            console.error("Error in getPostById:", error);
            return res.status(500).json({ error: error.message });
        }
    },

    getPostsByUserId: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error("Invalid User ID");
            }

            const posts = await Post.find({ uid: user.id });
            if (posts.length === 0) {
                throw new Error("User has no posts");
            }

            return res.status(200).json(posts);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    updatePost: async (req, res) => {
        try {
            // Extract the post ID from the request parameters
            const postId = req.params.id;
    
            // Check if the post ID is provided and valid
            if (!postId) {
                throw new Error("Post ID is required");
            }
    
            // Extract the updated content and title from the request body
            const { content, title } = req.body;
    
            // Construct the update object with new values
            const update = {
                ...(content && { content }),
                ...(title && { title }),
            };
            
            // Check if content or title is updated, then update the edited field
            if (content || title) {
                update.edited = Date.now();
            }
            
    
            // Update the post in the database using findByIdAndUpdate
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                update,
                { new: true }
            );
    
            // Check if the post exists
            if (!updatedPost) {
                return res.status(404).json({ message: "Post not found" });
            }
    
            // Return the updated post in the response
            return res.status(200).json(updatedPost);
        } catch (error) {
            // Handle errors
            return res.status(500).json({ error: error.message });
        }
    }
    
    

};

module.exports = postController;