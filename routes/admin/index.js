const express = require('express');
const router = express.Router();

// Set layout
router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
})

router.get('/',(req,res)=>{
    res.render('admin')
})

module.exports = router;