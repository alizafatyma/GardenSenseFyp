const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    pid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true,
    },
    commentField: {
        type: String,
        required: true,
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

const comment = mongoose.model("comment", commentSchema);

module.exports(comment);