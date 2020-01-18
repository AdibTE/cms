const express = require('express');
const router = express.Router();
const Category = require('../../models/Admin/Category');
const User = require('../../models/Admin/User');
const Post = require('../../models/Admin/Post');
const Comment = require('../../models/Admin/Comment');

// Set layout
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.post('/', (req, res) => {
    Post.findOne({ _id: req.body.id }).then((_fpost) => {
        const newComment = new Comment({
            user: req.user.id,
            body: req.body.body
        });
        _fpost.comments.push(newComment);
        _fpost
            .save()
            .then((_spost) => {
                newComment.save();
                res.redirect(`/post/${_fpost.postId}`);
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

router.get('/', (req, res) => {
    // Post.find({}).then((_fposts) => {
    //     console.log(_fposts);
    //     let $comments = [];
    //     _fposts.forEach((post) => {
    //         Comment.find({ _id: post.comments }).then((_fcomments) => {
    //             _fcomments.forEach((comment) => {
    //                 $comments.push(comment);
    //             });
    //         });
    //     });
    //     res.render('admin/comments', { comments: $comments });
    // });
    Comment.find({}).then((_fcomments) => {
        console.log(_fcomments);
        res.render('admin/comments', { comments: _fcomments });
    });
});

module.exports = router;