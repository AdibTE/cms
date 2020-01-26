const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Post = require('../../models/Admin/Post');
const Category = require('../../models/Admin/Category');
const User = require('../../models/Admin/User');
const UserType = require('../../models/Admin/UserType');
const Comment = require('../../models/Admin/Comment');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Set Layout
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

// Get All Posts
router.get('/', (req, res) => {
    let limit = parseInt(req.query.limit) || 3;
    let page = parseInt(req.query.page) || 0;
    Post.find({})
        .sort({ date: -1 })
        .limit(limit)
        .skip(page * limit)
        .populate('user')
        .then((posts) => {
            // get all posts length
            Post.find({}).then((allposts) => {
                let postslength = allposts.length;
                Category.find({}).then((cat) => {
                    res.render('home/index', {
                        posts: posts,
                        cat: cat,
                        viewName: 'Home',
                        pages: { next: page - 1, prev: page + 1, limit: limit, maxlength: postslength }
                    });
                });
            });
        })
        .catch((err) => {
            res.send(err.message);
        });
});

// Get Single Post
router.get('/post/:id', (req, res) => {
    Post.findOne({ postId: req.params.id })
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .populate('user')
        .then((post) => {
            let postOwner = req.user && req.user._id == post.user.id ? true : false;
            Category.find({}).then((cat) => {
                res.render('home/post', { post: post, cat: cat, postOwner: postOwner });
            });
        });
});

// Get Specified Category
router.get('/category/:name', (req, res) => {
    let limit = parseInt(req.query.limit) || 3;
    let page = parseInt(req.query.page) || 0;
    Category.findOne({ name: req.params.name })
        .then((cat) => {
            // get all posts length
            Post.find({ category: cat._id }).then((posts) => {
                let allposts = posts.length;
                Post.find({ category: cat._id }).populate('user').limit(limit).skip(page * limit).then((posts) => {
                    Category.find({}).then((allcat) => {
                        res.render('home/index', {
                            posts: posts,
                            cat: allcat,
                            viewName: cat.name,
                            pages: { next: page - 1, prev: page + 1, limit: limit, maxlength: allposts }
                        });
                    });
                });
            });
        })
        .catch((err) => {
            res.render('404');
        });
});

// Get About Page
router.get('/about', (req, res) => {
    res.render('home/about');
});

// Get Login Page
router.get('/login', (req, res) => {
    res.render('home/login');
});

// Passport and session
passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email: email }).then((user) => {
            if (!user) return done(null, false, { message: 'User not found' });
            bcrypt.compare(password, user.password, (err, matched) => {
                if (err) return err;
                if (matched) return done(null, user);
                else return done(null, false, { message: 'Wrong password!' });
            });
        });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id)
        .populate('type')
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            res.send(err.message);
        });
});

// Post Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Get Register Page
router.get('/register', (req, res) => {
    res.render('home/register');
});

// Post Register
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
            UserType.findOne({ type: 1 })
                .then((usertype) => {
                    let newuser = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: req.body.password,
                        type: usertype
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
                })
                .catch((err) => {
                    res.send(err);
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

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

router.get('/login.html', (req, res) => {
    res.redirect('/logout');
});

module.exports = router;