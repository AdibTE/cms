const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    status: {
        type: String,
        default: 'public'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    allowComments: {
        type: Boolean,
        default: false
    },
    postId: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now()
    },
    file: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
}, { usePushEach: true });

module.exports = mongoose.model('post', postSchema);