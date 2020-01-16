const express = require('express');
const router = express.Router();
const Post = require('../../models/Admin/Post');
const Category = require('../../models/Admin/Category');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {
    Post.find({})
        .sort({ date: -1 })
        .then((posts) => {
            Category.find({}).then((cat) => {
                res.render('home/index', { posts: posts, cat: cat });
            });
        })
        .catch((err) => {
            res.send(err.message);
        });
});
router.get('/about', (req, res) => {
    res.render('home/about');
});

router.get('/login', (req, res) => {
    res.render('home/login');
});

router.get('/register', (req, res) => {
    res.render('home/register');
});

router.get('/post/:id', (req, res) => {
    Post.findOne({ postId: req.params.id }).then((post) => {
        Category.find({}).then((cat) => {
            res.render('home/post', { post: post, cat: cat });
        });
    });
});

module.exports = router;