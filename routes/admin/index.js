const express = require('express');
const router = express.Router();
const Post = require('../../models/Admin/Post');
const Category = require('../../models/Admin/Category');
const Comment = require('../../models/Admin/Comment');
const User = require('../../models/Admin/User');
const faker = require('faker');
const { uploadDir } = require('../../helpers/uploadHelper');
const fs = require('fs');
const { userAuth } = require('../../helpers/authUser');

// Set layout
router.all('/*', userAuth, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

// Index route
router.get('/', (req, res) => {
    const promises = [
        Post.find({}).exec(),
        User.find({}).exec(),
        Category.find({}).exec(),
        Comment.find({}).exec(),
        Post.find({ user: req.user }).exec(),
        Post.findOne({}).sort({ date: -1 }).exec()
    ];
    Promise.all(promises).then(([posts, users, cats, comments, userposts, lastPost]) => {
        res.render('admin', {
            postCount: posts.length,
            userCount: users.length,
            catCount: cats.length,
            comCount: comments.length,
            userPostCount: userposts.length,
            lastPost: lastPost
        });
    });
});

// Generates fake post
router.post('/gen_fake_post', (req, res) => {
    Post.find().sort({ postId: -1 }).limit(1).then((sr) => {
        sr[0] != undefined ? (global.postId = sr[0].postId) : (global.postId = 0);

        for (let i = 0; i < req.body.amount; i++) {
            let post = new Post();
            post.user = req.user.id;
            post.title = faker.name.title();
            post.file = 'default.jpg';
            post.body = faker.lorem.paragraph(20);
            post.allowComments = true;
            post.status = 'public';
            post.postId = ++global.postId;
            post.date = Date.now();
            Category.find({}).then((all) => {
                let length = all.length;
                let randomCategory = Math.floor(Math.random() * Math.floor(length));
                post.category = all[randomCategory];
                post.save();
            });
        }
        req.flash('success_alert', 'Done!');
        res.redirect('/admin');
    });
});

// Delete all posts
router.post('/removeAllPost', (req, res) => {
    Post.deleteMany({})
        .then((post) => {
            if (post.file != 'default.jpg') {
                console.log(post.file);
                // fs.unlink(uploadDir + post.file, (err) => {
                //     if (err) throw err;
                // });
            }
            req.flash('success_alert', 'Posts Deleted!');
            res.redirect('/admin');
        })
        .catch((err) => {
            console.log(err.message);
        });
});

// Profile router
router.get('/profile', (req, res) => {
    User.findOne({ _id: req.user._id })
        .then((user) => {
            res.render('admin/profile', user);
        })
        .catch((err) => res.send(err));
});

// Change Profile router
router.put('/profile', (req, res) => {
    if (req.files) {
        let file = req.files.picture;
        filename = Date.now() + '-' + file.name;
        file.mv('./public/uploads/profile/' + filename, (err) => {
            if (err) throw err;
        });
    } else {
        filename = req.user.picture;
    }
    User.findOneAndUpdate({ _id: req.user._id }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            picture: filename
        }, { new: true })
        .then(() => {
            req.flash('success_alert', 'Profile info has been changed.');
            res.redirect('/admin/profile');
        })
        .catch((err) => {
            res.send(err);
        });
});

module.exports = router;