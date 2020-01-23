const express = require('express');
const router = express.Router();
const Post = require('../../models/Admin/Post');
const Category = require('../../models/Admin/Category');
const Comment = require('../../models/Admin/Comment');
const { isEmpty, uploadDir } = require('../../helpers/uploadHelper');
const fs = require('fs');
const { userAuth } = require('../../helpers/authUser');

// Set layout
router.all('/*', userAuth, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

// Index GET route
router.get('/', (req, res) => {
    Post.find({})
        .sort({ date: -1 })
        .populate('category')
        .then((posts) => {
            res.render('admin/posts/index', { posts: posts });
        })
        .catch((err) => {
            res.send(err.message);
        });
});

// Create GET route
router.get('/create', (req, res) => {
    Category.find({}).then((cat) => {
        res.render('admin/posts/create', { cat: cat });
    });
});

// Create POST route
router.post('/create', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ message: 'Title is required' });
    }
    if (!req.body.body) {
        errors.push({ message: 'Body is required' });
    }
    if (errors.length > 0) {
        res.render('admin/posts/create', { errors: errors });
    } else {
        let filename = 'default.jpg';
        if (req.files) {
            let file = req.files.file;
            filename = Date.now() + '-' + file.name;
            file.mv('./public/uploads/' + filename, (err) => {
                if (err) throw err;
            });
        }
        let allowComments = true;
        req.body.allowComments == undefined ? (allowComments = false) : (allowComments = true);
        Post.find().sort({ postId: -1 }).limit(1).then((sr) => {
            sr[0] != undefined ? (global.postId = sr[0].postId) : (global.postId = 0);
            const newPost = new Post({
                status: req.body.status,
                title: req.body.title,
                body: req.body.body,
                allowComments: allowComments,
                postId: ++global.postId,
                date: Date.now(),
                file: filename,
                category: req.body.category
            });
            newPost
                .save()
                .then((savedPost) => {
                    res.render('admin/posts/create', { postCreate: true });
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }
});

// Edit GET route
router.get('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .populate('category')
        .then((post) => {
            Category.find({}).then((cat) => {
                res.render('admin/posts/edit', { post: post, cat: cat });
            });
        })
        .catch((err) => {
            res.send(err.message);
        });
});

// Edit PUT route
router.put('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            req.body.allowComments == undefined ? (allowComments = false) : (allowComments = true);
            post.status = req.body.status;
            post.title = req.body.title;
            post.body = req.body.body;
            post.allowComments = allowComments;
            post.category = req.body.category;
            post.date = Date.now();

            let filename = 'default.jpg';
            if (req.files) {
                let file = req.files.file;
                filename = Date.now() + '-' + file.name;
                file.mv('./public/uploads/' + filename, (err) => {
                    if (err) throw err;
                });
                if (post.file != 'default.jpg') {
                    fs.unlink(uploadDir + post.file, (err) => {
                        if (err) throw err;
                    });
                }
            } else if (post.file != 'default.jpg') {
                filename = post.file;
            }
            post.file = filename;
            post
                .save()
                .then((post) => {
                    res.render(`admin/posts/edit`, { post: post, postEdit: true });
                })
                .catch((err) => {
                    res.send(err.message);
                });
        })
        .catch((err) => res.send(err.message));
});

// DELETE route
router.delete('/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            if (post.file != 'default.jpg') {
                fs.unlink(uploadDir + post.file, (err) => {
                    if (err) console.log(err);
                });
            }
            post.comments.forEach((comment) => {
                Comment.deleteOne({ _id: comment }).then(() => {}).catch((err) => {
                    console.log(err);
                });
            });
            post.remove();
        })
        .then(() => {
            Post.find({})
                .then((posts) => {
                    res.render('admin/posts/index', { posts: posts, postDelete: true });
                })
                .catch((err) => {
                    res.send(err.message);
                });
        })
        .catch((err) => {
            res.send(err);
        });
});

module.exports = router;