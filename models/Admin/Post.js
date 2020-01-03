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
        type: Date
    },
    // image:{
    // 	type: String,
    // 	default: "http://placehold.it/750x300"
    // },
    file: {
        type: String
    }
});

module.exports = mongoose.model('post', postSchema);