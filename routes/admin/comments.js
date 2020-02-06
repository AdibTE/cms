const express = require('express');
const router = express.Router();
const Category = require('../../models/Admin/Category');
const User = require('../../models/Admin/User');
const Post = require('../../models/Admin/Post');
const Comment = require('../../models/Admin/Comment');
const { isOwner } = require('../../helpers/authUser');

// Set layout
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

// Post new comment
router.post('/', (req, res) => {
    Post.findOne({ _id: req.body.id }).then((_fpost) => {
        const newComment = new Comment({
            user: req.user.id,
            body: req.body.body,
            date: Date.now()
        });
        _fpost.comments.push(newComment);
        _fpost
            .save()
            .then((_spost) => {
                newComment.save();
                req.flash('success_message', 'Comment posted. It will show when it approves by the admin');
                res.redirect(`/post/${_fpost.postId}`);
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

// Get all comments
router.get('/', (req, res) => {
    let cond = req.user.type.type == 0 ? {} : { user: req.user.id };
    Post.find(cond)
        .sort({ date: -1 })
        .populate('category')
        .populate('user')
        .then((posts) => {
            res.render('admin/comments/main', { posts: posts });
        })
        .catch((err) => {
            res.send(err.message);
        });
});

// Get Post Comments
router.get('/:id', isOwner, (req, res) => {
    Post.findOne({ _id: req.params.id }).populate({ path: 'comments', populate: 'user' }).then((post) => {
        res.render('admin/comments', { comments: post.comments, postId: req.params.id });
    });
});

// Get post comments count
router.get('/getCount/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).populate('comments').then((post) => {
        res.send({ count: post.comments.length });
    });
});

// Approve comment
router.patch('/:id', (req, res) => {
    Comment.findOne({ _id: req.params.id }).then((comment) => {
        comment.approved = req.body.approved;
        comment.save().catch((err) => {
            console.log(err);
        });
        res.redirect('/admin/comments');
    });
});

// Delete comment
router.delete('/:cid/:id', isOwner, (req, res) => {
    Comment.deleteOne({ _id: req.params.cid }).then((comment) => {
        req.flash('success_message', 'Comment Deleted successfuly');
        res.redirect('/admin/comments');
    });
});

module.exports = router;