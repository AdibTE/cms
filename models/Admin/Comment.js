const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    approved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Comments', commentSchema);