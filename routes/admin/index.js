const express = require('express');
const router = express.Router();
const Post = require('../../models/Admin/Post');
const Category = require('../../models/Admin/Category');
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
	res.render('admin');
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
		res.render('admin', { added: true });
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
			res.render('admin', { deleted: true });
		})
		.catch((err) => {
			console.log(err.message);
		});
});

// Profile router
router.get('/profile', (req, res) => {
	User.findOne({ _id: req.user._id })
		.then((user) => {
			res.render('admin/profile',user);
		})
		.catch((err) => res.send(err));
});

module.exports = router;
