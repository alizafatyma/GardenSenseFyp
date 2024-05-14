const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the User model
        required: true
    },
    // cid: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category', // Reference to the Category model
    //     required: true
    // },
    deleted: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    deleterUid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' // Reference to the User model
    },
    edited: {
        type: Date,
        default: null
    },
    replies: {
        type: Number,
        default: 0
    },
    bookmarks: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    imageUrls: {
        type: [String] // Array to store multiple image URLs
    }
});

const post = mongoose.model('post', postSchema);

module.exports = post;