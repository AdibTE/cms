const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Post = require('../../models/Admin/Post');
const Category = require('../../models/Admin/Category');
const User = require('../../models/Admin/User');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {
    Post.find({})
        .sort({ date: -1 })
        .then((posts) => {
            Category.find({}).then((cat) => {
                res.render('home/index', { posts: posts, cat: cat, viewName: 'Home' });
            });
        })
        .catch((err) => {
            res.send(err.message);
        });
});

router.get('/category/:name', (req, res) => {
    Category.findOne({ name: req.params.name })
        .then((cat) => {
            Post.find({ category: cat._id }).then((posts) => {
                Category.find({}).then((allcat) => {
                    res.render('home/index', { posts: posts, cat: allcat, viewName: cat.name });
                });
            });
        })
        .catch((err) => {
            res.render('404');
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

router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.passwordConfirm) {
        errors.push(`Password doesn't match!`);
    }
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
        errors.push('All fields are required');
    }
    User.find({ email: req.body.email }).then((found) => {
        if (found.length > 0) {
            errors.push(`This Email has been registered!`);
        }
        if (errors.length == 0) {
            let newuser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newuser.password, salt, (err, hash) => {
                    newuser.password = hash;
                    newuser
                        .save()
                        .then((user) => {
                            res.render('home/register', { success: true });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
            });
        } else {
            res.render('home/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        }
    });
});

router.get('/post/:id', (req, res) => {
    Post.findOne({ postId: req.params.id }).then((post) => {
        Category.find({}).then((cat) => {
            res.render('home/post', { post: post, cat: cat });
        });
    });
});

module.exports = router;