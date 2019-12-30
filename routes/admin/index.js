const express = require('express');
const router = express.Router();
const Post = require('../../models/Admin/Post')
const faker = require('faker')

// Set layout
router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
})

// Index route
router.get('/',(req,res)=>{
    res.render('admin')
})

// Generates fake post
router.post('/gen_fake_post',(req,res)=>{
    Post.find().sort({ postId: -1 }).limit(1).then((sr)=>{
        sr[0] != undefined ? global.postId = sr[0].postId : global.postId = 0;
        for(let i=0;i<req.body.amount;i++){
            let post = new Post();
            post.title = faker.lorem.sentences(2);
            post.body = faker.lorem.paragraph(20);
            post.allowComments = true;
            post.status = "public";
            post.postId = ++global.postId;
            post.save();
        }
        res.render('admin',{added:true})
    })
})


// Delete all posts
router.post('/removeAllPost',(req,res)=>{
    Post.deleteMany({}).then(()=>{
        res.render('admin',{deleted:true})
    }).catch(err=>{console.log(err.message)})
})

module.exports = router;