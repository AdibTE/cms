const express = require('express');
const router = express.Router();
const Post = require('../../models/Admin/Post')
const faker = require('faker')

// Set layout
router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
})

router.get('/',(req,res)=>{
    res.render('admin')
})

router.post('/gen_fake_post',(req,res)=>{
    for(let i=0;i<req.body.amount;i++){
        let post = new Post();
        post.title = faker.lorem.sentences(2);
        post.body = faker.lorem.paragraph(20);
        post.allowComments = true;
        post.status = "public";
        post.save();
    }
    res.redirect('/admin/posts')
})

module.exports = router;