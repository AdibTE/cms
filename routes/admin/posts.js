const express = require('express');
const router = express.Router();
const Post = require("../../models/Admin/Post");


// Set layout
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
})


// Index route
router.get('/', (req, res) => {
    Post.find({})
        .then(posts => {
            res.render('admin/posts/index', { posts: posts })
        })
        .catch(err => {
            res.send(err.message);
        });
})


// Create GET route
router.get('/create', (req, res) => {
    res.render('admin/posts/create')
})


// Create POST route
router.post('/create', (req, res) => {
    let allowComments = true;
    req.body.allowComments == undefined ? allowComments = false : allowComments = true;
    const newPost = new Post({
        status: req.body.status,
        title: req.body.title,
        body: req.body.body,
        allowComments: allowComments,
    })
    newPost.save().then(savedPost => {
        console.log('[ USER SAVED ] id: ' + savedPost._id)
        res.redirect('/admin/posts')
    }).catch(err => { 
        res.render('admin/posts/create',{alerts:{e:true}})
     })
})


// Edit GET route
router.get('/edit/:id', (req, res) => {
    Post.find({ _id: req.params.id })
        .then(post => {
            res.render('admin/posts/edit', { post: post[0] })
        }).catch(err => {
            res.send(err.message);
        })
})


// Edit PUT route
router.put('/edit/:id',(req,res)=>{
    let allowComments = true;
    req.body.allowComments == undefined ? allowComments = false : allowComments = true;
    Post.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            status: req.body.status,
            title: req.body.title,
            body: req.body.body,
            allowComments: allowComments
        }
    }).then(()=>{
        Post.find({ _id: req.params.id })
        .then(post => {
            res.render('admin/posts/edit', { post: post[0] , alerts:{s:true,w:false,e:false}})
        }).catch(err => {
            res.send(err.message);
        })
    }).catch(err => res.send(err.message))
});


// DELETE route
router.delete('/:id',(req,res)=>{
    Post.findOne({_id : req.params.id}).then(post=>{
        post.remove();
    }).then(()=>{
        Post.find({})
        .then(posts => {
            res.render('admin/posts/index', { posts: posts,alerts:{s:true,w:false,e:false} })
        })
        .catch(err => {
            res.send(err.message);
        });
    }).catch(err=>{res.send(err)})
})

module.exports = router;